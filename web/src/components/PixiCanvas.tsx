import { ComponentPropsWithRef, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SCALE_MODES, BaseTexture } from "pixi.js";
import { Container, Stage } from "@pixi/react";
import PixiEditorLayers from "./PixiLayers.Editor";
import PixiCanvasToolbar from "./PixiCanvasToolbar";
import { setGlobalLayer } from "state";
import { ExplorationSceneTemplate } from "utils/types";
import { noOp } from "utils";
import { RectFill, layerColors } from "./PixiCanvasLayer";
import useGlobalExploration from "hooks/GlobalExploration";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

const Canvas = styled.div`
  background: #000;
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  display: grid;
  height: 86vmin;
  width: 100%;
  @media screen and (max-width: 768px) and (orientation: landscape) {
    height: 85vmax;
  }
`;
type CanvasProps = {
  editing?: boolean;
  onChange?: (scene: ExplorationSceneTemplate) => void;
} & Omit<ComponentPropsWithRef<typeof Stage>, "onChange">;

/** @component PixiCanvas (create/manage Pixi component layers) */
export const PixiCanvas = (props: CanvasProps) => {
  const { editing, width = 0, height = 0, onChange = noOp } = props;
  const { activeLayer } = useGlobalExploration(["activeLayer"]);
  const [size, setSize] = useState({ width, height });
  const onBGClick = () => setGlobalLayer("all");
  const fillBG = useMemo(
    () => activeLayer && layerColors[activeLayer],
    [activeLayer]
  );

  useEffect(() => {
    const $elem = document.querySelector("#builder-canvas");
    if (!$elem) return;
    const $parent = $elem.parentElement || $elem;
    const { width: cw, height: ch } = $parent.getBoundingClientRect();
    // -2 for border, -50 for toolbar
    setSize({ width: cw - 2, height: ch - 50 });
  }, []);

  return (
    <Canvas id="builder-canvas">
      {size.width > 0 ? (
        <>
          <Stage
            width={size.width}
            height={size.height}
            options={{
              antialias: true,
              eventMode: "dynamic",
              eventFeatures: { move: true, click: true, wheel: true },
              ...size
            }}
          >
            {activeLayer && (
              <Container x={0} y={0} {...size} anchor={0}>
                <RectFill
                  pointerdown={onBGClick}
                  fill={fillBG}
                  x={0}
                  y={0}
                  {...size}
                />
              </Container>
            )}
            <PixiEditorLayers {...size} onChange={onChange} />
          </Stage>

          {editing && <PixiCanvasToolbar floating />}
        </>
      ) : (
        <p>Loading Canvas...</p>
      )}
    </Canvas>
  );
};
