import createState from "@jackcom/raphsducks";

export enum MODAL {
  NONE = "None",
  MANAGE_CHARACTER = "Manage Character",
  MANAGE_LOCATION = "Manage Location",
  MANAGE_RELATIONSHIPS = "Manage Relationships",
  MANAGE_TIMELINE = "Manage Timeline",
  MANAGE_TIMELINE_EVENTS = "Manage Timeline Events",
  MANAGE_BOOK = "Manage Book",
  MANAGE_WORLD = "Manage World",
}

/** Modals */
export const Modal = createState({ active: MODAL.NONE });

export type ModalStore = ReturnType<typeof Modal.getState>;
export type ModalStoreKey = keyof ModalStore;

export function clearGlobalModal() {
  Modal.active(MODAL.NONE);
}
