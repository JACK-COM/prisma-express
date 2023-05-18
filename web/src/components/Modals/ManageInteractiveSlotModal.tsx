import { useMemo, useState } from "react";
import {
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
import { ExplorationSceneTemplate, InteractiveSlot } from "utils/types";
import CreateInteractiveSlotForm from "components/Form.CreateInteractiveSlot";
import ModalDrawer from "./ModalDrawer";
import { uploadFileToServer } from "api/loadUserData";
import {
  pruneExplorationSceneData,
  upsertExplorationScene
} from "graphql/requests/explorations.graphql";

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
  const {
    activeLayer: layer = "all",
    explorationScene,
    activeSlotIndex
  } = useGlobalExploration([
    "activeLayer",
    "explorationScene",
    "activeSlotIndex"
  ]);
  const activeLayer = useMemo<InteractiveSlot[]>(() => {
    if (!explorationScene) return [];
    return layer === "all" ? [] : explorationScene[layer];
  }, [layer]);
  const activeSlot = useMemo(() => {
    if (!activeLayer.length || activeSlotIndex === undefined) return undefined;
    return activeLayer[activeSlotIndex] || undefined;
  }, [activeSlotIndex, activeLayer]);
  const activeInteraction = useMemo(() => {
    return activeSlot?.interaction || undefined;
  }, [activeSlot]);
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
      return "";
    }
    if (imageRes?.fileURL) return imageRes.fileURL;

    updateAsError("Image upload failed", noteId);
    return "";
  };
  // Save the entire `Exploration Scene`
  const submit = async () => {
    if (!explorationScene) return err("No scene is selected!");
    if (layer === "all") return err("No layer is selected!");
    if (!formData) return err("No data to submit.");
    const slotIndex = (
      (activeSlotIndex || 0) > 0 ? activeSlotIndex : 0
    ) as number;

    err("");
    const updatedLayer = [...(Array.isArray(activeLayer) ? activeLayer : [])];
    const slot = { ...activeInteraction, ...formData };
    if (slot.url?.startsWith("data:image")) {
      const name = (slot.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
      slot.url = await uploadSprite(name, slot.url);
    }
    updatedLayer[slotIndex] = slot;

    const updatedScene = {
      ...explorationScene,
      [layer]: updatedLayer
    } as ExplorationSceneTemplate;
    const noteId = addNotification("Saving Scene...");
    const forAPI = convertTemplateToAPIScene(updatedScene);
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
      title={`Manage <b class="accent--text">${layer}</b> slot`}
      cancelText="Cancel"
      confirmText={"Confirm"}
      onConfirm={submit}
    >
      <CreateInteractiveSlotForm onChange={setFormData} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ModalDrawer>
  );
}
