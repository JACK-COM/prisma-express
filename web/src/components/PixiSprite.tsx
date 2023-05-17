import { ComponentPropsWithRef, Ref, forwardRef } from "react";
import { Sprite } from "@pixi/react";
import useGlobalMovable from "hooks/GlobalPixiMovable";

type PixiSpriteProps = {
  containerProps: {
    movable?: boolean;
    x?: number;
    y?: number;
    src?: string;
    anchor?: { x: number; y: number };
    scale?: number;
    onDisplayChanged?: (a: { x: number; y: number }) => void;
  };
} & ComponentPropsWithRef<typeof Sprite>;

/** @CanvasComponent Pixi Sprite (wrapped) with dragging functionality */
const PixiSprite = forwardRef((props: PixiSpriteProps, ref: Ref<any>) => {
  const { containerProps = {}, x, y, scale, ...pixiProps } = props;
  const { src = "https://pixijs.io/pixi-react/img/bunny.png" } = containerProps;
  const { alpha, cursor, position, startDrag, handleDrag, endDrag } =
    useGlobalMovable({ ...containerProps, x, y, scale });

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
      {...position}
      {...pixiProps}
    />
  );
});

export default PixiSprite;
