import CreateRelationshipForm from "components/Form.CreateRelationships";
import {
  CreateRelationshipData,
  createOrUpdateRelationships
} from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { clearGlobalModal, updateRelationships } from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalCharacter } from "hooks/GlobalCharacter";

/** Modal props */
type CreateRelationshipsModalProps = {
  open: boolean;
  data?: Partial<CreateRelationshipData>[];
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Relationship` */
export default function CreateRelationshipsModal(
  props: CreateRelationshipsModalProps
) {
  const { data = [], open, onClose = clearGlobalModal } = props;
  const { selectedCharacter } = useGlobalCharacter(["selectedCharacter"]);
  const [formData, setFormData] = useState<Partial<CreateRelationshipData>[]>(
    []
  );
  const [error, setError] = useState("");
  const submit = async () => {
    // Validate
    const nextError = formData.reduce((acc, curr) => {
      if (!curr.characterId) curr.characterId = selectedCharacter?.id;
      if (acc.length > 0) return acc;
      if (!curr.targetId) return "Relationship target is required";
      return acc;
    }, "");
    setError(nextError);
    if (nextError.length > 0) return;

    // Create
    const resp = await createOrUpdateRelationships(formData);

    // Notify
    if (resp) {
      updateRelationships([resp]);
      onClose();
    } else setError("Did not link characters: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData([...data, ...formData]);
    return () => setFormData([]);
  }, [data]);

  if (!selectedCharacter) return <></>;

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
        character={selectedCharacter}
        data={formData}
        onChange={setFormData}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
