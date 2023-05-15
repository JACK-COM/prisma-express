import Modal from "./Modal";
import {
  GlobalCharacter,
  GlobalExploration,
  GlobalLibrary,
  GlobalModal,
  GlobalWorld,
  MODAL,
  addNotification,
  clearGlobalModal,
  removeBookFromState,
  removeCharacterFromState,
  removeWorld,
  updateAsError,
  updateNotification
} from "state";
import { deleteBook } from "graphql/requests/books.graphql";
import { deleteLocation, deleteWorld } from "graphql/requests/worlds.graphql";
import { deleteCharacter } from "graphql/requests/characters.graphql";
import { Accent } from "components/Common/Containers";
import { deleteExploration } from "graphql/requests/explorations.graphql";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

const ConfirmDeleteModal = (props: Props) => {
  const { open = false, onClose = clearGlobalModal } = props;
  const { id, title, handleDelete } = getFocusedProps();
  const onDelete = async () => {
    if (!id) return updateAsError("No Item selected");
    const noteId = addNotification(`Deleting "${title}"...`, true);
    const err = await handleDelete(id);
    if (err) return updateAsError(err, noteId);
    updateNotification(`Deleted "${title}"`, noteId, false);
    onClose();
  };

  return (
    <Modal
      title={`Delete ${title}?`}
      open={open}
      onClose={onClose}
      onConfirm={onDelete}
      confirmText="Delete Book"
      cancelText="Cancel"
    >
      <p>
        Are you sure you want to delete <Accent as="b">"{title}"</Accent>? This
        action cannot be undone.
      </p>
    </Modal>
  );
};

export default ConfirmDeleteModal;

type FocusedProps = {
  title: string;
  id?: number;
  handleDelete: (id: number) => Promise<string | null>;
};

/** Get the name of the currently-focused item for deletion */
function getFocusedProps(): FocusedProps {
  const { active } = GlobalModal.getState();
  const { focusedWorld, focusedLocation } = GlobalWorld.getState();

  switch (active) {
    case MODAL.CONFIRM_DELETE_BOOK: {
      const { focusedBook: book } = GlobalLibrary.getState();
      const { id, title = "this book" } = book || {};
      return { id, title, handleDelete: handleDeleteBook };
    }
    case MODAL.CONFIRM_DELETE_CHARACTER: {
      const { focusedCharacter } = GlobalCharacter.getState();
      const { id, name: title = "this character" } = focusedCharacter || {};
      return { id, title, handleDelete: handleDeleteCharacter };
    }
    case MODAL.CONFIRM_DELETE_EXPLORATION: {
      const { exploration } = GlobalExploration.getState();
      const { id, title = "this exploration" } = exploration || {};
      return { id, title, handleDelete: handleDeleteExploration };
    }
    case MODAL.CONFIRM_DELETE_LOCATION: {
      const { id, worldId, name = "this location" } = focusedLocation || {};
      const handleDelete = (i: number) =>
        handleDeleteLocation(i, worldId || -1);
      return { id, title: name, handleDelete };
    }
    case MODAL.CONFIRM_DELETE_WORLD: {
      const { id, name: title = "this world" } = focusedWorld || {};
      return { id, title, handleDelete: handleDeleteWorld };
    }
    default:
      return { title: "this item", handleDelete: () => Promise.resolve(null) };
  }
}

// DELETION HANDLERS: return error message or null

/** Delete a book */
async function handleDeleteBook(id: number) {
  const res = await deleteBook(id);
  if (typeof res === "string") return res;
  if (!res) return "Error deleting book";
  removeBookFromState(res.id);
  return null; // no error
}

/** Delete a world */
async function handleDeleteWorld(id: number) {
  const res = await deleteWorld(id);
  if (typeof res === "string") return res;
  if (!res) return "Error deleting world";
  removeWorld(res.id);
  return null;
}

/** Delete a character */
async function handleDeleteCharacter(id: number) {
  const res = await deleteCharacter(id);
  if (typeof res === "string") return res;
  if (!res) return "Error deleting character";
  removeCharacterFromState(res.id);
  return null;
}

/** Delete a location */
async function handleDeleteLocation(id: number, worldId: number) {
  const res = await deleteLocation(id, worldId);
  if (typeof res === "string") return res;
  if (!res) return "Error deleting location";
  const { focusedLocation } = GlobalWorld.getState();
  if (focusedLocation?.id === id) GlobalWorld.focusedLocation(null);
  return null;
}

/** Delete an Exploration */
async function handleDeleteExploration(id: number) {
  const res = await deleteExploration(id);
  if (typeof res === "string") return res;
  if (!res) return "Error deleting exploration";
  const { exploration } = GlobalExploration.getState();
  if (exploration?.id === id) GlobalExploration.exploration(null);
  return null;
}
