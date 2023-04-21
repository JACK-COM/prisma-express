import CreateChapterForm from "components/Form.CreateChapter";
import {
  UpsertChapterData,
  pruneChapterForAPI,
  upsertChapter
} from "graphql/requests/books.graphql";
import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import {
  GlobalLibrary,
  clearGlobalModal,
  removeNotification,
  updateAsError,
  updateChaptersState
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalLibrary } from "hooks/GlobalLibrary";

/** Modal props */
type ManageChapterModalProps = {
  open: boolean;
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Chapter` */
export default function ManageChapterModal(props: ManageChapterModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const { focusedChapter: data, focusedBook: book } = useGlobalLibrary([
    "focusedChapter",
    "focusedBook"
  ]);
  const order = useMemo(() => (book?.Chapters || []).length + 1, [book]);
  const emptyForm = (): Partial<UpsertChapterData> => ({
    bookId: book?.id,
    order
  });
  const [formData, setFormData] = useState(data || emptyForm());
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const err = (msg: string) => {
    setError(msg);
    if (!msg && notificationId) removeNotification(notificationId);
    else setNotificationId(updateAsError(msg));
  };
  const submit = async () => {
    err("");

    // Create
    if (!formData.title) formData.title = "Untitled Chapter";
    if (!formData.order) formData.order = order;
    if (!formData.description) formData.description = "";
    formData.bookId = book?.id;
    const resp = await upsertChapter(pruneChapterForAPI(formData));
    if (typeof resp === "string") return err(resp);

    // Notify
    if (resp) {
      const updates = updateChaptersState([resp]);
      const focusedChapter = updates.chapters.find(c => c.id === resp.id);
      GlobalLibrary.multiple({ ...updates, focusedChapter });
      onClose();
    } else err("Did not create chapter: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData({ ...data });
    else if (!data) setFormData(emptyForm());

    return () => {
      setFormData(emptyForm());
      err("");
    };
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data?.id ? "Edit Chapter" : "Create Chapter"}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateChapterForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
