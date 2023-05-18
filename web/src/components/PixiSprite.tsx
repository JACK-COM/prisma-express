import { ComponentPropsWithRef, Ref, forwardRef } from "react";
import { Sprite } from "@pixi/react";
import useGlobalMovable, {
  GlobalMovableOptions
} from "hooks/GlobalPixiMovable";

export type PixiSpriteProps = {
  containerProps: GlobalMovableOptions & { src?: string };
} & ComponentPropsWithRef<typeof Sprite>;

/** @CanvasComponent Pixi Sprite (wrapped) with dragging functionality */
const PixiSprite = forwardRef((props: PixiSpriteProps, ref: Ref<any>) => {
  const { containerProps = {}, x = 0, y = 0, scale, ...pixiProps } = props;
  const { src = "https://pixijs.io/pixi-react/img/bunny.png" } = containerProps;
  const { alpha, cursor, position, startDrag, handleDrag, endDrag } =
    useGlobalMovable({
      ...containerProps,
      xy: containerProps.xy || [x, y],
      scale,
      anchor: containerProps.anchor
    });
  const { xy = [0, 0], ...anchorScale } = position;

  return (
    <Sprite
      ref={ref}
      image={src}
      cursor={cursor}
      alpha={alpha}
      eventMode="static"
      pointerdown={startDrag}
      onglobalpointermove={handleDrag}
      pointerup={endDrag}
      pointerupoutside={endDrag}
      x={xy[0]}
      y={xy[1]}
      {...anchorScale}
      {...pixiProps}
    />
  );
});

export default PixiSprite;
