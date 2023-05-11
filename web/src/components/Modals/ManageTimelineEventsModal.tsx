import {
  CreateTimelineEventData,
  deleteTimelineEvent,
  upsertTimelineEvents
} from "graphql/requests/timelines.graphql";
import Modal from "./Modal";
import { ErrorMessage } from "components/Common/Containers";
import CreateTimelineEventsForm from "components/Form.CreateTimelineEvents";
import { useEffect, useState } from "react";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { APIData, TimelineEvent } from "utils/types";
import { GlobalWorld, clearGlobalModal } from "state";
import { mergeLists } from "utils";

/** Modal props */
type ManageTimelineEventsModalProps = {
  open: boolean;
  timelineId: number;
  data?: Partial<CreateTimelineEventData>[] | null;
  onClose?: () => void;
};

// Empty/default form data
const emptyForm = (): Partial<CreateTimelineEventData>[] => [];

// API form data (remove some original data props to limit gql errors)
const condenseFormData = (
  data: Partial<CreateTimelineEventData>[]
): Partial<CreateTimelineEventData>[] =>
  data.map((item, i) => ({
    id: item.id,
    order: item.order || i + 1,
    eventId: item.eventId,
    timelineId: item.timelineId
  }));

/** Specialized Modal for creating/editing `TimelineEvents` */
export default function ManageTimelineEventsModal(
  props: ManageTimelineEventsModalProps
) {
  const { data = [], timelineId, open, onClose = clearGlobalModal } = props;
  const { updateTimelines } = useGlobalWorld(["events"]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<APIData<TimelineEvent>>[]>(
    data?.length ? condenseFormData(data) : emptyForm()
  );
  const resetForm = () => {
    setError("");
    setFormData(data?.length ? condenseFormData(data) : emptyForm());
  };
  const deleteItem = async (itemId: number) => {
    const resp = await deleteTimelineEvent(itemId);
    if (!resp) return setError("Timeline event was not deleted.");
    if (typeof resp === "string") return setError(resp);
    setFormData(formData.filter((item) => item.id !== itemId));
    updateTimelines([resp]);
    GlobalWorld.focusedTimeline(resp);
  };
  const submit = async () => {
    // validate
    const errorMessage = formData.reduce((acc, item) => {
      if (acc.length > 0) return acc;
      if (!item.timelineId) return "Timeline is required for all items.";
      if (!item.eventId) return "Event is required for all items.";
      return acc;
    }, "");
    setError(errorMessage);
    if (errorMessage.length > 0) return;

    // Create & notify
    const resp = await upsertTimelineEvents(timelineId, formData);
    if (typeof resp === "string") {
      return setError(resp || "Error creating/updating timeline events.");
    }
    if (resp) {
      updateTimelines([resp]);
      GlobalWorld.focusedTimeline(resp);
      resetForm();
      return onClose();
    }

    setError("Timeline events were not created/updated.");
  };

  // Reset form data when modal is closed
  useEffect(() => {
    if (data?.length) setFormData(mergeLists(condenseFormData(data), formData));
    else resetForm();

    return () => resetForm();
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${data?.length ? "Manage" : "Create"} Timeline Events`}
      cancelText="Cancel"
      confirmText={`${data?.length ? "Update" : "Create"} Timeline Events`}
      onConfirm={submit}
    >
      <CreateTimelineEventsForm
        data={formData}
        onChange={setFormData}
        onRemoveItem={deleteItem}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
