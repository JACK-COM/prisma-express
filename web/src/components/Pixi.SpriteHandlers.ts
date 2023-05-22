import {
  GlobalExploration,
  convertAPISceneToTemplate,
  setGlobalExplorationScene,
  setGlobalSceneData,
  updateAsError
} from "state";
import { noOp } from "utils";
import { InteractiveSlot, SlotAction, SlotInteractionData } from "utils/types";

type UpdateLayerOpts = {
  slot: InteractiveSlot;
  src: InteractiveSlot[];
  editing: boolean;
  onChange: (slot: InteractiveSlot[]) => void;
};

/** Notify a parent of updates to a Canvas Layer  */
export function updateLayer(opts: UpdateLayerOpts) {
  const { slot, src, editing = false, onChange = noOp } = opts;
  if (!editing) return;
  const { index = 1 } = slot;
  const updates = src.map((d) => (d.index === index ? slot : d));
  onChange(updates);
}

type SlotHandlerOpts = {
  action: SlotAction;
  data?: SlotInteractionData;
  name: string;
};

/** Handle a click- or drag-event on a sprite  */
export function handleSlotInteraction(opts: SlotHandlerOpts) {
  const { action, data = {}, name } = opts;
  const { exploration } = GlobalExploration.getState();
  const { Scenes } = exploration || { Scenes: [] };

  switch (action) {
    case SlotAction.NAV_SCENE: {
      const next = Scenes.find((d) => d.id === data.target);
      if (!next) return updateAsError("Scene not found");
      return setGlobalExplorationScene(convertAPISceneToTemplate(next));
    }
    case SlotAction.CHOOSE:
    case SlotAction.SHOW_TEXT: {
      return setGlobalSceneData({ name, data });
    }
    default:
      console.log("Unhandled slot action", opts);
      break;
  }
}
