import CreateSceneForm from "components/Form.CreateScene";
import {
  UpsertSceneData,
  pruneSceneForAPI,
  upsertScene
} from "graphql/requests/books.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  clearGlobalModal,
  removeNotification,
  updateAsError,
  updateChaptersState
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalLibrary } from "hooks/GlobalLibrary";

/** Modal props */
type ManageSceneModalProps = {
  open: boolean;
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Scene` */
export default function ManageSceneModal(props: ManageSceneModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const { focusedScene: data, focusedChapter: chapter } = useGlobalLibrary([
    "focusedScene",
    "focusedChapter"
  ]);
  const emptyForm = (): Partial<UpsertSceneData> => ({
    chapterId: chapter?.id
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
    if (!chapter) return err("No chapter selected");

    // Create
    err("");
    const resp = await upsertScene(
      pruneSceneForAPI({
        ...formData,
        title: formData.title || "Untitled Scene",
        order: formData.order || 0,
        description: formData.description || "",
        chapterId: formData.chapterId || chapter?.id
      })
    );
    if (typeof resp === "string") return err(resp);

    // Notify
    if (resp) {
      updateChaptersState([resp]);
      // GlobalLibrary.multiple({ focusedScene, chapters, scenes });
      onClose();
    } else err("Did not create scene: please check your entries.");
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
      title={data?.id ? "Edit Scene" : "Create Scene"}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateSceneForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
