import { useState } from "react";
import { useTick } from "@pixi/react";

/** Global Hook for performing updates inline with Pixi app */
export default function useGlobalDelta(incr = 0.1) {
  const [localDelta, updateLocalDelta] = useState(0);
  const [pureDelta, updatePureDelta] = useState(0);

  useTick((delta) => {
    const newDelta = incr * delta;
    updatePureDelta(newDelta);
    updateLocalDelta((i) => i + newDelta);
  });

  return { localDelta, pureDelta };
}
