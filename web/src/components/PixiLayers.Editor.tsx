import { useMemo, useRef } from "react";
import {
  BlurFilter,
  SCALE_MODES,
  BaseTexture,
  TextStyle,
  Sprite
} from "pixi.js";
import { Container } from "@pixi/react";
import useGlobalExploration from "hooks/GlobalExploration";
import { createExplorationTemplateScene } from "routes/ExplorationBuilder.Helpers";
import { InteractiveSlot } from "utils/types";
import { ExplorationSceneLayer, ExplorationStoreKey } from "state";
import PixiText from "./PixiText";
import { EditorProps, CanvasLayerProps } from "./Pixi.Helpers";
import { PixiCanvasLayer } from "./PixiCanvasLayer";
import { noOp } from "utils";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

// Glow + Outline filters
const keys: ExplorationStoreKey[] = ["explorationScene", "activeLayer"];

export const PixiEditorLayers = (props: EditorProps) => {
  const { x = 0, y = 0, width = 800, height = 600, onChange = noOp } = props;
  const { explorationScene, activeLayer = "all" } = useGlobalExploration(keys);
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
  const layerProps = (label: ExplorationSceneLayer): CanvasLayerProps =>
    !scene || label === "all"
      ? { slots: [] }
      : {
          width,
          height,
          x: 0,
          y: 0,
          editing: true,
          label,
          slots: scene[label] || [],
          onChange: (d) => onLayerChanged(label, d)
        };
  const ref = useRef<Sprite>(null);
  const layerLabel = useMemo(
    () => (activeLayer === "all" ? "all layers" : activeLayer),
    [activeLayer]
  );

  return (
    <Container sortableChildren {...dimensions} anchor={0}>
      <PixiText
        ref={ref}
        text={layerLabel.toUpperCase()}
        alpha={0.2}
        anchor={{ x: 1, y: 0.5 }}
        filters={[blurFilter]}
        style={textStyle}
        x={width - 10}
        y={height / 2}
        zIndex={0}
      />

      {["background", "all"].includes(activeLayer) && (
        <PixiCanvasLayer {...layerProps("background")} />
      )}
      {["characters", "all"].includes(activeLayer) && (
        <PixiCanvasLayer {...layerProps("characters")} />
      )}
      {["foreground", "all"].includes(activeLayer) && (
        <PixiCanvasLayer {...layerProps("foreground")} />
      )}
    </Container>
  );
};

export default PixiEditorLayers;
