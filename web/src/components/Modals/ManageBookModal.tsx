import CreateBookForm from "components/Form.CreateBook";
import {
  UpsertBookData,
  pruneBookForAPI,
  upsertBook
} from "graphql/requests/books.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { clearGlobalModal, updateAsError, updateBooksState } from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalLibrary } from "hooks/GlobalLibrary";

/** Modal props */
type ManageBookModalProps = {
  open: boolean;
  // data?: Partial<UpsertBookData> | null;
  onClose?: () => void;
};

// Empty/default form data
const emptyForm = (): Partial<UpsertBookData> => ({ public: false });

/** Specialized Modal for creating/editing a `Book` */
export default function ManageBookModal(props: ManageBookModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const [formData, setFormData] = useState(emptyForm());
  const { focusedBook: data } = useGlobalLibrary();
  const [error, setError] = useState("");
  const err = (msg: string) => {
    setError(msg);
    if (msg) updateAsError(msg);
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
    const resp = await upsertBook(pruneBookForAPI(formData));
    if (typeof resp === "string") return err(resp);

    // Notify
    if (resp) {
      updateBooksState([resp]);
      onClose();
    } else err("Did not create book: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData({ ...data });
    else if (!data) setFormData(emptyForm());

    return () => {
      setFormData(emptyForm());
      setError("");
    };
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data?.id ? "Edit Book" : "Create Book"}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateBookForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
