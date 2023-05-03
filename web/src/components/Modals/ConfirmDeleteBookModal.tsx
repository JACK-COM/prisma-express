import { useGlobalModal } from "hooks/GlobalModal";
import Modal from "./Modal";
import { APIData, Book } from "utils/types";
import {
  addNotification,
  clearGlobalModal,
  removeBookFromState,
  updateAsError
} from "state";
import { deleteBook } from "graphql/requests/books.graphql";
import { useGlobalLibrary } from "hooks/GlobalLibrary";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

const ConfirmDeleteBookModal = (props: Props) => {
  const { open = false, onClose = clearGlobalModal } = props;
  const { focusedBook: book } = useGlobalLibrary();
  const { id, title } = book || ({ id: -1 } as APIData<Book>);
  const modalTitle = `Delete ${title}?`;
  const handleDeleteBook = async () => {
    if (!book || id === -1) return updateAsError("No book selected.");
    const noteId = addNotification("Deleting book...", true);
    const res = await deleteBook(id);
    if (typeof res === "string") updateAsError(res, noteId);
    else if (res) {
      removeBookFromState(book.id);
      onClose();
    }
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onClose={onClose}
      onConfirm={handleDeleteBook}
      confirmText="Delete Book"
      cancelText="Cancel"
    >
      <p>
        Are you sure you want to delete <b>{title}</b>? This action cannot be
        undone.
      </p>
    </Modal>
  );
};

export default ConfirmDeleteBookModal;
