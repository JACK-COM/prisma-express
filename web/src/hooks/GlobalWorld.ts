import { useEffect, useState } from "react";
import {
  GlobalWorld,
  GlobalWorldInstance,
  GlobalWorldInstanceKey,
  setGlobalWorld,
  setGlobalWorlds,
  updateWorlds,
  clearGlobalWorld
} from "state";
import { World } from "utils/types";

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

  return {
    ...state,

    // Helpers
    setGlobalWorld,
    setGlobalWorlds,
    updateWorlds,
    clearGlobalWorld
  };
}
