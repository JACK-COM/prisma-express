import { Container } from "@pixi/react";
import { ComponentPropsWithRef } from "react";
import { ExplorationSceneLayer } from "state";
import { noOp } from "utils";
import { ExplorationSceneTemplate, InteractiveSlot } from "utils/types";

// Editor Container props (contains all layersl)
export type EditorProps = {
  x?: number;
  y?: number;
  onChange?: (d: ExplorationSceneTemplate) => void;
} & Omit<ComponentPropsWithRef<typeof Container>, "onChange">;

// Shared props for all scene layers
export type CanvasLayerProps = Omit<EditorProps, "onChange"> & {
  label?: ExplorationSceneLayer;
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

export const updateLayer = (opts: UpdateLayerOpts) => {
  const { slot, src, editing = false, onChange = noOp } = opts;
  if (!editing) return;
  const { index = 1 } = slot;
  const updates = src.map((d) => (d.index === index ? slot : d));
  onChange(updates);
};
