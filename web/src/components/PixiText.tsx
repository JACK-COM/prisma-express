import { ComponentPropsWithRef, Ref, forwardRef } from "react";
import { Text } from "@pixi/react";
import useGlobalMovable from "hooks/GlobalPixiMovable";

type ContainerOpts = {
  containerProps?: {
    /** Allow container to be dragged `true` */
    movable?: boolean;
    /** Handler for updates after position change */
    onDisplayChanged?: (a: { x: number; y: number }) => void;
  };
};
type PixiTextProps = ContainerOpts & ComponentPropsWithRef<typeof Text>;

/** @CanvasComponent Pixi Text (wrapped) with dragging functionality */
const PixiText = forwardRef((props: PixiTextProps, ref: Ref<any>) => {
  const { containerProps = {}, x, y, scale, ...pixiTextProps } = props;
  const { alpha, cursor, position, startDrag, handleDrag, endDrag } =
    useGlobalMovable({ ...containerProps, x, y, scale });

  return (
    <Text
      ref={ref}
      cursor={cursor}
      alpha={alpha}
      eventMode="static"
      pointerdown={startDrag}
      onglobalpointermove={handleDrag}
      pointerup={endDrag}
      pointerupoutside={endDrag}
      {...position}
      {...pixiTextProps}
    />
  );
});

export default PixiText;
