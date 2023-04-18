import {
  CreateEventData,
  upsertEvents
} from "graphql/requests/timelines.graphql";
import Modal from "./Modal";
import { ErrorMessage } from "components/Common/Containers";
import CreateWorldEventsForm from "components/Form.CreateWorldEvents";
import { useEffect, useState } from "react";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { APIData } from "utils/types";
import { clearGlobalModal } from "state";
import { mergeLists } from "utils";

/** Modal props */
type ManageWorldEventsModalProps = {
  open: boolean;
  data?: Partial<CreateEventData>[] | null;
  onClose?: () => void;
};

// Empty/default form data
const emptyForm = (): Partial<CreateEventData>[] => [];

// API form data (to prevent gql errors)
const condenseFormData = (data: Partial<CreateEventData>[]) =>
  data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    target: item.target,
    polarity: item.polarity,
    groupId: item.groupId,
    locationId: item.locationId,
    worldId: item.worldId
  }));

/** Specialized Modal for creating/editing a `WorldEvent` */
export default function ManageWorldEventsModal(
  props: ManageWorldEventsModalProps
) {
  const { data = [], open, onClose = clearGlobalModal } = props;
  const { updateEvents } = useGlobalWorld(["events"]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<CreateEventData>[]>(
    data?.length ? condenseFormData(data) : emptyForm()
  );
  const resetForm = () => setFormData(emptyForm());
  const submit = async () => {
    // validate
    const errorMessage = formData.reduce((acc, item) => {
      if (acc.length > 0) return acc;
      if (!item.name) return "Name is required on all items.";
      if (item.name.length < 4)
        return "Event name must be at least 4 characters.";
      return acc;
    }, "");
    setError(errorMessage);
    if (errorMessage.length > 0) return;

    // Create & notify
    const resp = await upsertEvents(formData);
    if (typeof resp === "string") setError(resp);
    else if (!resp) return;

    updateEvents(resp);
    resetForm();
    onClose();
  };

  // Reset form data when modal is closed
  useEffect(() => {
    if (data?.length) setFormData(mergeLists(data, formData));
    else resetForm();

    return () => {
      setError("");
      resetForm();
    };
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${data?.length ? "Manage" : "Create"} Global Events`}
      cancelText="Cancel"
      confirmText={`${data?.length ? "Update" : "Create"} Global Events`}
      onConfirm={submit}
    >
      <CreateWorldEventsForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
