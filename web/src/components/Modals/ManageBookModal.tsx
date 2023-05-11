import CreateBookForm from "components/Form.CreateBook";
import {
  UpsertBookData,
  pruneBookForAPI,
  upsertBook
} from "graphql/requests/books.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  GlobalLibrary,
  GlobalModal,
  GlobalUser,
  GlobalWorld,
  MODAL,
  addNotification,
  clearGlobalModal,
  updateAsError,
  updateBooksState,
  updateNotification
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import { useGlobalUser } from "hooks/GlobalUser";
import { uploadFileToServer } from "api/loadUserData";

/** Modal props */
type ManageBookModalProps = {
  open: boolean;
  onClose?: () => void;
};

// Empty/default form data
const initialFormData = (): Partial<UpsertBookData> => {
  const { focusedBook } = GlobalLibrary.getState();
  const { id: authorId } = GlobalUser.getState();
  const { active } = GlobalModal.getState();
  const { focusedLocation, focusedWorld } = GlobalWorld.getState();
  const worldId = focusedWorld?.id;
  const locationId = focusedLocation?.id;
  const $form: Partial<UpsertBookData> = {
    title: "",
    description: "",
    genre: "",
    public: false,
    authorId,
    worldId,
    locationId
  };

  if (active === MODAL.MANAGE_BOOK && focusedBook) {
    $form.title = focusedBook.title;
    $form.description = focusedBook.description;
    $form.genre = focusedBook.genre;
    $form.public = focusedBook.public;
    $form.id = focusedBook.id;
    $form.worldId = focusedBook.worldId;
    $form.locationId = focusedBook.locationId;
  }

  return $form;
};

/** Specialized Modal for creating/editing a `Book` */
export default function ManageBookModal(props: ManageBookModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const [formData, setFormData] = useState(initialFormData());
  const { focusedBook: data } = useGlobalLibrary(["focusedBook"]);
  const { id: userId } = useGlobalUser(["id"]);
  const [error, setError] = useState("");
  const [imgData, setImgData] = useState<File | undefined>(undefined);
  const err = (msg: string, noteId?: number) => {
    setError(msg);
    if (msg) updateAsError(msg, noteId);
  };
  const uploadCoverImage = async () => {
    if (!imgData) return undefined;
    if (!userId || userId === -1 || !imgData) return undefined;

    const noteId = addNotification("Uploading image...", true);
    const imageRes = await uploadFileToServer(imgData, "books");
    if (typeof imageRes === "string") {
      updateAsError(imageRes, noteId);
      return undefined;
    }

    if (!imageRes.fileURL) {
      updateAsError("Cover image upload failed", noteId);
      return undefined;
    }

    return imageRes.fileURL;
  };
  const close = () => {
    GlobalLibrary.focusedBook(null);
    onClose();
  };
  const submit = async () => {
    err("");
    // Validate
    if ((formData.title || "").length < 2)
      return err("Title must be at least 2 characters.");
    if (!formData.genre) return err("Genre is required.");

    // Create
    if (!formData.description)
      formData.description = `An exciting new entry into the ${formData.genre} genre.`;
    err("");
    const d = { ...formData };
    if (imgData) d.image = await uploadCoverImage();

    const noteId = addNotification("Saving book...", true);
    const resp = await upsertBook(pruneBookForAPI(d));
    if (typeof resp === "string") return err(resp, noteId);

    // Notify
    if (resp) {
      const { books } = GlobalLibrary.getState();
      const newBooks = d.id
        ? books.map((b) => (b.id === resp.id ? resp : b))
        : [...books, resp];
      GlobalLibrary.multiple({ focusedBook: null, books: newBooks });
      updateNotification("Book saved!", noteId);
      close();
    } else err("Did not create book: please check your entries.");
  };

  useEffect(() => {
    return () => {
      setFormData(initialFormData());
      setError("");
    };
  }, []);

  return (
    <Modal
      open={open}
      onClose={close}
      title={data?.id ? "Edit Book" : "Create Book"}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateBookForm
        data={formData}
        onChange={setFormData}
        onCoverImage={setImgData}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
