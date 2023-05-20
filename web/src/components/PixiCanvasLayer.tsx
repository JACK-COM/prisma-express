import { Container, Graphics } from "@pixi/react";
import PixiSprite from "./PixiSprite";
import { InteractiveSlot } from "utils/types";
import {
  EditorProps,
  CanvasLayerProps,
  editableSpriteProps
} from "./Pixi.Helpers";
import { OutlineFilter } from "@pixi/filter-outline";
import { ExplorationSceneLayer, setGlobalLayer } from "state";
import { noOp } from "utils";
import { useCallback, useEffect, useMemo, useState } from "react";

export const layerColors: Record<ExplorationSceneLayer, number> = {
  all: 0, // this should NEVER render its own layer
  background: 0x3d85f1,
  characters: 0xe678cc,
  foreground: 0x2eb72e
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
    onChange = noOp,
    layer: layer = "all"
  } = props;
  const dimensions = useMemo(() => ({ x, y, width, height }), [props]);
  const spriteFilter = editing ? filters[layer] : undefined;
  const layers = Object.keys(layerColors) as ExplorationSceneLayer[];
  const [data, setData] = useState<InteractiveSlot[]>(slots);
  // intercept local changes for re-rendering
  const localOnChange = (d: InteractiveSlot[]) => {
    setData(d);
    onChange(d);
  };
  const spriteProps = useCallback(
    editableSpriteProps({ ...props, onChange: localOnChange }),
    [data]
  );
  const layerIndex = layers.indexOf(layer);

  // Update local data on global change
  useEffect(() => {
    setData(slots);
  }, [slots]);

  return (
    <Container sortableChildren {...dimensions}>
      {!data.length ? (
        // Bunny sprite for empty layers
        <PixiSprite
          scale={1 + layerIndex * 0.1}
          x={width / 2 + layerIndex * 50}
          y={height / 2}
          filters={spriteFilter}
          zIndex={100}
          containerProps={{
            movable: true,
            onSlotSelect: () => setGlobalLayer(layer || "all")
          }}
        />
      ) : (
        data.map((d, i) => (
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
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
      pointerdown(e);
    }
  };

  return (
    <Graphics draw={draw} eventMode="dynamic" pointerup={onClick} zIndex={1} />
  );
}
