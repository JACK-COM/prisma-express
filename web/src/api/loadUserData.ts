import { getWorld, listWorlds } from "graphql/requests/worlds.graphql";
import {
  GlobalWorld,
  GlobalLibrary,
  GlobalUser,
  GlobalCharacter,
  getByIdFromWorldState,
  updateChaptersState,
  GlobalLibraryInstance,
  addNotification,
  updateNotification,
  updateAsError
} from "state";
import {
  listTimelines,
  listWorldEvents
} from "graphql/requests/timelines.graphql";
import { getBook, getChapter, listBooks } from "graphql/requests/books.graphql";
import { API_FILE_UPLOAD_ROUTE, API_PROMPT } from "utils";
import { listCharacters } from "graphql/requests/characters.graphql";
import { APIData, Chapter, Scene, Timeline, World } from "utils/types";
import { MicroUser } from "graphql/requests/users.graphql";
import { insertCategory } from "routes";
import fetchRaw from "../graphql/fetch-raw";
import { fetchGQL, getUserQuery } from "graphql";

// Additonal instructions for focusing data in the global state
type HOOK__LoadWorldOpts = {
  userId?: number;
  timelineId?: number;
  locationId?: number;
  worldId?: number;
  groupId?: number;
  returnUpdates?: boolean;
};
const defaultLoadOpts: HOOK__LoadWorldOpts = { userId: -1 };

// Shared function to load timelines and worlds
export async function loadUserData(opts = defaultLoadOpts) {
  const { worlds: stateWorlds } = GlobalWorld.getState();
  const { books: stateBooks } = GlobalLibrary.getState();
  const params = makeAPIParams(opts);
  const [worlds, books] = await Promise.all([
    listOrLoad(stateWorlds, () => listWorlds(params)),
    listOrLoad(stateBooks, () => listBooks(params))
  ]);

  const focusedWorld = params.worldId
    ? worlds.find((t: any) => t.id === params.worldId)
    : null;
  const worldLocations = focusedWorld?.Locations || [];
  const updates = { worlds, focusedWorld, worldLocations };
  if (opts.returnUpdates) return { User: updates, Books: books };

  GlobalLibrary.books(books);
  GlobalWorld.multiple(updates);
}

/** Load user */
export async function loadUser() {
  const user = await fetchGQL<MicroUser | null>({
    query: getUserQuery(),
    fallbackResponse: null,
    onResolve: (x, errors) => errors || x.getAuthUser
  });
  GlobalUser.multiple({ ...user, authenticated: Boolean(user) });
  return user;
}

/**
 * Generate a writing prompt from the API
 * @todo this should take additional parameters (world, character, etc) */
export async function getWritingPrompt(input: string | null = null) {
  const resp = await fetchRaw<{ prompt: string }>({
    url: API_PROMPT,
    timeout: 10000,
    additionalOpts: { body: JSON.stringify({ prompt: input }) },
    onResolve: (x, errors) => (errors ? new Error(errors) : x)
  });
  if (resp instanceof Error) throw resp;
  return resp.prompt;
}

/** Generate a writing prompt from OpenAI */
export async function getAndShowPrompt(input?: string, show?: boolean) {
  const notificationId = addNotification("Generating writing prompt...", true);
  try {
    const prompt = await getWritingPrompt(input);
    if (show) updateNotification(prompt, notificationId, true);
    return prompt;
  } catch (error: any) {
    updateAsError(error.message, notificationId);
    return null;
  }
}

/** Load and focus a single world */
export async function loadWorld(opts: HOOK__LoadWorldOpts) {
  const { worldId } = makeAPIParams(opts);
  if (!worldId) return;
  type T = APIData<World>;
  const focusedWorld =
    getByIdFromWorldState<T>(worldId, "worlds") || (await getWorld(worldId));
  const { Locations: worldLocations, Events: events } = focusedWorld || {};
  GlobalWorld.multiple({
    focusedWorld,
    focusedLocation: null,
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
export async function loadTimelines(opts: HOOK__LoadWorldOpts) {
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
export async function loadCharacters(opts: HOOK__LoadWorldOpts) {
  const { characters: current, focusedCharacter: focused } =
    GlobalCharacter.getState();

  const params = makeAPIParams(opts);
  const characters = await listOrLoad(current, () => listCharacters(params));
  const focusedCharacter =
    focused && characters.find((c) => c.id === focused.id);
  GlobalCharacter.multiple({ characters, focusedCharacter });
}

/** File Upload category */
export type FileUploadCategory =
  | "users"
  | "characters"
  | "books" /* | "worlds" | "chapters" | "scenes" */;

/** Send a file to AWS via the server */
export async function uploadFileToServer(
  file: File,
  category: FileUploadCategory
) {
  const url = insertCategory(API_FILE_UPLOAD_ROUTE, category);
  const formData = new FormData();
  formData.append("category", category);
  formData.append("fileName", file.name);
  formData.append("imageFile", file);
  const contentType = "multipart/form-data";
  const res = await fetchRaw<{ fileURL: string }>({
    url,
    contentType,
    additionalOpts: { body: formData },
    onResolve: (res, errors) => errors || res
  });

  return res;
}

type APIParams = {
  worldId?: number;
  authorId?: number;
  timelineId?: number;
  public?: boolean;
};
/** Make API Params */
function makeAPIParams(opts: HOOK__LoadWorldOpts) {
  const params: APIParams = {};
  const { worldId, userId, timelineId } = opts;
  if (userId === -1) params.public = true;
  else if ((userId || -2) > -1) params.authorId = userId;
  else {
    if (worldId) params.worldId = Number(worldId);
    if (timelineId) params.timelineId = Number(timelineId);
  }
  return params;
}

// Return a list if it's already loaded, otherwise load it
function listOrLoad<T extends Array<any>>(list: T, req: () => Promise<T>) {
  return list.length > 1 ? list : req();
}
