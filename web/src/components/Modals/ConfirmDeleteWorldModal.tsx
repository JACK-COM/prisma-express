import Modal from "./Modal";
import { APIData, World } from "utils/types";
import {
  addNotification,
  clearGlobalModal,
  removeWorld,
  updateAsError
} from "state";
import { deleteWorld } from "graphql/requests/worlds.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

const ConfirmDeleteWorldModal = (props: Props) => {
  const { open = false, onClose = clearGlobalModal } = props;
  const { focusedWorld: world } = useGlobalWorld(["focusedWorld"]);
  const { id, name } = world || ({ id: -1 } as APIData<World>);
  const modalTitle = `Delete ${name}?`;
  const handleDeleteWorld = async () => {
    if (!world || id === -1) return updateAsError("No world selected.");
    const noteId = addNotification("Deleting world...", true);
    const res = await deleteWorld(id);
    if (typeof res === "string") updateAsError(res, noteId);
    else if (res) {
      removeWorld(world.id);
      onClose();
    }
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onClose={onClose}
      onConfirm={handleDeleteWorld}
      confirmText="Delete World"
      cancelText="Cancel"
    >
      <p>
        Are you sure you want to delete <b className="accent--text">{name}</b>?
        This action cannot be undone.
      </p>
    </Modal>
  );
};

export default ConfirmDeleteWorldModal;
