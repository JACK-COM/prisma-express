import createState from "@jackcom/raphsducks";

export enum MODAL {
  NONE = "None",
  MANAGE_CHARACTER = "Create/Edit Character",
  MANAGE_LOCATION = "Create/Edit Location",
  MANAGE_RELATIONSHIPS = "Create/Edit Relationships",
  MANAGE_WORLD = "Create/Edit World",
}

/** Modals */
export const Modal = createState({ active: MODAL.NONE });

export type ModalStore = ReturnType<typeof Modal.getState>;
export type ModalStoreKey = keyof ModalStore;

export function clearGlobalModal() {
  Modal.active(MODAL.NONE);
}
