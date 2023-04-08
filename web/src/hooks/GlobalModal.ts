import { useEffect, useState } from "react";
import { MODAL, Modal, ModalStore, ModalStoreKey, clearGlobalModal } from "state";

type HookState = Partial<ModalStore>;

/** Reusable subscription to `Modal` state  */
export function useGlobalModal(keys: ModalStoreKey[] = ["active"]) {
  const gState = Modal.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onModal = (s: Partial<ModalStore>) =>
    setState((prev) => ({ ...prev, ...s }));

  useEffect(() => Modal.subscribeToKeys(onModal, keys), []);

  return {
    ...state,
    MODAL,

    // Helpers
    clearGlobalModal,
    setGlobalModal: (m: MODAL) => Modal.active(m)
  };

}
