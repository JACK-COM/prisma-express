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
  const { focusedCharacter } = useGlobalCharacter(["focusedCharacter"]);
  const [formData, setFormData] =
    useState<Partial<CreateRelationshipData>[]>(data);
  const [error, setError] = useState("");
  const submit = async () => {
    // Validate
    const nextError = formData.reduce((acc, curr) => {
      if (!curr.characterId) curr.characterId = focusedCharacter?.id;
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
    if (data.length) setFormData([...data, ...formData]);
    else setFormData([]);
    return () => setFormData([]);
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
        onChange={setFormData}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
