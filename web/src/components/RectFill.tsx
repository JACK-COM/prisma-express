import { Container, Graphics } from "@pixi/react";
import { EditorProps } from "./Pixi.Helpers";
import { noOp } from "utils";
import { useCallback } from "react";

/** Clickable rectangle fill */
export function RectFill(props: RectFillProps) {
  const {
    x = 0,
    y = 0,
    fill = 0xff00bb,
    width,
    height,
    pointerdown = noOp
  } = props;
  const draw = useCallback(
    (g: any) => {
      g.clear();
      g.beginFill(fill, 0.25);
      g.drawRect(x, y, width, height);
      g.endFill();
    },
    [props]
  );
  const onClick: React.MouseEventHandler<typeof Container> = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
      pointerdown(e);
    }
  };

  return (
    <Graphics draw={draw} eventMode="dynamic" pointerup={onClick} zIndex={1} />
  );
}
type RectFillProps = EditorProps & {
  pointerdown?: React.MouseEventHandler<typeof Container>;
  fill?: number;
};
