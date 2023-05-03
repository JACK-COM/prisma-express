import { useEffect, useState } from "react";
import {
  MODAL,
  GlobalModal,
  ModalStore,
  clearGlobalModal,
  setGlobalModal
} from "state";

type HookState = Omit<Partial<ModalStore>, "active"> & { active: MODAL };

/** Reusable subscription to `Modal` state  */
export function useGlobalModal() {
  const gState = GlobalModal.getState();
  const [state, setState] = useState<HookState>(gState);
  const onModal = (s: Partial<ModalStore>) =>
    setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalModal.subscribe(onModal), []);

  return {
    ...state,
    MODAL,

    // Helpers
    clearGlobalModal,
    setGlobalModal
  };
}
