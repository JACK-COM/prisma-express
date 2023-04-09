import { useEffect, useState } from "react";
import {
  GlobalWorld,
  GlobalWorldInstance,
  GlobalWorldInstanceKey,
  clearGlobalWorld,
  setGlobalLocation,
  setGlobalWorld,
  setList,
  updateLocations,
  updateWorlds
} from "state";
import { APIData, World, Location } from "utils/types";

type HookState = Partial<GlobalWorldInstance>;

/** Reusable subscription to `World` state  */
export function useGlobalWorld(
  keys: GlobalWorldInstanceKey[] = ["selectedWorld", "worlds"]
) {
  const gState = GlobalWorld.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onWorld = (s: HookState) => setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalWorld.subscribeToKeys(onWorld, keys), []);

  /** @helper Set a list of `Worlds` */

  /** @helper Set a list of `Locations` */
  return {
    ...state,

    // Helpers
    clearGlobalWorld,
    setGlobalLocation,
    setGlobalWorld,
    setGlobalWorlds: (w: APIData<World>[]) => setList(w, "worlds"),
    setGlobalLocations: (w: APIData<Location>[]) =>
      setList(w, "worldLocations"),
    updateLocations,
    updateWorlds
  };
}
