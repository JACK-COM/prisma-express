import { ComponentPropsWithRef, Ref, forwardRef } from "react";
import { Text } from "@pixi/react";
import useGlobalMovable, {
  GlobalMovableOptions
} from "hooks/GlobalPixiMovable";

type ContainerOpts = {
  containerProps?: Pick<GlobalMovableOptions, "movable" | "onDisplayChanged">;
};
type PixiTextProps = ContainerOpts & ComponentPropsWithRef<typeof Text>;

/** @CanvasComponent Pixi Text (wrapped) with dragging functionality */
const PixiText = forwardRef((props: PixiTextProps, ref: Ref<any>) => {
  const { containerProps = {}, x = 0, y = 0, scale, ...pixiTextProps } = props;
  const { alpha, cursor, position, startDrag, handleDrag, endDrag } =
    useGlobalMovable({ ...containerProps, xy: [x, y], scale });
  const { xy = [0, 0], ...anchorScale } = position;

  return (
    <Text
      ref={ref}
      cursor={cursor}
      alpha={alpha}
      eventMode="static"
      pointerdown={startDrag || undefined}
      onglobalpointermove={handleDrag || undefined}
      pointerup={endDrag || undefined}
      pointerupoutside={endDrag || undefined}
      {...anchorScale}
      {...pixiTextProps}
      x={xy[0]}
      y={xy[1]}
      scale={1}
    />
  );
});

export default PixiText;
