import { useEffect, useState } from "react";
import {
  GlobalWorld,
  GlobalWorldInstance,
  GlobalWorldInstanceKey,
  clearGlobalWorld,
  getByIdFromWorldState,
  setGlobalTimeline,
  setGlobalLocation,
  setGlobalWorld,
  setWorldStateList,
  updateLocations,
  updateWorlds,
  updateWorldStateList
} from "state";
import { APIData, World, Location, Timeline } from "utils/types";
import { useParams } from "react-router";

type HookState = Partial<GlobalWorldInstance>;

/** Reusable subscription to `World` state  */
export function useGlobalWorld(
  keys: GlobalWorldInstanceKey[] = ["focusedWorld", "worlds"]
) {
  const gState = GlobalWorld.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onWorld = (s: HookState) => setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalWorld.subscribeToKeys(onWorld, keys), []);
  
  return {
    ...state,

    // Helpers
    clearGlobalWorld,
    getWorld: (id: number) =>
      getByIdFromWorldState(id, "worlds") as APIData<World>,
    setGlobalLocation,
    setGlobalWorld,
    setGlobalTimeline,
    setGlobalTimelines: (t: APIData<Timeline>[]) =>
      setWorldStateList(t, "timelines", { focusedTimeline: null }),
    setGlobalWorlds: (w: APIData<World>[]) =>
      setWorldStateList(w, "worlds", { focusedWorld: null }),
    setGlobalLocations: (l: APIData<Location>[]) =>
      setWorldStateList(l, "worldLocations", { focusedLocation: null }),
    updateLocations,
    updateTimelines: (t: APIData<Timeline>[]) =>
      updateWorldStateList(t, "timelines"),
    updateEvents: (t: APIData<Timeline>[]) => updateWorldStateList(t, "events"),
    updateWorlds
  };
}

