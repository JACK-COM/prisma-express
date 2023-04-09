import createState from "@jackcom/raphsducks";
import { APIData, Location, World } from "utils/types";

/* Convenience */
type APIWorld = APIData<World>;
type APILocation = APIData<Location>;
/* Convenience */

/** Any global state relating to worlds fetched/viewed by the user */
export const GlobalWorld = createState({
  /** Currently-focused `location` in application */
  selectedLocation: null as APILocation | null,
  /** Currently-focused `world` in application */
  selectedWorld: null as APIWorld | null,
  /** List of focused world's `locations` */
  worldLocations: [] as APILocation[],
  /** List of user (or public) worlds */
  worlds: [] as APIWorld[]
});

export type GlobalWorldInstance = ReturnType<typeof GlobalWorld.getState>;
export type GlobalWorldInstanceKey = keyof GlobalWorldInstance;
/** All lists in state */
export type GlobalWorldListKey = "worlds" | "worldLocations";

/** @helper Select a `Location` */
export const setGlobalLocation = (l: APILocation | null) =>
  GlobalWorld.selectedLocation(l);

/** @helper Select a `World` */
export const setGlobalWorld = (w: APIWorld | null) =>
  GlobalWorld.selectedWorld(w);

/**
 * Update list of worlds in state
 * @param newWorlds New worlds
 */
export function updateWorlds(newWorlds: APIWorld[]) {
  return updateList(newWorlds, "worlds");
}

/**
 * Update list of locations in state
 * @param newWorlds New worlds
 */
export function updateLocations(newLocations: APILocation[]) {
  return updateList(newLocations, "worldLocations");
}

/**
 * Update list-key in state
 * @param newItems New worlds
 */
export function updateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalWorldListKey
) {
  const state = GlobalWorld.getState();
  const old = state[key] as T;
  const next = [...old];
  newItems.forEach((w) => {
    const existing = old.findIndex((x) => x.id === w.id);
    if (existing > -1) next[existing] = { ...next[existing], ...w };
    else next.push(w);
  });

  GlobalWorld[key](next);
}

/**
 * Overwrite a list-key in state
 * @param newItems New worlds
 */
export function setList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalWorldListKey
) {
  GlobalWorld[key](newItems);
}

/**
 * Clear selected world
 * @param newWorlds New worlds
 */
export function clearGlobalWorld() {
  GlobalWorld.selectedWorld(null);
}
