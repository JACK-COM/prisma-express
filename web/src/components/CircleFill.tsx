import { Graphics } from "@pixi/react";
import { ComponentPropsWithRef, useCallback } from "react";

type CircleFillProps = {
  fill?: number;
  size?: number;
} & ComponentPropsWithRef<typeof Graphics>;

/** Clickable rectangle fill */
export default function CircleFill(props: CircleFillProps) {
  const { x = 0, y = 0, fill = 0xffffff, size = 16, ...nativeProps } = props;
  const draw = useCallback(
    (g: any) => {
      g.clear();
      g.lineStyle(4, 0xffffff);
      g.beginFill(fill, 1);
      g.drawCircle(x, y, size / 2);
      g.endFill();
    },
    [props]
  );

  return <Graphics draw={draw} cursor="pointer" zIndex={1} {...nativeProps} />;
}
