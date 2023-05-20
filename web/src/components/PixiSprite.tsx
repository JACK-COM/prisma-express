import { Ref, forwardRef } from "react";
import { Container, Sprite } from "@pixi/react";
import useGlobalMovable from "hooks/GlobalPixiMovable";
import { PixiSpriteProps, layerColors } from "./Pixi.Helpers";
import CircleFill from "./CircleFill";
import { GlobalExploration } from "state";
import { EventMode, TextStyle } from "pixi.js";
import PixiText from "./PixiText";

/** @CanvasComponent Pixi Sprite (wrapped) with dragging and scroll-to-scale functionality */
const PixiSprite = forwardRef((props: PixiSpriteProps, ref: Ref<any>) => {
  const { activeLayer = "all" } = GlobalExploration.getState();
  const fill = layerColors[activeLayer];
  const { containerProps = {}, x = 0, y = 0, editing, ...spriteProps } = props;
  const { scale: pScale, src = "https://pixijs.io/pixi-react/img/bunny.png" } =
    containerProps;
  const {
    position,
    startDrag,
    handleDrag,
    handleScroll,
    endDrag,
    ...fromMovable
  } = useGlobalMovable({
    ...containerProps,
    xy: containerProps.xy || [x, y],
    scale: pScale,
    anchor: props.anchor || [0.5, 0.5]
  });
  const { xy = [0, 0], ...fromPosition } = position;
  const movableProps = {
    ...fromMovable, // alpha, cursor,
    ...fromPosition, // anchor, scale,
    eventMode: "dynamic" as EventMode,
    x: xy[0],
    y: xy[1],
    pointerdown: startDrag,
    onglobalpointermove: handleDrag,
    onwheel: handleScroll,
    pointerup: endDrag,
    pointerupoutside: endDrag
  };
  const textStyle = new TextStyle({
    fill,
    fontSize: 22,
    strokeThickness: 2,
    stroke: "white"
  });

  return src ? (
    <Container>
      <Sprite ref={ref} image={src} {...movableProps} {...spriteProps} />
      {editing && (
        <CircleFill eventMode="none" x={xy[0]} y={xy[1]} fill={fill} />
      )}
    </Container>
  ) : (
    <PixiText
      ref={ref}
      text={containerProps.name || "EMPTY SLOT"}
      style={textStyle}
      x={xy[0]}
      y={xy[1]}
      scale={movableProps.scale}
      containerProps={containerProps}
      // {...spriteProps}
    />
  );
});

export default PixiSprite;
