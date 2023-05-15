import { useEffect, useMemo, useState } from "react";
import {
  UpsertExplorationInput,
  pruneExplorationData,
  upsertExploration
} from "graphql/requests/explorations.graphql";
import { uploadFileToServer } from "api/loadUserData";
import {
  GlobalExploration,
  GlobalLibrary,
  GlobalModal,
  GlobalUser,
  GlobalWorld,
  MODAL,
  addNotification,
  clearGlobalModal,
  setFocusedExploration,
  updateAsError,
  updateNotification
} from "state";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { ErrorMessage } from "components/Common/Containers";
import { createExplorationTemplate } from "routes/ExplorationBuilder.Helpers";
import CreateExplorationForm from "components/Form.CreateExploration";
import Modal from "./Modal";

/** Modal props */
type ModalProps = {
  open: boolean;
  onClose?: () => void;
};

// Empty/default form data
const initialFormData = (): Partial<UpsertExplorationInput> => {
  const { exploration } = GlobalExploration.getState();
  const { id: authorId } = GlobalUser.getState();
  const { active } = GlobalModal.getState();
  const { focusedLocation, focusedWorld } = GlobalWorld.getState();
  const worldId = focusedWorld?.id;
  const locationId = focusedLocation?.id;
  const $form = {
    ...createExplorationTemplate(),
    authorId,
    locationId,
    worldId
  };

  if (active === MODAL.MANAGE_EXPLORATION && exploration) {
    $form.id = exploration.id;
    $form.title = exploration.title;
    $form.description = exploration.description;
    $form.public = exploration.public;
    $form.worldId = exploration.worldId;
    $form.locationId = exploration.locationId || undefined;
    $form.image = exploration.image;
    $form.price = exploration.price;
    $form.usesAttributes = exploration.usesAttributes;
  }

  return $form;
};

/** Specialized Modal for creating/editing a `Book` */
export default function ManageExplorationModal(props: ModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const [formData, setFormData] = useState(initialFormData());
  const { focusedBook: data } = useGlobalLibrary(["focusedBook"]);
  const { id: userId } = useGlobalUser(["id"]);
  const { focusedWorld, focusedLocation } = useGlobalWorld([
    "focusedWorld",
    "focusedLocation"
  ]);
  const locationName = useMemo(
    () => (focusedLocation || focusedWorld)?.name || "a mystery location",
    [focusedWorld, focusedLocation]
  );
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
    const imageRes = await uploadFileToServer(imgData, "explorations");
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

    // Create
    if (!formData.description) {
      formData.description = `Explore ${locationName} genre.`;
    }
    err("");

    const d = { ...formData };
    if (imgData) d.image = await uploadCoverImage();
    const noteId = addNotification("Saving Exploration...", true);
    const resp = await upsertExploration(pruneExplorationData(d));
    if (typeof resp === "string") return err(resp, noteId);

    // Notify
    if (resp) {
      setFocusedExploration(resp);
      updateNotification("Exploration saved!", noteId, false);
      close();
    } else err("Did not create Exploration: please check your entries.");
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
      title={`${data?.id ? "Edit" : "Create"} Exploration`}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateExplorationForm
        data={formData}
        onChange={setFormData}
        onCoverImage={setImgData}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
