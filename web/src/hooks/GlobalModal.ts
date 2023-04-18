import { useEffect, useState } from "react";
import {
  MODAL,
  Modal,
  ModalStore,
  ModalStoreKey,
  clearGlobalModal,
  setGlobalModal
} from "state";

type HookState = Omit<Partial<ModalStore>, "active"> & { active: MODAL };
const MODAL_KEYS = Object.keys(Modal.getState()) as ModalStoreKey[];

/** Reusable subscription to `Modal` state  */
export function useGlobalModal(keys: ModalStoreKey[] = MODAL_KEYS) {
  const gState = Modal.getState();
  const init: HookState = {
    ...keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {}),
    active: gState.active
  };
  const [state, setState] = useState<HookState>(init);
  const onModal = (s: Partial<ModalStore>) =>
    setState((prev) => ({ ...prev, ...s }));

  useEffect(() => Modal.subscribeToKeys(onModal, keys), []);

  return {
    ...state,
    MODAL,

    // Helpers
    clearGlobalModal,
    setGlobalModal
  };
}
