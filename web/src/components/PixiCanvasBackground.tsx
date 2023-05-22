import { useMemo } from "react";
import { SCALE_MODES, BaseTexture, BlurFilter, TextStyle } from "pixi.js";
import { Container } from "@pixi/react";
import { ExplorationSceneLayer, setGlobalLayer } from "state";
import { layerColors } from "./Pixi.SceneProps";
import { RectFill } from "./RectFill";
import { noOp } from "utils";
import PixiText from "./PixiText";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

type Props = {
  activeLayer?: ExplorationSceneLayer;
  editing?: boolean;
  height: number;
  width: number;
  onBGClick?: () => void;
};

/** @component PixiCanvas (create/manage Pixi component layers) */
const PixiCanvasBackground = (props: Props) => {
  const {
    editing = false,
    width = 0,
    height = 0,
    activeLayer = "all",
    onBGClick = noOp
  } = props;
  const size = { width, height };
  const fillBG = useMemo(() => layerColors[activeLayer], [activeLayer]);
  const blurFilter = new BlurFilter(4);
  const textStyle = new TextStyle({ fill: "white", fontSize: 48 });
  
  return (
    <Container x={0} y={0} {...size} anchor={0}>
      <RectFill pointerdown={onBGClick} fill={fillBG} x={0} y={0} {...size} />

      {activeLayer !== "all" && editing && (
        <PixiText
          text={activeLayer.toUpperCase()}
          alpha={0.2}
          anchor={{ x: 1, y: 0.5 }}
          filters={[blurFilter]}
          style={textStyle}
          x={width - 10}
          y={height / 2}
          zIndex={0}
        />
      )}
    </Container>
  );
};

export default PixiCanvasBackground;
