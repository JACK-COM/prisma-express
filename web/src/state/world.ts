import createState from "@jackcom/raphsducks";
import { mergeLists } from "utils";
import {
  APIData,
  ArrayKeys,
  Location,
  Timeline,
  World,
  WorldEvent
} from "utils/types";

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
export type GlobalWorldListKey = ArrayKeys<GlobalWorldInstance>;

/** @helper Select a `Location` */
export const setGlobalLocation = (l: APILocation | null) => {
  const { worldLocations } = GlobalWorld.getState();
  GlobalWorld.multiple({
    focusedLocation: l,
    worldLocations: l
      ? worldLocations.map((w) => (w.id === l.id ? l : w))
      : worldLocations
  });
};

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
export function updateWorlds(newWorlds: APIWorld[], skipUpdate = false) {
  const { focusedWorld, worlds: old } = GlobalWorld.getState();
  const worlds: any[] = mergeLists(old, newWorlds);
  const world = focusedWorld && worlds.find((w) => w.id === focusedWorld.id);
  const updates = { worlds, focusedWorld: world };
  if (!skipUpdate) GlobalWorld.multiple(updates);
  return updates;
}

/**
 * Remove world from list in from state
 * @param targetId Id of target object
 */
export function removeWorld(targetId: number) {
  return removeFromWorldsList(targetId, "worlds");
}

/**
 * Abstraction to UPDATE a list-key in state
 * @param newItems New worlds
 */
type APIItem = APIWorld | APIEvent | APILocation | APITimeline;
export function updateWorldStateList<T extends APIItem>(
  newItems: T[],
  key: GlobalWorldListKey,
  skipUpdate = false
): T[] {
  const state = GlobalWorld.getState();
  const old = state[key] as T[];
  const next = mergeLists(old, newItems);
  if (!skipUpdate) setWorldStateList(next, key);
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
