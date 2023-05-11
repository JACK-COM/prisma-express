import {
  CreateEventData,
  upsertEvents
} from "graphql/requests/timelines.graphql";
import Modal from "./Modal";
import { ErrorMessage } from "components/Common/Containers";
import CreateWorldEventsForm from "components/Form.CreateWorldEvents";
import { useEffect, useState } from "react";
import { useGlobalWorld } from "hooks/GlobalWorld";
import {
  addNotification,
  clearGlobalModal,
  setGlobalWorld,
  updateAsError,
  updateNotification,
  updateWorlds
} from "state";
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
    authorId: item.authorId,
    description: item.description,
    groupId: item.groupId,
    id: item.id,
    locationId: item.locationId,
    name: item.name,
    polarity: item.polarity,
    target: item.target,
    worldId: item.worldId
  }));

/** Specialized Modal for creating/editing a `WorldEvent` */
export default function ManageWorldEventsModal(
  props: ManageWorldEventsModalProps
) {
  const { open, onClose = clearGlobalModal } = props;
  const { focusedWorld } = useGlobalWorld(["focusedWorld"]);
  const { Events: data = [] } = focusedWorld || {};
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<CreateEventData>[]>(
    data?.length ? condenseFormData(data) : emptyForm()
  );
  const onErr = (err: string, noteId?: number) => {
    setError(err);
    updateAsError(err, noteId);
  };
  const resetForm = () => setFormData(emptyForm());
  const submit = async () => {
    // validate
    if (!focusedWorld) return onErr("No world selected.");
    const errorMessage = formData.reduce((acc, item) => {
      if (acc.length > 0) return acc;
      if (!item.name) return "Name is required on all items.";
      if (item.name.length < 4)
        return "Event name must be at least 4 characters.";
      return acc;
    }, "");
    onErr(errorMessage);
    if (errorMessage.length > 0) return;

    // Create & notify
    const noteId = addNotification("Saving events...");
    const resp = await upsertEvents(formData);
    if (typeof resp === "string") onErr(resp, noteId);
    else if (!resp) return onErr("Failed to save events.", noteId);

    updateNotification("Events saved!", noteId);
    updateWorlds([resp]);
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
