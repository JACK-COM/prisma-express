import CreateCharacterForm from "components/Form.CreateCharacter";
import {
  CreateCharacterData,
  upsertCharacter
} from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { clearGlobalModal, updateAsError, updateCharacters } from "state";
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
  const showError = (msg: string) => {
    setError(msg);
    updateAsError(msg);
  };
  const submit = async () => {
    // Validate
    if (!formData.name) return showError("Name is required.");
    if (formData.name.length < 2)
      return showError("Name must be at least 2 characters.");

    // Create
    setError("");
    if (!formData.description) formData.description = "No description.";
    const resp = await upsertCharacter(formData);
    if (typeof resp === "string") return setError(resp);
    else if (resp) {
      // Notify
      updateCharacters([resp]);
      onClose();
    } else showError("Did not create character: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData({ ...data, ...formData });
    return () => {
      setFormData({});
      setError("");
    };
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
