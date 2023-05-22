import CreateExplorationSceneForm from "components/Form.CreateExplorationScene";
import {
  pruneExplorationSceneData,
  upsertExplorationScene
} from "graphql/requests/explorations.graphql";
import { useState } from "react";
import Modal from "./Modal";
import {
  addNotification,
  clearGlobalModal,
  convertTemplateToAPIScene,
  setGlobalExploration,
  updateAsError,
  updateNotification
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import useGlobalExploration from "hooks/GlobalExploration";
import { ExplorationSceneTemplate } from "utils/types";

/** Modal props */
type ManageExplorationSceneModalProps = {
  open: boolean;
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `ExplorationScene` */
export default function ManageExplorationSceneModal(
  props: ManageExplorationSceneModalProps
) {
  const { open, onClose = clearGlobalModal } = props;
  const { exploration } = useGlobalExploration(["exploration"]);
  const [formData, setFormData] = useState<ExplorationSceneTemplate>();
  const [error, setError] = useState("");
  const err = (msg: string, noteId?: number) => {
    setError(msg);
    if (noteId) updateAsError(msg, noteId);
  };
  const submit = async () => {
    if (!formData) return err("No data to submit.");
    err("");
    // Create
    if (!formData.title) formData.title = "Untitled ExplorationScene";
    if (!formData.description) formData.description = "";
    if (!formData.explorationId) formData.explorationId = exploration?.id;

    const noteId = addNotification("Saving Scene...", true);
    const forAPI = convertTemplateToAPIScene(formData);
    const resp = await upsertExplorationScene(
      pruneExplorationSceneData(forAPI)
    );
    if (typeof resp === "string") return err(resp, noteId);
    const e = `Scene not saved: please check your entries.`;
    if (!resp) return err(e, noteId);

    // Notify
    updateNotification("Scene saved!", noteId);
    setGlobalExploration(resp);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${formData?.id ? "Edit" : "Create"} Exploration Scene`}
      cancelText="Cancel"
      confirmText={formData?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateExplorationSceneForm onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
