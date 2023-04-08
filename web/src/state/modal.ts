import createState from "@jackcom/raphsducks";

export enum MODAL {
  NONE = "None",
  MANAGE_WORLD = "Create/Edit World",
  MANAGE_LOCATION = "Create/Edit Location",
}

/** Modals */
export const Modal = createState({ active: MODAL.NONE });

export type ModalStore = ReturnType<typeof Modal.getState>;
export type ModalStoreKey = keyof ModalStore;

export function clearGlobalModal() {
  Modal.active(MODAL.NONE);
}
