import CreateWorldForm from "components/Form.CreateWorld";
import { CreateWorldData, createOrUpdateWorld } from "graphql/requests/worlds.graphql";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { clearGlobalModal, updateWorlds } from "state";

/** Modal props */
type ManageWorldModalProps = {
  open: boolean;
  data?: Partial<CreateWorldData> | null;
  onClose?: () => void;
};
/** Error message container */
const ErrorMessage = styled.aside.attrs({
  role: "alert",
  className: "error shake"
})`
  border-radius: ${({ theme }) => theme.presets.round.sm};
  padding: 0.4rem;
`;

/** Specialized Modal for creating/editing a `World` */
export default function ManageWorldModal(props: ManageWorldModalProps) {
  const { data, open, onClose = clearGlobalModal } = props;
  const [formData, setFormData] = useState<Partial<CreateWorldData>>({});
  const [error, setError] = useState("");
  const submit = async () => {
    // Validate
    if (!formData.name) return setError("Name is required.");
    if (formData.name.length < 2)
      return setError("Name must be at least 2 characters.");
    if (!formData.type) return setError("Type is required.");

    // Create
    if (!formData.description) formData.description = "No description.";
    formData.public = formData.public || false;
    setError("");
    const resp = await createOrUpdateWorld(formData);

    // Notify
    if (resp) {
      updateWorlds([resp]);
      onClose();
    } else setError("Did not create world: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData({ ...data, ...formData });
    return () => setFormData({});
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New World"
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateWorldForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
