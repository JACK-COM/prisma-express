import CreateRelationshipForm from "components/Form.CreateRelationships";
import {
  CreateRelationshipData,
  upsertRelationships
} from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  clearGlobalModal,
  removeNotification,
  updateAsError,
  updateRelationships
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalCharacter } from "hooks/GlobalCharacter";

/** Modal props */
type ManageRelationshipsModalProps = {
  open: boolean;
  data?: Partial<CreateRelationshipData>[];
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Relationship` */
export default function ManageRelationshipsModal(
  props: ManageRelationshipsModalProps
) {
  const { data = [], open, onClose = clearGlobalModal } = props;
  const { focusedCharacter } = useGlobalCharacter(["focusedCharacter"]);
  const [notificationID, setNotificationID] = useState<number | null>(null);
  const [formData, setFormData] =
    useState<Partial<CreateRelationshipData>[]>(data);
  const [error, setError] = useState("");
  const showError = (msg: string) => {
    setError(msg);
    setNotificationID(updateAsError(msg));
  };
  const clearErrors = () => {
    setError("");
    if (notificationID) {
      removeNotification(notificationID);
      setNotificationID(null);
    }
  };
  // Validate form data
  const validateFormData = (data: Partial<CreateRelationshipData>[]) => {
    return data.reduce((acc, curr) => {
      if (!curr.characterId) curr.characterId = focusedCharacter?.id;
      if (acc.length > 0) return acc;
      if (!curr.targetId) return "Relationship target is required";
      return acc;
    }, "");
  };
  // Submit form data
  const submit = async () => {
    if (!focusedCharacter) return showError("No character selected.");
    const nextError = validateFormData(formData);
    if (nextError.length > 0) return showError(nextError);
    // Create
    setError(nextError);
    const resp = await upsertRelationships(focusedCharacter.id, formData);
    // Notify
    if (typeof resp === "string") showError(resp);
    else if (resp) {
      updateRelationships([resp]);
      onClose();
    } else showError("Did not link characters: please check your entries.");
  };
  const updateFormData = (data: Partial<CreateRelationshipData>[]) => {
    setFormData(data);
    clearErrors();
  };

  useEffect(() => {
    if (data.length) setFormData([...data]);
    else setFormData([]);
    return () => {
      setFormData([]);
      clearErrors();
    };
  }, [data]);

  if (!focusedCharacter) return <></>;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data[0] ? "Edit Relationships" : "Add Relationships"}
      cancelText="Cancel"
      confirmText={data[0] ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateRelationshipForm
        character={focusedCharacter}
        data={formData}
        onChange={updateFormData}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
