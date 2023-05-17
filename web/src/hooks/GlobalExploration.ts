import { useEffect, useState } from "react";
import {
  GlobalExploration,
  explorationStoreKeys,
  ExplorationStoreKey,
  ExplorationStore
} from "state";

const ALL = explorationStoreKeys;

/** Selectively subsribe to `GlobalExploration` state */
export default function useGlobalExploration(
  keys: ExplorationStoreKey[] = ALL
) {
  const initial = GlobalExploration.getState();
  const init = keys.reduce(
    (agg, k) => ({ ...agg, [k]: initial[k] }),
    {} as Partial<ExplorationStore>
  );
  const [state, setState] = useState(init);
  const onExploration = (s: typeof init) =>
    setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalExploration.subscribeToKeys(onExploration, keys), []);

  return state;
}
