import { useMemo } from "react";
import { SCALE_MODES, BaseTexture } from "pixi.js";
import { Container } from "@pixi/react";
import { ExplorationSceneLayer, setGlobalLayer } from "state";
import { layerColors } from "./Pixi.Helpers";
import { RectFill } from "./RectFill";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

type Props = {
  activeLayer?: ExplorationSceneLayer;
  editing?: boolean;
  height: number;
  width: number;
};

/** @component PixiCanvas (create/manage Pixi component layers) */
export const PixiCanvasBackground = (props: Props) => {
  const { editing, width = 0, height = 0, activeLayer = "all" } = props;
  const size = { width, height };
  const onBGClick = () => editing && setGlobalLayer("all");
  const fillBG = useMemo(() => layerColors[activeLayer], [activeLayer]);

  return (
    <Container x={0} y={0} {...size} anchor={0}>
      <RectFill pointerdown={onBGClick} fill={fillBG} x={0} y={0} {...size} />
    </Container>
  );
};
