import createState from "@jackcom/raphsducks";
import { APIData, Location, Timeline, World, WorldEvent } from "utils/types";

/* Convenience */
type APIWorld = APIData<World>;
type APIEvent = APIData<WorldEvent>;
type APILocation = APIData<Location>;
type APITimeline = APIData<Timeline>;
/* Convenience */

/**
 * All global state relating to worlds fetched/viewed by the user.
 * This includes `Worlds`, `World Events`, `Locations`, `Timelines`, and `Timeline Events`.
 */
export const GlobalWorld = createState({
  /** Currently-focused `location` in application */
  focusedLocation: null as APILocation | null,
  /** List of `Locations` in currently `focusedWorld`  */
  worldLocations: [] as APILocation[],

  /** Currently-selected `WorldEvent` */
  focusedEvent: null as APIEvent | null,
  /** List of all user (or public) `WorldEvents` */
  events: [] as APIEvent[],

  /** Currently-selected `Timeline` */
  focusedTimeline: null as APITimeline | null,
  /** List of all user (or public) `Timelines` */
  timelines: [] as APITimeline[],

  /** Currently-focused `world` in application */
  focusedWorld: null as APIWorld | null,
  /** List of user (or public) worlds */
  worlds: [] as APIWorld[]
});

export type GlobalWorldInstance = ReturnType<typeof GlobalWorld.getState>;
export type GlobalWorldInstanceKey = keyof GlobalWorldInstance;

/** @helper Select a `Location` */
export const setGlobalLocation = (l: APILocation | null) =>
  GlobalWorld.focusedLocation(l);

/** @helper Select a `World` (and clear out any previous related selections)  */
export const setGlobalWorld = (w: APIWorld | null) => {
  GlobalWorld.multiple({
    focusedWorld: w,
    worldLocations: [],
    focusedLocation: null
  });
};

/** @helper Select a `Timeline` */
export const setGlobalTimeline = (t: APITimeline | null) =>
  GlobalWorld.multiple({ focusedTimeline: t });

/** @helper Set  list of `Timelines` */
export const setGlobalTimelines = (w: APITimeline[] = []) => {
  GlobalWorld.timelines(w);
};

/**
 * Retrieve a world from state
 * @param newWorlds New worlds
 */
export function getByIdFromWorldState<
  T extends APIWorld | APIEvent | APILocation | APITimeline
>(id: number, key: GlobalWorldInstanceKey): T | null {
  const state = GlobalWorld.getState();
  const list = state[key] as T[];
  const value = list.find((w) => w.id === id);
  return value || null;
}

/**
 * Update list of worlds in state
 * @param newWorlds New worlds
 */
export function updateWorlds(newWorlds: APIWorld[]) {
  const { focusedWorld } = GlobalWorld.getState();
  const defer = newWorlds.length === 1 && focusedWorld?.id === newWorlds[0].id;
  const worlds = updateWorldStateList(newWorlds, "worlds", defer);
  if (defer) GlobalWorld.multiple({ worlds, focusedWorld: newWorlds[0] });
}

/**
 * Remove world from list in from state
 * @param targetId Id of target object
 */
export function removeWorld(targetId: number) {
  return removeFromWorldsList(targetId, "worlds");
}

/**
 * Update list of locations in state
 * @param newLocations New locations
 */
export function updateLocations(newLocations: APILocation[]) {
  const { focusedLocation: focusedLocation } = GlobalWorld.getState();
  if (newLocations.length !== 1 || !focusedLocation) {
    return updateWorldStateList(newLocations, "worldLocations");
  }

  const next = updateWorldStateList(newLocations, "worldLocations", true);
  GlobalWorld.multiple({
    focusedLocation: newLocations[0],
    worldLocations: next as APILocation[]
  });
}

/**
 * Remove location from list in from state
 * @param targetId Id of target object
 */
export function removeLocation(targetId: number) {
  return removeFromWorldsList(targetId, "worldLocations");
}

export type GlobalWorldListKey =
  | "worldLocations"
  | "events"
  | "timelines"
  | "worlds";
/**
 * Abstraction to UPDATE a list-key in state
 * @param newItems New worlds
 */
export function updateWorldStateList<
  T extends APIWorld | APIEvent | APILocation | APITimeline
>(newItems: T[], key: GlobalWorldListKey, skipUpdate = false): T[] {
  const state = GlobalWorld.getState();
  const old = state[key];
  const next = [...old];
  newItems.forEach((w) => {
    const existing = old.findIndex((x) => x.id === w.id);
    if (existing > -1) next[existing] = { ...next[existing], ...w } as T;
    else next.push(w);
  });

  if (!skipUpdate) GlobalWorld[key](next as any);
  return next as T[];
}

/**
 * Abstraction to OVERWRITE a list-key in state
 * @param newItems New worlds
 */
export function setWorldStateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalWorldListKey,
  additionalState?: Partial<GlobalWorldInstance>
) {
  GlobalWorld.multiple({ [key]: newItems, ...additionalState });
}

/**
 * Clear selected world
 * @param newWorlds New worlds
 */
export function clearGlobalWorld() {
  return GlobalWorld.multiple({
    focusedLocation: null,
    focusedTimeline: null,
    focusedWorld: null,
    worldLocations: [],
    timelines: []
  });
}

/**
 * Remove item from list in from state
 * @param targetId Id of target object
 */
function removeFromWorldsList(targetId: number, key: GlobalWorldListKey) {
  const state = GlobalWorld.getState();
  const old: any[] = state[key];
  const next = old.filter((x) => x.id !== targetId);

  GlobalWorld[key](next);
}
