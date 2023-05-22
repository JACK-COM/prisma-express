import { Container, Graphics } from "@pixi/react";
import { EditorProps } from "./Pixi.SceneProps";
import { noOp } from "utils";
import { ComponentPropsWithRef, useCallback } from "react";

/** Clickable rectangle fill */
export function RectFill(props: RectFillProps) {
  const {
    x = 0,
    y = 0,
    alpha = 0.25,
    fill = 0xff00bb,
    width,
    height,
    ...rest
  } = props;
  const draw = useCallback(
    (g: any) => {
      g.clear();
      g.beginFill(fill, alpha);
      g.drawRect(x, y, width, height);
      g.endFill();
    },
    [props]
  );

  return <Graphics draw={draw} eventMode="dynamic" zIndex={1} {...rest} />;
}
type RectFillProps = EditorProps & {
  fill?: number;
} & ComponentPropsWithRef<typeof Graphics>;
