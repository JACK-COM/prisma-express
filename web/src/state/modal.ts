import createState from "@jackcom/raphsducks";

export enum MODAL {
  NONE = "None",
  LINK_SCENE = "Link Scene",
  CONFIRM_DELETE_BOOK = "Confirm Delete Book",
  CONFIRM_DELETE_WORLD = "Confirm Delete World",
  MANAGE_BOOK = "Manage Book",
  MANAGE_CHAPTER = "Manage Chapter",
  MANAGE_CHARACTER = "Manage Character",
  MANAGE_LOCATION = "Manage Location",
  MANAGE_RELATIONSHIPS = "Manage Relationships",
  MANAGE_SCENE = "Manage Scene",
  MANAGE_TIMELINE = "Manage Timeline",
  MANAGE_TIMELINE_EVENTS = "Manage Timeline Events",
  MANAGE_WORLD = "Manage World",
  MANAGE_WORLD_EVENTS = "Manage World Events",
  SELECT_CHAPTER = "Select Chapter"
}

/** Modals */
export const GlobalModal = createState({
  active: MODAL.NONE,
  previous: [] as MODAL[]
});

export type ModalStore = ReturnType<typeof GlobalModal.getState>;
export type ModalStoreKey = keyof ModalStore;

export function clearGlobalModal() {
  const { previous: old } = GlobalModal.getState();
  const previous = [...old];
  const active = previous.pop() || MODAL.NONE;
  GlobalModal.multiple({ active, previous });
}

export function setGlobalModal(active: MODAL) {
  const { previous: old, active: last } = GlobalModal.getState();
  const previous = [...old, last];
  GlobalModal.multiple({ active, previous });
}
