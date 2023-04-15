import { listWorlds } from "graphql/requests/worlds.graphql";
import { GlobalWorld, GlobalLibrary, GlobalUser, MicroUser } from "state";
import {
  listTimelines,
  listWorldEvents
} from "graphql/requests/timelines.graphql";
import { listBooks } from "graphql/requests/books.graphql";
import { defaultLoadOpts, listOrLoad } from "./GlobalWorld";
import { AUTH_ROUTE } from "utils";

// Shared function to load timelines and worlds

export async function loadUserData(opts = defaultLoadOpts) {
  const worldState = GlobalWorld.getState();
  const libState = GlobalLibrary.getState();
  const { worldId, userId, timelineId } = opts;
  const params: any = {};
  if (userId === -1 || !userId) params.public = true;
  else if (worldId) params.worldId = worldId;
  else params.authorId = userId;
  const [apiTimelines, apiWorlds, apiEvents, books] = await Promise.all([
    listTimelines(params),
    listOrLoad(worldState.worlds, () => listWorlds(params)),
    listOrLoad(worldState.events, () => listWorldEvents(params)),
    listOrLoad(libState.books, () => listBooks(params))
  ]);

  const timeline = apiTimelines.find((t: any) => t.id === Number(timelineId));
  const world = timeline?.World || apiWorlds.find((t: any) => t.id === worldId);
  const updates = {
    timelines: apiTimelines,
    worlds: apiWorlds,
    events: apiEvents,
    // focused data
    focusedTimeline: timeline || null,
    focusedWorld: world || null,
    worldLocations: world?.Locations || []
  };

  if (opts.returnUpdates) return { User: updates, Books: books };
  GlobalLibrary.books(books);
  GlobalWorld.multiple(updates);
}

export async function loadUser() {
  type UserResp = { user: MicroUser } | { user: null };
  const fOpts: RequestInit = { method: "post", credentials: "include" };
  const { user }: UserResp = await fetch(AUTH_ROUTE, fOpts).then((r) =>
    r.json()
  );
  GlobalUser.multiple({ ...user, authenticated: Boolean(user) });
  return user;
}
