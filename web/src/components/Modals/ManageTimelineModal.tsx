import {
  CreateTimelineData,
  upsertTimeline
} from "graphql/requests/timelines.graphql";
import Modal from "./Modal";
import { ErrorMessage } from "components/Common/Containers";
import CreateTimelineForm from "components/Form.CreateTimeline";
import { useEffect, useState } from "react";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { APIData, Timeline } from "utils/types";
import {
  GlobalWorld,
  addNotification,
  clearGlobalModal,
  updateAsError
} from "state";

/** Modal props */
type ManageTimelineModalProps = {
  open: boolean;
  data?: Partial<CreateTimelineData> | null;
  onClose?: () => void;
};

// Empty/default form data
const emptyForm = (): Partial<CreateTimelineData> => ({
  events: [],
  worldId: GlobalWorld.getState().focusedWorld?.id
});
// API form data (to prevent gql errors)
const condenseFormData = (data: Partial<CreateTimelineData>) => ({
  id: data.id,
  name: data.name,
  authorId: data.authorId,
  worldId: data.worldId,
  events: data.events || []
});

/** Specialized Modal for creating/editing a `Timeline` */
export default function ManageTimelineModal(props: ManageTimelineModalProps) {
  const { open, onClose = clearGlobalModal } = props;
  const { focusedTimeline: data, updateTimelines } = useGlobalWorld([
    "focusedTimeline"
  ]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<CreateTimelineData>>(
    data ? condenseFormData(data) : emptyForm()
  );
  const resetForm = () => setFormData(emptyForm());
  const onError = (err: string, noteId?: number) => {
    setError(err);
    updateAsError(err, noteId);
  };
  const submit = async () => {
    // validate
    if (!formData.name) return onError("Name is required.");
    if (formData.name.length < 2)
      return onError("Name must be at least 2 characters.");

    // Create & notify
    setError("");
    const noteId = addNotification("Saving timeline...", true);
    const resp = await upsertTimeline(formData);
    if (typeof resp === "string") return onError(resp, noteId);
    if (!resp) return onError("Failed to save timeline.", noteId);
    if (resp.id === data?.id) GlobalWorld.focusedTimeline(resp);
    updateTimelines([resp as APIData<Timeline>]);
    resetForm();
    onClose();
  };

  // Reset form data when modal is closed
  useEffect(() => {
    if (data) setFormData(condenseFormData(data));
    else resetForm();
    return resetForm;
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${data?.id ? "Manage" : "Create"} Timeline`}
      cancelText="Cancel"
      confirmText={`${data?.id ? "Update" : "Create"} Timeline`}
      onConfirm={submit}
    >
      <CreateTimelineForm data={formData} onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Modal>
  );
}
