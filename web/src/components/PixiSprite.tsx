import { Ref, forwardRef } from "react";
import { Container, Sprite } from "@pixi/react";
import useGlobalMovable from "hooks/GlobalPixiMovable";
import { PixiSpriteProps, layerColors } from "./Pixi.SceneProps";
import CircleFill from "./CircleFill";
import { GlobalExploration } from "state";
import { EventMode, TextStyle } from "pixi.js";
import PixiText from "./PixiText";
import { RectFill } from "./RectFill";

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
  const pos = { x: xy[0], y: xy[1] };

  return (
    <Container>
      {src ? (
        <>
          <Sprite ref={ref} image={src} {...movableProps} {...spriteProps} />
          {editing && <CircleFill eventMode="none" {...pos} fill={fill} />}
        </>
      ) : (
        <>
          {editing ? (
            <PixiText
              ref={ref}
              text={containerProps.name || "EMPTY SLOT"}
              style={textStyle}
              {...pos}
              scale={movableProps.scale}
              containerProps={containerProps}
            />
          ) : (
            <RectFill
              fill={0x000000}
              width={120}
              height={120}
              {...{
                ...movableProps,
                alpha: 0.1,
                pointerdown: (e: any) => movableProps.pointerdown(e),
                x: pos.x - 80,
                y: pos.y - 80
              }}
            />
          )}
        </>
      )}
    </Container>
  );
});

export default PixiSprite;
