import { useCallback, useMemo, useState } from "react";
import { DisplayObject, FederatedPointerEvent, Sprite } from "pixi.js";
import { noOp } from "utils";
import { InteractiveSlotCore } from "utils/types";
import { GlobalExploration } from "state";

export type GlobalMovableOptions = {
  movable?: boolean;
  onDisplayChanged?: (pos: InteractiveSlotCore) => void;
  onSlotSelect?: () => void;
} & InteractiveSlotCore;

const NO_COORDS = { x: 0, y: 0 };
const DEFAULTS: GlobalMovableOptions = {
  xy: [0, 0],
  anchor: 0.5,
  scale: 1.5,
  movable: false
};

/** Global Hook for applying draggable logic to `Pixi` components */
export default function useGlobalMovable(opts = DEFAULTS) {
  const {
    xy = DEFAULTS.xy,
    anchor = DEFAULTS.anchor,
    scale = DEFAULTS.scale,
    movable = DEFAULTS.movable,
    onDisplayChanged = noOp,
    onSlotSelect = noOp
  } = opts;
  const init = { xy, anchor, scale };
  const cursor = movable ? "pointer" : "default";
  const [dragging, setDragging] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dragTarget, setDragTarget] = useState<Sprite>();
  const [position, setPosition] = useState<InteractiveSlotCore>(init);
  const alpha = useMemo(() => (dragging ? 0.5 : 1), [dragging]);
  const ifMovable = useCallback(
    (fn: (a: any) => void) => (movable ? (e?: any) => fn(e) : noOp),
    []
  );
  const endDrag = ifMovable((e?: FederatedPointerEvent) => {
    const moved = dragging;
    setClicked(false);
    setDragging(false);
    setDragTarget(undefined);
    if (moved) {
      const updates = updatePosition(e);
      onDisplayChanged(updates);
    } else onSlotSelect();
  });
  const updatePosition = (e?: FederatedPointerEvent) => {
    if (!(clicked && dragTarget && e)) return position;
    if (!dragging) setDragging(true);
    const $parent = dragTarget.parent;
    const { x: px, y: py } = e?.getLocalPosition($parent) || NO_COORDS;
    const updates: InteractiveSlotCore = {
      xy: [px, py],
      anchor: [dragTarget.anchor.x, dragTarget.anchor.y],
      scale: [dragTarget.scale.x, dragTarget.scale.y]
    };
    setPosition(updates);
    return updates;
  };
  const handleDrag = ifMovable(updatePosition);
  const startDrag = ifMovable((e?: FederatedPointerEvent) => {
    if (!e || dragging) return;
    const { target } = e;
    setClicked(true);
    setDragTarget(target as Sprite);
  });

  return {
    alpha,
    cursor,
    dragging,
    position,
    startDrag,
    handleDrag,
    endDrag
  };
}
