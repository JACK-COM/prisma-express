import CreateCharacterForm from "components/Form.CreateCharacter";
import {
  CreateCharacterData,
  createOrUpdateCharacter
} from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { clearGlobalModal, updateCharacters } from "state";
import { ErrorMessage } from "components/Common/Containers";

/** Modal props */
type ManageCharacterModalProps = {
  open: boolean;
  data?: Partial<CreateCharacterData> | null;
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Character` */
export default function ManageCharacterModal(props: ManageCharacterModalProps) {
  const { data, open, onClose = clearGlobalModal } = props;
  const [formData, setFormData] = useState<Partial<CreateCharacterData>>({});
  const [error, setError] = useState("");
  const submit = async () => {
    // Validate
    if (!formData.name) return setError("Name is required.");
    if (formData.name.length < 2)
      return setError("Name must be at least 2 characters.");
    else setError("");

    // Create
    if (!formData.description) formData.description = "No description.";
    const resp = await createOrUpdateCharacter(formData);

    // Notify
    if (resp) {
      updateCharacters([resp]);
      onClose();
    } else setError("Did not create character: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData({ ...data, ...formData });
    return () => setFormData({});
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data?.id ? "Edit Character" : "Create Character"}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateCharacterForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
