import { useEffect, useState } from "react";
import {
  GlobalLibraryInstance,
  GlobalLibraryInstanceKey,
  GlobalLibrary,
  updateSeriesState,
  updateBooksState,
  updateLibrariesState,
  updateChaptersState,
  updateScenesState,
  clearGlobalBooksState
} from "state";

type HookState = Partial<GlobalLibraryInstance>;
const allKeys = Object.keys(
  GlobalLibrary.getState()
) as GlobalLibraryInstanceKey[];

/** Reusable subscription to `Library` state  */
export function useGlobalLibrary(keys: GlobalLibraryInstanceKey[] = allKeys) {
  const gState = GlobalLibrary.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onLibrary = (s: HookState) => setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalLibrary.subscribeToKeys(onLibrary, keys), []);

  return {
    ...state,

    // Helpers
    /** @helper reset focused items in state */
    clearGlobalBooksState,
    /** @helper Set a list of `Series` */
    updateSeriesState,
    /** @helper Set a list of `Books` */
    updateBooksState,
    /** @helper Set a list of `Library Purchases` */
    updateLibrariesState,
    /** @helper Set a list of `Chapters` */
    updateChaptersState,
    /** @helper Set a list of `Scenes` */
    updateScenesState
  };
}
