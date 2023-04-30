import {
  CreateLocationData,
  pruneLocationForAPI,
  upsertLocation
} from "graphql/requests/worlds.graphql";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { clearGlobalModal, removeNotification, updateAsError } from "state";
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

/** Specialized Modal for creating/editing a World `Location` */
export default function ManageLocationModal(props: ManageLocationModalProps) {
  const { data, open, onClose = clearGlobalModal, worldId } = props;
  const { updateLocations } = useGlobalWorld(["worldLocations"]);
  const [error, setError] = useState("");
  const [notificationId, setNotificationId] = useState<number>(-1);
  const [formData, setFormData] = useState<Partial<CreateLocationData>>({
    climate: Climate.Temperate,
    flora: Richness.Adequate,
    fauna: Richness.Adequate
  });
  const onError = (err: string) => {
    setError(err);
    setNotificationId(updateAsError(err, notificationId));
  };
  const clearError = () => {
    setError("");
    if (notificationId === -1) return;
    removeNotification(notificationId)
    setNotificationId(-1);
  };
  const resetForm = () =>
    setFormData({
      climate: Climate.Temperate,
      flora: Richness.Adequate,
      fauna: Richness.Adequate
    });
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

    // Notify
    const resp = await upsertLocation(pruneLocationForAPI(formData));
    if (typeof resp === "string") return onError(resp);

    updateLocations([resp as APIData<Location>]);
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (data)
      setFormData({
        ...data,
        ...formData,
        climate: data.climate, //
        flora: data.flora, //
        fauna: data.fauna //
      });
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
      <CreateLocationForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
