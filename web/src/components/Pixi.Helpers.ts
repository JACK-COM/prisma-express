import { Container } from "@pixi/react";
import { GlobalMovableOptions } from "hooks/GlobalPixiMovable";
import { FederatedWheelEvent } from "pixi.js";
import { Sprite as PixiReactSprite } from "@pixi/react";
import { ComponentPropsWithRef } from "react";
import {
  ExplorationSceneLayer,
  clearGlobalModal,
  setGlobalSlotIndex
} from "state";
import { noOp } from "utils";
import {
  ExplorationSceneTemplate,
  InteractiveSlot,
  InteractiveSlotCore
} from "utils/types";

export type PixiSpriteProps = {
  containerProps: GlobalMovableOptions & {
    src?: string;
    onDisplayScrolled?: (e: FederatedWheelEvent) => void;
  };
} & ComponentPropsWithRef<typeof PixiReactSprite>;

// Editor Container props (contains all layersl)
export type EditorProps = {
  x?: number;
  y?: number;
  scene?: ExplorationSceneTemplate | null;
  layer?: ExplorationSceneLayer;
  onChange?: (d: ExplorationSceneTemplate) => void;
} & Omit<ComponentPropsWithRef<typeof Container>, "onChange">;

// Shared props for all scene layers
export type CanvasLayerProps = Omit<EditorProps, "onChange" | "scene"> & {
  editing?: boolean;
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

const round = (n: number) => Math.round(n * 10) / 10;

/** Convert Scene Template data into editable Sprite props */
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
