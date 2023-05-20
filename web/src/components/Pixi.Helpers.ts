import { Container } from "@pixi/react";
import { GlobalMovableOptions } from "hooks/GlobalPixiMovable";
import { FederatedWheelEvent } from "pixi.js";
import { Sprite as PixiReactSprite } from "@pixi/react";
import { OutlineFilter } from "@pixi/filter-outline";
import { ComponentPropsWithRef } from "react";
import {
  ExplorationSceneLayer,
  GlobalExploration,
  clearGlobalModal,
  convertTemplateToAPIScene,
  convertToSceneTemplate,
  setGlobalExplorationScene,
  setGlobalSceneData,
  setGlobalSlotIndex,
  updateAsError
} from "state";
import { noOp } from "utils";
import {
  ExplorationSceneTemplate,
  InteractiveSlot,
  InteractiveSlotCore,
  SlotAction,
  SlotInteraction,
  SlotInteractionData
} from "utils/types";

export const layerColors: Record<ExplorationSceneLayer, number> = {
  all: 0, // this should NEVER render its own layer
  background: 0x3d85f1,
  characters: 0xe678cc,
  foreground: 0x2eb72e
};
export const layerFilters: Record<
  ExplorationSceneLayer,
  [OutlineFilter] | undefined
> = {
  all: undefined,
  background: [new OutlineFilter(2, layerColors.background, 1)],
  characters: [new OutlineFilter(2, layerColors.characters, 1)],
  foreground: [new OutlineFilter(2, layerColors.foreground, 1)]
};

export type PixiSpriteProps = {
  editing?: boolean;
  containerProps: GlobalMovableOptions & {
    src?: string;
    onDisplayScrolled?: (e: FederatedWheelEvent) => void;
  };
} & ComponentPropsWithRef<typeof PixiReactSprite>;

// Editor Container props (contains all layersl)
export type EditorProps = {
  x?: number;
  y?: number;
  editing?: boolean;
  scene?: ExplorationSceneTemplate | null;
  layer?: ExplorationSceneLayer;
  onChange?: (d: ExplorationSceneTemplate) => void;
} & Omit<ComponentPropsWithRef<typeof Container>, "onChange">;

// Shared props for all scene layers
export type CanvasLayerProps = Omit<EditorProps, "onChange" | "scene"> & {
  onChange?: (d: InteractiveSlot[]) => void;
  slots: InteractiveSlot[];
};

type UpdateLayerOpts = {
  slot: InteractiveSlot;
  src: InteractiveSlot[];
  editing: boolean;
  onChange: (slot: InteractiveSlot[]) => void;
};

/** Notify a parent of updates to a Canvas Layer  */
export const updateLayer = (opts: UpdateLayerOpts) => {
  const { slot, src, editing = false, onChange = noOp } = opts;
  if (!editing) return;
  const { index = 1 } = slot;
  const updates = src.map((d) => (d.index === index ? slot : d));
  onChange(updates);
};

/**
 * Convert Scene Template data into editable Sprite props. This will be used for
 * sprites when the application is in `editing` mode.
 */
export function editableSpriteProps(props: CanvasLayerProps) {
  const { editing = false, onChange = noOp, layer = "all", slots } = props;

  return (slot: InteractiveSlot) => {
    const { xy = [0, 0], scale = 1, anchor = 0.5 } = slot;
    const onSlotSelect = () => {
      if (!slot.index || slot.index < 0) return;
      setGlobalSlotIndex(slot.index - 1, layer);
      clearGlobalModal();
    };

    return {
      zIndex: 10 + (slot.index || 1),
      scrollToScale: !slot.lock?.size && (props.editing || false),
      containerProps: {
        xy,
        src: slot.url,
        scale,
        anchor,
        movable: !slot.lock?.position && props.editing,
        resizable: !slot.lock?.size && props.editing,

        // Slot got dragged/moved
        onDisplayChanged: (p: InteractiveSlotCore) => {
          const newSlot = Object.assign({}, slot, p);
          updateLayer({ slot: newSlot, editing, onChange, src: slots });
          onSlotSelect();
        },

        // Slot got clicked
        onSlotSelect
      }
    } as PixiSpriteProps;
  };
}

/** Convert Scene Template data into preview-Sprite props (scene is NOT in `editing` mode) */
export function previewSpriteProps(props: CanvasLayerProps) {
  const { layer = "all" } = props;
  const { NONE } = SlotAction;
  const isAssigned = (d: SlotAction) => d && d !== SlotAction.NONE;

  return (slot: InteractiveSlot) => {
    const { xy = [0, 0], scale = 1, anchor = 0.5, interaction } = slot;
    const { horizontal_drag: drag = NONE, click = NONE } = interaction || {};
    const hasClick = isAssigned(click);
    const hasDrag = isAssigned(drag);
    const hasEvent = hasClick || hasDrag;
    const event = hasClick ? click : drag;
    const onSlotSelect = () => {
      if (!interaction?.data || !hasEvent) return;
      handleSlotInteraction({
        name: slot.name || "",
        action: hasClick ? click : drag,
        data: interaction.data
      });
    };

    return {
      filters: [],
      eventMode: hasEvent ? "dynamic" : "none",
      zIndex: 10 + (slot.index || 1),
      scrollToScale: !slot.lock?.size && (props.editing || false),
      // Apply filter on hover
      pointerover: (e) => {
        if (!hasEvent) return;
        e.target.filters = layerFilters[layer];
      },
      // Clear filter on hover exit
      pointerout: (e) => {
        if (!hasEvent) return;
        e.target.filters = [];
      },
      containerProps: {
        xy,
        src: slot.url,
        scale,
        anchor,
        movable: props.editing && !slot.lock?.position,
        resizable: props.editing && !slot.lock?.size,

        // Slot got dragged/moved
        onDisplayChanged: (p: InteractiveSlotCore) => {
          console.log("onSlotSelect", slot);
          // const newSlot = Object.assign({}, slot, p);
          //     updateLayer({ slot: newSlot, editing, onChange, src: slots });
          //     onSlotSelect();
        },

        // Slot got clicked
        onSlotSelect
      }
    } as PixiSpriteProps;
  };
}

// HELPERS
type SlotHandlerOpts = {
  action: SlotAction;
  data: SlotInteractionData;
  name: string;
};
function handleSlotInteraction(opts: SlotHandlerOpts) {
  const { action, data, name } = opts;
  const { exploration } = GlobalExploration.getState();
  const { Scenes } = exploration || { Scenes: [] };

  switch (action) {
    case SlotAction.NAV_SCENE: {
      const next = Scenes.find((d) => d.id === data.target);
      if (!next) return updateAsError("Scene not found");
      return setGlobalExplorationScene(convertToSceneTemplate(next));
    }
    case SlotAction.SHOW_TEXT: {
      return setGlobalSceneData({ name, data });
    }
    default:
      console.log("Unhandled slot action", opts);
      break;
  }
}
