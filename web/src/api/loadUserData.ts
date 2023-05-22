import { getWorld, listWorlds } from "graphql/requests/worlds.graphql";
import {
  GlobalWorld,
  GlobalLibrary,
  GlobalUser,
  GlobalCharacter,
  updateChaptersState,
  GlobalLibraryInstance,
  addNotification,
  updateNotification,
  updateAsError,
  GlobalExploration,
  convertAPISceneToTemplate,
  setGlobalExploration
} from "state";
import { listTimelines } from "graphql/requests/timelines.graphql";
import { getBook, getChapter, listBooks } from "graphql/requests/books.graphql";
import { API_FILES_LIST_ROUTE, API_FILE_UPLOAD_ROUTE, API_PROMPT } from "utils";
import { listCharacters } from "graphql/requests/characters.graphql";
import { APIData, Chapter, Scene, Timeline, FileUploadCategory } from "utils/types";
import { MicroUser } from "graphql/requests/users.graphql";
import { insertCategory } from "routes";
import fetchRaw from "../graphql/fetch-raw";
import { fetchGQL, getUserQuery } from "graphql";
import {
  UpsertExplorationInput,
  getExploration,
  listExplorations,
  pruneExplorationData,
  upsertExploration
} from "graphql/requests/explorations.graphql";

// Additonal instructions for focusing data in the global state
type GQLRequestOpts = {
  groupId?: number;
  locationId?: number;
  explorationId?: number;
  returnUpdates?: boolean;
  timelineId?: number;
  userId?: number;
  worldId?: number;
};

/** Load user */
export async function loadUser() {
  const user = await fetchGQL<MicroUser | null>({
    query: getUserQuery(),
    fallbackResponse: null,
    onResolve: (x, errors) => errors || x.getAuthUser
  });

  GlobalUser.multiple({ ...user, authenticated: Boolean(user) });

  const { worlds: stateWorlds } = GlobalWorld.getState();
  const { books: stateBooks } = GlobalLibrary.getState();
  const params = user ? { authorId: user.id } : { public: true };
  const wparams = { ...params, parentWorldId: null };
  const [worlds, books, explorations] = await Promise.all([
    listOrLoad(stateWorlds, () => listWorlds(wparams)),
    listOrLoad(stateBooks, () => listBooks(params)),
    listExplorations(params)
  ]);

  const updates = { worlds, focusedWorld: null, worldLocations: [] };
  await Promise.all([
    GlobalLibrary.books(books),
    GlobalWorld.multiple(updates),
    GlobalExploration.explorations(explorations)
  ]);
}

/**
 * Generate a writing prompt from the API
 * @todo this should take additional parameters (world, character, etc) */
export async function getWritingPrompt(input: string | null = null) {
  const resp = await fetchRaw<{ prompt: string }>({
    url: API_PROMPT,
    timeout: 10000,
    additionalOpts: { data: JSON.stringify({ prompt: input }) },
    onResolve: (x, errors) => (errors ? new Error(errors) : x)
  });
  if (resp instanceof Error) throw resp;
  if (typeof resp === "string") throw new Error(resp);
  return resp.prompt as string;
}

/** Generate a writing prompt from OpenAI */
export async function getAndShowPrompt(input?: string, show?: boolean) {
  const notificationId = addNotification("Generating writing prompt...", true);
  try {
    const prompt = await getWritingPrompt(input);
    if (show) updateNotification(prompt, notificationId, true);
    else updateNotification("Prompt generated!", notificationId, false);
    return prompt;
  } catch (error: any) {
    updateAsError(error.message, notificationId);
    return null;
  }
}

/** Load and focus a single world */
export async function loadWorld(opts: GQLRequestOpts) {
  const { worldId, locationId } = makeAPIParams(opts);
  if (!worldId) return;
  const focusedWorld = await getWorld(worldId);
  const { Locations: worldLocations = [], Events: events } = focusedWorld || {};
  const focusedLocation = locationId
    ? worldLocations.find((l) => l.id === locationId) || null
    : null;
  GlobalWorld.multiple({
    focusedWorld,
    focusedLocation,
    worldLocations,
    events
  });
}

/** Load and focus a single chapter */
type ChapterUpdates = Pick<
  GlobalLibraryInstance,
  "focusedChapter" | "focusedScene" | "chapters"
>;
export async function loadChapter(
  chapterId: number,
  skipUpdates = false
): Promise<ChapterUpdates> {
  const defResponse: ChapterUpdates = {
    focusedChapter: null,
    focusedScene: null,
    chapters: []
  };
  if (!chapterId) return defResponse;

  const focusedChapter = await getChapter(chapterId);
  if (!focusedChapter) return defResponse;

  if (skipUpdates) {
    defResponse.focusedChapter = focusedChapter;
    defResponse.focusedScene = focusedChapter.Scenes[0] || null;
    defResponse.chapters = GlobalLibrary.getState().chapters.map((c) =>
      c.id === chapterId ? focusedChapter : c
    );
    return defResponse;
  }

  return updateChaptersState([focusedChapter]) as ChapterUpdates;
}

/** Load and focus a single book */
type BookUpdates = ChapterUpdates & Pick<GlobalLibraryInstance, "focusedBook">;
export async function loadBook(
  bookId: number,
  skipUpdates = false
): Promise<BookUpdates> {
  const lib = GlobalLibrary.getState();
  if (!bookId)
    return {
      focusedBook: lib.focusedBook,
      chapters: lib.chapters,
      focusedChapter: lib.focusedChapter,
      focusedScene: lib.focusedScene
    };

  const focusedBook = await getBook(bookId);
  const { Chapters: chapters = [] } = focusedBook || {};
  let focusedChapter: APIData<Chapter> | null = chapters[0] || null;
  const scenes = focusedChapter?.Scenes || [];
  let focusedScene: APIData<Scene> | null = scenes[0] || null;
  const allUpdates: BookUpdates = {
    focusedBook,
    chapters,
    focusedChapter,
    focusedScene
  };
  if (chapters.length) {
    const { focusedChapter } = await loadChapter(chapters[0].id, true);
    allUpdates.focusedChapter = focusedChapter;
    allUpdates.focusedScene = focusedChapter?.Scenes[0] || null;
  }

  if (!skipUpdates) GlobalLibrary.multiple(allUpdates);
  return allUpdates;
}

/** Load timelines */
export async function loadTimelines(opts: GQLRequestOpts) {
  const params = makeAPIParams(opts);
  const { timelineId } = params;
  const { focusedTimeline: focused } = GlobalWorld.getState();
  const timelines = await listTimelines(params); // listOrLoad(current, () => listTimelines(params));
  let focusedTimeline: APIData<Timeline> | null = null;
  if (timelineId)
    focusedTimeline = timelines.find((t) => t.id === timelineId) || null;
  else if (focused)
    focusedTimeline = timelines.find((t) => t.id === timelineId) || null;
  GlobalWorld.multiple({ timelines, focusedTimeline });
}

/** Load initial character data */
export async function loadCharacters(opts: GQLRequestOpts) {
  const { characters: current, focusedCharacter: focused } =
    GlobalCharacter.getState();

  const params = makeAPIParams(opts);
  const characters = await listOrLoad(current, () => listCharacters(params));
  const focusedCharacter =
    focused && characters.find((c) => c.id === focused.id);
  GlobalCharacter.multiple({ characters, focusedCharacter });
}

/** Load and focus an `Exploration` */
export async function loadExploration(opts: GQLRequestOpts) {
  const { explorationId } = makeAPIParams(opts);
  if (!explorationId)
    return { exploration: null, explorations: [], explorationScene: null };
  const exploration = await getExploration(explorationId);
  return setGlobalExploration(exploration);
}

/** List AWS files in a specified category */
export async function listFiles(category: FileUploadCategory) {
  const url = insertCategory(API_FILES_LIST_ROUTE, category);
  const res = await fetchRaw<{ files: string[] }>({
    url,
    onResolve(x, errors) {
      return errors || x.files;
    }
  });
  if (typeof res === "string") return res;
  return res.files;
}

/** Save and update an Exploration in state */
export async function saveAndUpdateExploration(
  update: Partial<UpsertExplorationInput>
) {
  const noteId = addNotification("Saving Exploration ...", true);
  const resp = await upsertExploration(pruneExplorationData(update));
  if (typeof resp === "string") updateAsError(resp, noteId);
  else if (resp) {
    setGlobalExploration(resp);
    updateNotification("Exploration updated!", noteId, false);
  }
  return resp;
}

type B64ImageOpts = {
  /** File type */
  imgContentType: string;
  /** File name */
  name: string;
  /** File data */
  file: string;
};

/** Send a file to AWS via the server */
export async function uploadFileToServer(
  file: File | null,
  category: FileUploadCategory,
  b64Opts?: B64ImageOpts
) {
  if (!file && !b64Opts) return "No file supplied for upload";

  const url = insertCategory(API_FILE_UPLOAD_ROUTE, category);
  const formData = new FormData();
  formData.append("category", category);

  if (file) {
    formData.append("fileName", file.name);
    formData.append("imageFile", file);
  } else if (b64Opts) {
    const { name, imgContentType, file: b64file } = b64Opts;
    formData.append("fileType", "base64");
    formData.append("fileName", name);
    formData.append("imageFile", b64file);
    formData.append("imgContentType", imgContentType);
  }

  const contentType = "multipart/form-data";
  const res = await fetchRaw<{ fileURL: string }>({
    url,
    contentType,
    additionalOpts: { data: formData },
    onResolve: (res, errors) => errors || res
  });

  return res;
}

type APIParams = {
  authorId?: number;
  public?: boolean;
} & Omit<GQLRequestOpts, "returnUpdates">;

/** Make API Params */
function makeAPIParams(opts: GQLRequestOpts) {
  const params: APIParams = {};
  const { userId } = opts;
  if (userId === -1) params.public = true;
  else if ((userId || -2) > -1) params.authorId = userId;

  const { worldId, timelineId, explorationId, locationId } = opts;
  if (worldId) params.worldId = Number(worldId);
  if (locationId) params.locationId = Number(locationId);
  if (timelineId) params.timelineId = Number(timelineId);
  if (explorationId) params.explorationId = Number(explorationId);
  return params;
}

// Return a list if it's already loaded, otherwise load it
function listOrLoad<T extends Array<any>>(list: T, req: () => Promise<T>) {
  return list.length > 1 ? list : req();
}
