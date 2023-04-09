import CreateWorldForm from "components/Form.CreateWorld";
import {
  CreateLocationData,
  createOrUpdateLocation
} from "graphql/requests/worlds.graphql";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { clearGlobalModal } from "state";
import { Climate } from "utils/types";
import { Richness } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import CreateLocationForm from "components/Form.CreateLocation";

/** Modal props */
type ManageLocationModalProps = {
  open: boolean;
  data?: Partial<CreateLocationData> | null;
  worldId: number;
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

/** Specialized Modal for creating/editing a World `Location` */
export default function ManageLocationModal(props: ManageLocationModalProps) {
  const { data, open, onClose = clearGlobalModal, worldId } = props;
  const { updateLocations } = useGlobalWorld(["worldLocations"]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<CreateLocationData>>({
    climate: Climate.Temperate,
    flora: Richness.Adequate,
    fauna: Richness.Adequate
  });
  const submit = async () => {
    // Validate
    if (!formData.name) return setError("Name is required.");
    if (formData.name.length < 2)
      return setError("Name must be at least 2 characters.");

    // Create
    if (!formData.climate) formData.climate = Climate.Temperate;
    if (!formData.flora) formData.flora = Richness.Adequate;
    if (!formData.fauna) formData.fauna = Richness.Adequate;
    if (!formData.description) formData.description = "No description.";
    formData.worldId = worldId;
    setError("");
    const resp = await createOrUpdateLocation(formData);

    // Notify
    if (resp) {
      updateLocations([resp]);
      onClose();
    } else setError("Did not add location: please check your entries.");
  };

  useEffect(() => {
    if (data) setFormData({ ...data, ...formData });
    return () =>
      setFormData({
        climate: Climate.Temperate,
        flora: Richness.Adequate,
        fauna: Richness.Adequate
      });
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${data?.id ? "Edit" : "Create"} Location`}
      cancelText="Cancel"
      confirmText={data?.id ? "Update" : "Create"}
      onConfirm={submit}
    >
      <CreateLocationForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
