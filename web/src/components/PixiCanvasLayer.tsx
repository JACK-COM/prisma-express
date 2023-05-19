import { Container, Graphics } from "@pixi/react";
import PixiSprite, { PixiSpriteProps } from "./PixiSprite";
import { InteractiveSlot } from "utils/types";
import { EditorProps, CanvasLayerProps, updateLayer } from "./Pixi.Helpers";
import { OutlineFilter } from "@pixi/filter-outline";
import {
  ExplorationSceneLayer,
  setGlobalLayer,
  setGlobalSlotIndex
} from "state";
import { noOp } from "utils";
import { useCallback, useMemo } from "react";

export const layerColors: Record<ExplorationSceneLayer, number> = {
  background: 0x3d85f1,
  characters: 0x902477,
  foreground: 0x2eb72e,
  all: 0 // this should NEVER render its own layer
};
const filters: Record<ExplorationSceneLayer, [OutlineFilter] | undefined> = {
  all: undefined,
  background: [new OutlineFilter(2, layerColors.background, 1)],
  characters: [new OutlineFilter(2, layerColors.characters, 1)],
  foreground: [new OutlineFilter(2, layerColors.foreground, 1)]
};

/** @PixiComponent Canvas group of sprites + interactions  */
export function PixiCanvasLayer(props: CanvasLayerProps) {
  const {
    x = 0,
    y = 0,
    width = 800,
    height = 600,
    slots = [],
    editing,
    label = "all"
  } = props;
  const dimensions = useMemo(() => ({ x, y, width, height }), [props]);
  const spriteFilter = editing ? filters[label] : undefined;
  const spriteProps = generateSpriteProps(props);

  return (
    <Container sortableChildren {...dimensions}>
      {!slots.length ? (
        <PixiSprite
          scale={1}
          y={width / 2}
          x={height / 2}
          filters={spriteFilter}
          zIndex={100}
          containerProps={{
            movable: true,
            onSlotSelect: () => setGlobalLayer(label || "all")
          }}
        />
      ) : (
        slots.map((d, i) => (
          <PixiSprite
            key={`${d.name || "bg-sprite"}-${i}`}
            filters={spriteFilter}
            {...spriteProps(d)}
          />
        ))
      )}
    </Container>
  );
}

/** Convert Scene Template data into Sprite props */
function generateSpriteProps(props: CanvasLayerProps) {
  const { editing = false, onChange = noOp, label = "all", slots } = props;
  return (slot: InteractiveSlot) => {
    const { xy = [0, 0], scale = 1, anchor = 0.5 } = slot;
    return {
      zIndex: 10 + (slot.index || 1),
      containerProps: {
        xy,
        src: slot.url,
        scale,
        anchor,
        movable: props.editing,
        // Slot got dragged/moved
        onDisplayChanged: (p) => {
          const newSlot = Object.assign({}, slot, p);
          return updateLayer({ slot: newSlot, editing, onChange, src: slots });
        },
        // Slot got clicked
        onSlotSelect: () => setGlobalSlotIndex((slot.index || 1) - 1, label)
      }
    } as PixiSpriteProps;
  };
}

type RectFillProps = EditorProps & {
  pointerdown?: React.MouseEventHandler<typeof Container>;
  fill?: number;
};
/** Clickable rectangle fill */
export function RectFill(props: RectFillProps) {
  const {
    x = 0,
    y = 0,
    fill = 0xff00bb,
    width,
    height,
    pointerdown = noOp
  } = props;
  const draw = useCallback(
    (g: any) => {
      g.clear();
      g.beginFill(fill, 0.25);
      g.drawRect(x, y, width, height);
      g.endFill();
    },
    [props]
  );
  const onClick: React.MouseEventHandler<typeof Container> = (e) => {
    if (e.target === e.currentTarget) pointerdown(e);
  };

  return (
    <Graphics
      draw={draw}
      eventMode="dynamic"
      pointerdown={onClick}
      zIndex={1}
    />
  );
}
