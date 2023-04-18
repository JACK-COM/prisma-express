import createState from "@jackcom/raphsducks";

export enum MODAL {
  NONE = "None",
  MANAGE_BOOK = "Manage Book",
  MANAGE_CHAPTER = "Manage Chapter",
  MANAGE_CHARACTER = "Manage Character",
  MANAGE_LOCATION = "Manage Location",
  MANAGE_RELATIONSHIPS = "Manage Relationships",
  MANAGE_TIMELINE = "Manage Timeline",
  MANAGE_TIMELINE_EVENTS = "Manage Timeline Events",
  MANAGE_WORLD = "Manage World",
  SELECT_CHAPTER = "Select Chapter"
}

/** Modals */
export const Modal = createState({
  active: MODAL.NONE,
  previous: [] as MODAL[]
});

export type ModalStore = ReturnType<typeof Modal.getState>;
export type ModalStoreKey = keyof ModalStore;

export function clearGlobalModal() {
  const { previous: old } = Modal.getState();
  const previous = [...old];
  const active = previous.pop() || MODAL.NONE;
  Modal.multiple({ active, previous });
}

export function setGlobalModal(active: MODAL) {
  const { previous: old, active: last } = Modal.getState();
  const previous = [...old, last];
  Modal.multiple({ active, previous });
}
