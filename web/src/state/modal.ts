import createState from "@jackcom/raphsducks";

export enum MODAL {
  NONE = "None",
  CONFIRM_DELETE_BOOK = "Confirm Delete Book",
  CONFIRM_DELETE_CHARACTER = "Confirm Delete Character",
  CONFIRM_DELETE_EXPLORATION = "Confirm Delete Exploration",
  CONFIRM_DELETE_EXPLORATION_SCENE = "Confirm Delete Exploration Scene",
  CONFIRM_DELETE_LOCATION = "Confirm Delete Location",
  CONFIRM_DELETE_WORLD = "Confirm Delete World",
  CREATE_BOOK = "Create Book",
  CREATE_EXPLORATION = "Create Exploration",
  CREATE_EXPLORATION_SCENE = "Create Exploration Scene",
  CREATE_INTERACTIVE_SLOT = "Create Interactive Slot",
  CREATE_WORLD = "Create World",
  EXPLORATION_BUILDER_HELP = "Exploration Builder Help",
  LINK_SCENE = "Link Scene",
  MANAGE_BOOK = "Manage Book",
  MANAGE_CHAPTER = "Manage Chapter",
  MANAGE_CHARACTER = "Manage Character",
  MANAGE_EXPLORATION = "Manage Exploration",
  MANAGE_EXPLORATION_SCENE = "Manage Exploration Scene",
  MANAGE_EXPLORATION_SCENE_LAYERS = "Manage Scene Layers",
  MANAGE_INTERACTIVE_SLOT = "Manage Interactive Slot",
  MANAGE_LOCATION = "Manage Location",
  MANAGE_RELATIONSHIPS = "Manage Relationships",
  MANAGE_SCENE = "Manage Scene",
  MANAGE_TIMELINE = "Manage Timeline",
  MANAGE_TIMELINE_EVENTS = "Manage Timeline Events",
  MANAGE_WORLD = "Manage World",
  MANAGE_WORLD_EVENTS = "Manage World Events",
  SELECT_CHAPTER = "Select Chapter",
  SELECT_EXPLORATION_SCENE = "Select Exploration Scene",
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
  if (active === last) return;
  const previous = [...old, last];
  GlobalModal.multiple({ active, previous });
}
