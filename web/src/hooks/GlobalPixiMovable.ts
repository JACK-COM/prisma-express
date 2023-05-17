import { useCallback, useMemo, useState } from "react";
import {
  DisplayObject,
  FederatedEventTarget,
  FederatedPointerEvent,
  Sprite
} from "pixi.js";
import { noOp } from "utils";

type GlobalMovableOptions = {
  x?: number;
  y?: number;
  anchor?: any; // Pixi Pointlike OR number
  scale?: any; // Pixi Pointlike OR number
  movable?: boolean;
  onDisplayChanged?: (pos: {
    xy: [x: number, y: number];
    anchor: any;
    scale: any;
  }) => void;
};

/** Global Hook for applying draggable logic to `Pixi` components */
export default function useGlobalMovable(opts: GlobalMovableOptions = {}) {
  const {
    x = 0,
    y = 0,
    anchor = 0.5,
    scale = 1.5,
    movable = false,
    onDisplayChanged = noOp
  } = opts;
  const cursor = movable ? "pointer" : "default";
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x, y, anchor, scale });
  const [dragTarget, setDragTarget] = useState<Sprite>();
  const alpha = useMemo(() => (dragging ? 0.5 : 1), [dragging]);
  const ifMovable = useCallback(
    (fn: (a: any) => void) => (movable ? (e?: any) => fn(e) : undefined),
    []
  );
  const endDrag = ifMovable((e?: FederatedPointerEvent) => {
    const newPos = updatePosition(e);
    setDragging(false);
    setDragTarget(undefined);
    onDisplayChanged({
      xy: [newPos.x, newPos.y],
      anchor: [newPos.anchor.x, newPos.anchor.y],
      scale: [newPos.scale.x, newPos.scale.y]
    });
  });
  const updatePosition = (e?: FederatedPointerEvent) => {
    if (!(dragging && dragTarget && e)) return position;
    const $parent = dragTarget.parent as DisplayObject;
    const { x: px, y: py } = e?.getLocalPosition($parent) || { x: 0, y: 0 };
    const scaleAnchor = { anchor: dragTarget.anchor, scale: dragTarget.scale };
    const updates = { x: px, y: py, ...scaleAnchor };
    setPosition(updates);
    return updates;
  };
  const handleDrag = ifMovable(updatePosition);
  const startDrag = ifMovable((e?: FederatedPointerEvent) => {
    if (!e || dragging) return;
    const { target } = e;
    setDragging(true);
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
