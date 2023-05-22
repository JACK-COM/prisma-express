import { Container } from "@pixi/react";
import PixiSprite from "./PixiSprite";
import { InteractiveSlot } from "utils/types";
import {
  CanvasLayerProps,
  editableSpriteProps,
  layerFilters,
  layerColors,
  previewSpriteProps
} from "./Pixi.SceneProps";
import {
  ExplorationSceneLayer,
  GlobalExploration,
  setGlobalLayer
} from "state";
import { noOp } from "utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextStyle } from "pixi.js";
import PixiText from "./PixiText";

/** @PixiComponent Canvas group of sprites + interactions  */
export function PixiCanvasLayer(props: CanvasLayerProps) {
  const { activeLayer = "all" } = GlobalExploration.getState();
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
  const spriteFilter = editing ? layerFilters[layer] : [];
  const layers = Object.keys(layerColors) as ExplorationSceneLayer[];
  const [data, setData] = useState<InteractiveSlot[]>(slots);
  // intercept local changes for re-rendering
  const localOnChange = (d: InteractiveSlot[]) => {
    setData(d);
    onChange(d);
  };
  const spInput = { ...props, onChange: localOnChange };
  const spriteProps = useCallback(
    editing ? editableSpriteProps(spInput) : previewSpriteProps(spInput),
    [data]
  );
  const layerIndex = layers.indexOf(layer);
  const onBunnySelect = () => editing && setGlobalLayer(layer || "all");
  const textStyle = new TextStyle({ fill: "white", fontSize: 32 });

  // Update local data on global change
  useEffect(() => {
    setData(slots);
  }, [slots]);

  return (
    <Container sortableChildren {...dimensions}>
      {!data.length && editing && (
        // Bunny sprite for empty layers
        <PixiSprite
          scale={1 + layerIndex * 0.1}
          x={width / 2 + layerIndex * -50}
          y={height / 2}
          filters={spriteFilter}
          zIndex={100}
          containerProps={{
            movable: editing,
            onSlotSelect: onBunnySelect
          }}
        />
      )}
      {data.map((d, i) => (
        <PixiSprite
          key={`${d.name || "bg-sprite"}-${i}`}
          filters={spriteFilter}
          editing={editing && activeLayer === layer}
          {...spriteProps(d)}
        />
      ))}
    </Container>
  );
}
