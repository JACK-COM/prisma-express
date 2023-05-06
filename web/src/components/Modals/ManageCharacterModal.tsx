import CreateCharacterForm from "components/Form.CreateCharacter";
import {
  CreateCharacterData,
  upsertCharacter
} from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  GlobalCharacter,
  GlobalWorld,
  addNotification,
  clearGlobalModal,
  updateAsError,
  updateCharacters,
  updateNotification
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import { APIData, Character } from "utils/types";

/** Modal props */
type ManageCharacterModalProps = {
  open: boolean;
  data?: Partial<CreateCharacterData> | null;
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Character` */
export default function ManageCharacterModal(props: ManageCharacterModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const { focusedCharacter: data } = useGlobalCharacter(["focusedCharacter"]);
  const [formData, setFormData] = useState<Partial<CreateCharacterData>>({});
  const [error, setError] = useState("");
  const showError = (msg: string, noteId = -1) => {
    setError(msg);
    updateAsError(msg, noteId);
  };
  const submit = async () => {
    // Validate
    if (!formData.name) return showError("Name is required.");
    if (formData.name.length < 2)
      return showError("Name must be at least 2 characters.");

    // Create
    setError("");
    if (!formData.description) formData.description = "No description.";
    const noteId = addNotification("Saving character...");
    const resp = await upsertCharacter(formData);
    if (typeof resp === "string") return setError(resp);
    else if (resp) {
      // Notify
      updateNotification("Character saved!", noteId);
      updateCharacters([resp]);
      onClose();
    } else {
      const e = "Did not create character: please check your entries.";
      showError(e, noteId);
    }
  };

  useEffect(() => {
    return () => {
      setFormData({});
      setError("");
    };
  }, [open]);

  return (
    <Modal
      open={open}
      title={data?.id ? "Edit Character" : "Create Character"}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onClose={onClose}
      onConfirm={submit}
    >
      {open && <CreateCharacterForm onChange={setFormData} />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
