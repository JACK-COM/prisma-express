import { Ref, forwardRef } from "react";
import { Container, Sprite } from "@pixi/react";
import useGlobalMovable from "hooks/GlobalPixiMovable";
import { PixiSpriteProps } from "./Pixi.Helpers";

/** @CanvasComponent Pixi Sprite (wrapped) with dragging and scroll-to-scale functionality */
const PixiSprite = forwardRef((props: PixiSpriteProps, ref: Ref<any>) => {
  const { containerProps = {}, x = 0, y = 0, ...pixiProps } = props;
  const { scale, src = "https://pixijs.io/pixi-react/img/bunny.png" } =
    containerProps;
  const opts = useGlobalMovable({
    ...containerProps,
    xy: containerProps.xy || [x, y],
    scale,
    anchor: props.anchor || [0.5, 0.5]
  });
  const { position, startDrag, handleDrag, handleScroll, endDrag } = opts;
  const { xy = [0, 0] } = position;

  return (
    <Container>
      <Sprite
        ref={ref}
        image={src}
        cursor={opts.cursor}
        alpha={opts.alpha}
        eventMode="dynamic"
        pointerdown={startDrag}
        onglobalpointermove={handleDrag}
        onwheel={handleScroll}
        pointerup={endDrag}
        pointerupoutside={endDrag}
        x={xy[0]}
        y={xy[1]}
        anchor={position.anchor}
        scale={position.scale}
        {...pixiProps}
      />
    </Container>
  );
});

export default PixiSprite;
