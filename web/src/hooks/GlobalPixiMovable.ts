import { useCallback, useMemo, useState } from "react";
import { FederatedPointerEvent, FederatedWheelEvent, Sprite } from "pixi.js";
import { noOp } from "utils";
import { InteractiveSlotCore } from "utils/types";

export type GlobalMovableOptions = {
  movable?: boolean;
  resizable?: boolean;
  onDisplayChanged?: (pos: InteractiveSlotCore) => void;
  onSlotSelect?: () => void;
} & InteractiveSlotCore;

const round = (n: number) => Math.round(n * 10) / 10;
const NO_COORDS = { x: 0, y: 0 };
const DEFAULTS: GlobalMovableOptions = {
  xy: [0, 0],
  anchor: 0.5,
  scale: 1.5,
  movable: false,
  resizable: false
};

/** Global Hook for applying draggable logic to `Pixi` components */
export default function useGlobalMovable(opts = DEFAULTS) {
  const {
    xy = DEFAULTS.xy,
    anchor = DEFAULTS.anchor,
    scale = DEFAULTS.scale,
    movable = DEFAULTS.movable,
    resizable = DEFAULTS.resizable,
    onDisplayChanged = noOp,
    onSlotSelect = noOp
  } = opts;
  const init = { xy, anchor, scale };
  const cursor = "pointer";
  const [dragging, setDragging] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dragTarget, setDragTarget] = useState<Sprite>();
  const [position, setPosition] = useState<InteractiveSlotCore>(init);
  const alpha = useMemo(() => (dragging ? 0.5 : 1), [dragging]);
  /** Returns no-op function when `movable` is false */
  const ifMovable = useCallback(
    (fn: (a: any) => void) => (movable ? (e?: any) => fn(e) : noOp),
    [opts.movable]
  );
  /** Returns no-op function when `resizable` is false */
  const ifResizable = useCallback(
    (fn: (a: any) => void) => (resizable ? (e?: any) => fn(e) : noOp),
    [opts.resizable]
  );
  /** Update sprite position */
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
  /** End-drag action */
  const endDrag = ifMovable((e?: FederatedPointerEvent) => {
    const moved = dragging;
    setClicked(false);
    setDragging(false);
    setDragTarget(undefined);
    if (moved) onDisplayChanged(updatePosition(e));
    else {
      setPosition(init); // reset position and notify parent
      onSlotSelect();
    }
  });
  const handleDrag = ifMovable(updatePosition);
  const startDrag = (e?: FederatedPointerEvent) => {
    if (!movable || !e || dragging) return onSlotSelect();
    const { target } = e;
    e.stopImmediatePropagation();
    setClicked(true);
    setDragTarget(target as Sprite);
  };
  /** Resize on scroll-wheel */
  const handleScroll = ifResizable((e?: FederatedWheelEvent) => {
    if (!e) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const scale = position.scale as [number, number];
    const increment = e.deltaY > 0 ? 0.1 : -0.1; // scale up or down
    const scaleX = round(Math.max(0.5, scale[0] + increment));
    const scaleY = round(Math.max(0.5, scale[1] + increment));
    const next: InteractiveSlotCore = { ...position, scale: [scaleX, scaleY] };
    setPosition(next);
    onDisplayChanged(next);
  });

  return {
    alpha,
    cursor,
    dragging,
    position,
    startDrag,
    handleDrag,
    handleScroll,
    endDrag
  };
}
