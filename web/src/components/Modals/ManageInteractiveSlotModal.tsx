import { useMemo, useState } from "react";
import {
  MODAL,
  GlobalModal,
  GlobalUser,
  addNotification,
  clearGlobalModal,
  convertTemplateToAPIScene,
  setGlobalExploration,
  updateAsError,
  updateNotification
} from "state";
import { ErrorMessage } from "components/Common/Containers";
import useGlobalExploration from "hooks/GlobalExploration";
import { InteractiveSlot } from "utils/types";
import CreateInteractiveSlotForm from "components/Form.CreateInteractiveSlot";
import ModalDrawer from "./ModalDrawer";
import { uploadFileToServer } from "api/loadUserData";
import {
  pruneExplorationSceneData,
  upsertExplorationScene
} from "graphql/requests/explorations.graphql";
import { ButtonWithIcon } from "components/Forms/Button";
import { Form } from "components/Forms/Form";
import { suppressEvent } from "utils";

/** Modal props */
type ManageInteractiveSlotModalProps = {
  open: boolean;
  onClose?: () => void;
};

/** @modal Create/edit an `Interactive Slot` in a scene */
export default function ManageInteractiveSlotModal(
  props: ManageInteractiveSlotModalProps
) {
  const { open, onClose = clearGlobalModal } = props;
  const { active } = GlobalModal.getState();
  const editing = active === MODAL.MANAGE_INTERACTIVE_SLOT;
  const action = editing ? "Manage" : "Create";
  const {
    activeLayer: layer = "all",
    explorationScene,
    activeSlotIndex = -1
  } = useGlobalExploration([
    "activeLayer",
    "explorationScene",
    "activeSlotIndex"
  ]);
  const activeSlots = useMemo<InteractiveSlot[]>(() => {
    if (!explorationScene) return [];
    return layer === "all" ? [] : explorationScene[layer];
  }, [layer]);
  const activeSlot = useMemo(() => {
    if (!activeSlots.length) return undefined;
    return activeSlots[activeSlotIndex] || undefined;
  }, [activeSlotIndex, activeSlots]);
  const name = useMemo(() => activeSlot?.name || layer, [activeSlot]);
  const [formData, setFormData] = useState<InteractiveSlot>();
  const [error, setError] = useState("");
  const err = (msg: string, noteId?: number) => {
    setError(msg);
    if (noteId) updateAsError(msg, noteId);
  };
  // Upload sprite image
  const uploadSprite = async (fileName: string, b64Img: string) => {
    const { id: userId } = GlobalUser.getState();
    if (!userId || userId === -1 || !b64Img) return "";

    const noteId = addNotification("Uploading Slot image...", true);
    const splitDataURI = b64Img.split(",");
    const dataType = splitDataURI[0].split(":")[1].split(";")[0];
    const ext = dataType.split("/")[1];
    const imageRes = await uploadFileToServer(null, "explorationScenes", {
      file: b64Img,
      name: `${fileName}.${ext}`,
      imgContentType: dataType
    });
    if (typeof imageRes === "string") {
      updateAsError(imageRes, noteId);
    } else if (imageRes?.fileURL) {
      updateNotification("Slot image uploaded!", noteId);
      return imageRes.fileURL;
    }

    updateAsError("Image upload failed", noteId);
    return "";
  };
  // Remove a slot from the scene
  const deleteSlot = async () => {
    if (!editing || !activeSlot || activeSlotIndex < -1) return;
    const newSlots = activeSlots.filter((_, i) => i !== activeSlotIndex);
    return sendToAPI(newSlots);
  };

  // Save the entire `Exploration Scene`
  const submit = async () => {
    if (!explorationScene) return err("No scene is selected!");
    if (layer === "all") return err("No layer is selected!");
    if (!formData) return err("No data to submit.");
    const slotIndex = editing ? activeSlotIndex : formData.index!;

    err("");
    const newSlots = [...activeSlots];
    const slot = { ...activeSlot?.interaction, ...formData };
    if (slot.url?.startsWith("data:image")) {
      const name = (slot.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
      slot.url = await uploadSprite(name, slot.url);
    }
    newSlots[slotIndex] = slot;
    return sendToAPI(newSlots);
  };

  const sendToAPI = async (slots: InteractiveSlot[]) => {
    if (!explorationScene) return err("No scene is selected!");
    const newScene = { ...explorationScene, [layer]: slots };
    const noteId = addNotification("Saving Scene...");
    const forAPI = convertTemplateToAPIScene(newScene);
    const resp = await upsertExplorationScene(
      pruneExplorationSceneData(forAPI)
    );
    if (typeof resp === "string") return err(resp as any, noteId);
    const e = `Scene not saved: please check your entries.`;
    if (!resp) return err(e, noteId);

    // Notify
    updateNotification("Scene saved!", noteId);
    setGlobalExploration(resp);
    onClose();
  };

  return (
    <ModalDrawer
      open={open}
      openTowards="right"
      onClose={onClose}
      title={`${action} <b class="accent--text">${name}</b>`}
      cancelText="Cancel"
      confirmText={"Confirm"}
      onConfirm={submit}
    >
      <CreateInteractiveSlotForm onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {editing && (
        <Form onSubmit={suppressEvent}>
          <ButtonWithIcon
            type="button"
            text="Delete Slot"
            variant="outlined"
            size="lg"
            icon="delete"
            onClick={deleteSlot}
            className="error--text"
          />
        </Form>
      )}
    </ModalDrawer>
  );
}
