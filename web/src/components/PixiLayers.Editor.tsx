import { useMemo, useRef } from "react";
import {
  BlurFilter,
  SCALE_MODES,
  BaseTexture,
  TextStyle,
  Sprite
} from "pixi.js";
import { Container } from "@pixi/react";
import { createExplorationTemplateScene } from "routes/ExplorationBuilder.Helpers";
import { InteractiveSlot } from "utils/types";
import { ExplorationSceneLayer } from "state";
import PixiText from "./PixiText";
import { EditorProps, CanvasLayerProps } from "./Pixi.Helpers";
import { PixiCanvasLayer } from "./PixiCanvasLayer";
import { noOp } from "utils";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

export const PixiEditorLayers = (props: EditorProps) => {
  const {
    layer = "all",
    scene: explorationScene,
    x = 0,
    y = 0,
    width = 800,
    height = 600,
    editing = false,
    onChange = noOp
  } = props;
  const scene = explorationScene || createExplorationTemplateScene();
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const textStyle = new TextStyle({ fill: "white", fontSize: 48 });
  const dimensions = { x, y, width, height };
  const onLayerChanged = (
    label: ExplorationSceneLayer,
    slots: InteractiveSlot[]
  ) => {
    if (label === "all") return;
    const update = { ...scene, [label]: slots };
    onChange(update);
  };
  const layersShared = { width, height, editing };
  const layerProps = (target: ExplorationSceneLayer): CanvasLayerProps =>
    !scene || target === "all"
      ? { slots: [] }
      : {
          ...layersShared,
          layer: target,
          slots: scene[target] || [],
          onChange: (d) => onLayerChanged(target, d)
        };
  const ref = useRef<Sprite>(null);
  const label = useMemo(() => (layer === "all" ? "" : layer), [layer]);

  return (
    <Container sortableChildren {...dimensions} anchor={0}>
      {label && (
        <PixiText
          ref={ref}
          text={label.toUpperCase()}
          alpha={0.2}
          anchor={{ x: 1, y: 0.5 }}
          filters={[blurFilter]}
          style={textStyle}
          x={width - 10}
          y={height / 2}
          zIndex={0}
        />
      )}

      {["background", "all"].includes(layer) && (
        <PixiCanvasLayer {...layerProps("background")} />
      )}
      {["characters", "all"].includes(layer) && (
        <PixiCanvasLayer {...layerProps("characters")} />
      )}
      {["foreground", "all"].includes(layer) && (
        <PixiCanvasLayer {...layerProps("foreground")} />
      )}
    </Container>
  );
};

export default PixiEditorLayers;
