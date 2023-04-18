import { getWorld, listWorlds } from "graphql/requests/worlds.graphql";
import {
  GlobalWorld,
  GlobalLibrary,
  GlobalUser,
  MicroUser,
  GlobalCharacter,
  getByIdFromWorldState
} from "state";
import {
  listTimelines,
  listWorldEvents
} from "graphql/requests/timelines.graphql";
import { getBook, getChapter, listBooks } from "graphql/requests/books.graphql";
import { AUTH_ROUTE } from "utils";
import { listCharacters } from "graphql/requests/characters.graphql";
import { APIData, Book, Chapter, Scene, Timeline, World } from "utils/types";

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
  const worldState = GlobalWorld.getState();
  const libState = GlobalLibrary.getState();
  const params = makeAPIParams(opts);
  const [worlds, events, books] = await Promise.all([
    listOrLoad(worldState.worlds, () => listWorlds(params)),
    listOrLoad(worldState.events, () => listWorldEvents(params)),
    listOrLoad(libState.books, () => listBooks(params))
  ]);

  const focusedWorld = params.worldId
    ? worlds.find((t: any) => t.id === params.worldId)
    : null;
  const worldLocations = focusedWorld?.Locations || [];
  const updates = { worlds, events, focusedWorld, worldLocations };
  if (opts.returnUpdates) return { User: updates, Books: books };

  GlobalLibrary.books(books);
  GlobalWorld.multiple(updates);
}

/** Load user */
export async function loadUser() {
  type UserResp = { user: MicroUser } | { user: null };
  const fOpts: RequestInit = { method: "post", credentials: "include" };
  const { user }: UserResp = await fetch(AUTH_ROUTE, fOpts).then((r) =>
    r.json()
  );
  GlobalUser.multiple({ ...user, authenticated: Boolean(user) });
  return user;
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
export async function loadChapter(chapterId: number, skipUpdates = false) {
  if (!chapterId)
    return { focusedChapter: null, focusedScene: null, scenes: [] };

  const focusedChapter = await getChapter(chapterId);
  const scenes = (focusedChapter || { Scenes: [] }).Scenes;
  // Get most recent scene
  const focusedScene = scenes[0] || null;
  const updates = { focusedChapter, focusedScene, scenes };
  if (!skipUpdates) GlobalLibrary.multiple(updates);
  return updates;
}

/** Load and focus a single book */
export async function loadBook(bookId: number) {
  const lib = GlobalLibrary.getState();
  if (!bookId)
    return {
      focusedBook: lib.focusedBook,
      chapters: lib.chapters,
      focusedChapter: lib.focusedChapter,
      scenes: lib.scenes,
      focusedScene: lib.focusedScene
    };

  const focusedBook = await getBook(bookId);
  const { Chapters: chapters = [] } = focusedBook || {};
  let focusedChapter: APIData<Chapter> | null = chapters[0] || null;
  let scenes = focusedChapter?.Scenes || [];
  let focusedScene: APIData<Scene> | null = scenes[0] || null;
  const allUpdates = {
    focusedBook,
    chapters,
    focusedChapter,
    scenes,
    focusedScene
  };
  if (chapters.length) {
    // If user has chapters, load the most-recent one
    const updates = await loadChapter(chapters[chapters.length - 1].id, true);
    GlobalLibrary.multiple({ ...allUpdates, ...updates });
    return { ...allUpdates, ...updates };
  }

  GlobalLibrary.multiple(allUpdates);
  return allUpdates;
}

/** Load timelines */
export async function loadTimelines(opts: HOOK__LoadWorldOpts) {
  const params = makeAPIParams(opts);
  const { timelineId } = params;
  const { timelines: current, focusedTimeline: focused } =
    GlobalWorld.getState();
  const timelines = await listOrLoad(current, () => listTimelines(params));
  let focusedTimeline: APIData<Timeline> | null = null;
  if (timelineId)
    focusedTimeline = timelines.find((t: any) => t.id === timelineId) || null;
  else if (focused)
    focusedTimeline = timelines.find((t: any) => t.id === timelineId) || null;
  const focusedWorld = focusedTimeline?.World || null;
  GlobalWorld.multiple({ timelines, focusedTimeline, focusedWorld });
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
