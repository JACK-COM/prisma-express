import {
  CreateLocationData,
  pruneLocationForAPI,
  upsertLocation
} from "graphql/requests/worlds.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  addNotification,
  clearGlobalModal,
  removeNotification,
  setGlobalLocation,
  updateAsError,
  updateNotification
} from "state";
import { APIData, Climate, Location } from "utils/types";
import { Richness } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import CreateLocationForm from "components/Form.CreateLocation";
import { ErrorMessage } from "components/Common/Containers";

/** Modal props */
type ManageLocationModalProps = {
  open: boolean;
  data?: Partial<CreateLocationData> | null;
  worldId: number;
  onClose?: () => void;
};

const DEFAULT_ENVIRONMENT: Partial<CreateLocationData> = {
  climate: Climate.Temperate,
  flora: Richness.Adequate,
  fauna: Richness.Adequate
};

/** Specialized Modal for creating/editing a World `Location` */
export default function ManageLocationModal(props: ManageLocationModalProps) {
  const { data, open, onClose = clearGlobalModal, worldId } = props;
  const [error, setError] = useState("");
  const [formData, setFormData] =
    useState<Partial<CreateLocationData>>(DEFAULT_ENVIRONMENT);
  const onError = (err: string, noteId?: number) => {
    setError(err);
    updateAsError(err, noteId);
  };
  const clearError = () => setError("");
  const resetForm = () =>
    setFormData(DEFAULT_ENVIRONMENT as Partial<CreateLocationData>);
  const submit = async () => {
    // Validate
    if (!formData.name) return onError("Name is required.");
    if (formData.name.length < 2)
      return onError("Name must be at least 2 characters.");

    // Create
    if (!formData.climate) formData.climate = Climate.Temperate;
    if (!formData.flora) formData.flora = Richness.Adequate;
    if (!formData.fauna) formData.fauna = Richness.Adequate;
    if (!formData.description) formData.description = "No description.";
    formData.worldId = worldId;
    clearError();

    // Save and notify
    const noteId = addNotification("Saving location...");
    const resp = await upsertLocation(pruneLocationForAPI(formData));
    if (typeof resp === "string") return onError(resp, noteId);
    setGlobalLocation(resp as APIData<Location>);
    updateNotification("Location saved!", noteId);
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (data) setFormData(data);
    return () => resetForm();
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
      {open &&  <CreateLocationForm onChange={setFormData} />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
