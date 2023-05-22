import { Container } from "@pixi/react";
import { GlobalMovableOptions } from "hooks/GlobalPixiMovable";
import { FederatedWheelEvent } from "pixi.js";
import { Sprite as PixiReactSprite } from "@pixi/react";
import { OutlineFilter } from "@pixi/filter-outline";
import { ComponentPropsWithRef } from "react";
import {
  ExplorationSceneLayer,
  clearGlobalModal,
  setGlobalSlotIndex
} from "state";
import { noOp } from "utils";
import {
  ExplorationSceneTemplate,
  ExplorationTemplateEvent,
  InteractiveSlot,
  InteractiveSlotCore,
  SlotAction
} from "utils/types";
import { handleSlotInteraction, updateLayer } from "./Pixi.SpriteHandlers";

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
  name?: string;
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
        name: slot.name,
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
  const { CLICK, DRAG_HZ, DRAG_VT } = ExplorationTemplateEvent;

  return (slot: InteractiveSlot) => {
    const { xy = [0, 0], scale = 1, anchor = 0.5, interaction } = slot;
    const { event, action = NONE, data = {} } = interaction || {};
    const hasClick = event === CLICK;
    const hasDrag = event === DRAG_HZ || event === DRAG_VT;
    const hasEvent = hasClick || hasDrag;
    const onSlotEvent = (ev: ExplorationTemplateEvent) => {
      if (ev !== event) return;
      handleSlotInteraction({ name: slot.name || "", action, data });
    };

    return {
      filters: [],
      eventMode: hasEvent ? "dynamic" : "none",
      zIndex: 10 + (slot.index || 1),
      scrollToScale: false,
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
        name: slot.name,
        xy,
        src: slot.url,
        scale,
        anchor,
        movable: hasDrag,
        resizable: false,

        // Slot got dragged: ignore coordinates in "preview" mode
        onDisplayChanged: () => onSlotEvent(DRAG_HZ),

        // Slot got clicked
        onSlotSelect: () => onSlotEvent(CLICK)
      }
    } as PixiSpriteProps;
  };
}
