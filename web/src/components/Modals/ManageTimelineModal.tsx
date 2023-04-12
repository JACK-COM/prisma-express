// import CreateTimelineForm from "components/Form.CreateTimeline";
import { CreateTimelineData } from "graphql/requests/timelines.graphql";
import { useGlobalModal } from "hooks/GlobalModal";
import Modal from "./Modal";
import { MatIcon } from "components/Common/Containers";

/** Modal props */
type ManageTimelineModalProps = {
  open: boolean;
  data?: Partial<CreateTimelineData> | null;
  onClose?: () => void;
};

// Empty/default form data
const emptyForm = (): Partial<CreateTimelineData> => ({
  events: [],
  name: ""
});

/** Specialized Modal for creating/editing a `Timeline` */
export default function ManageTimelineModal(props: ManageTimelineModalProps) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <h1>Manage Timeline</h1>
      <MatIcon icon="date" />
    </Modal>
  );
}
