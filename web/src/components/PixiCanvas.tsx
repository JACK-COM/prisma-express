import { ComponentPropsWithRef, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SCALE_MODES, BaseTexture } from "pixi.js";
import { Container, Stage } from "@pixi/react";
import PixiEditorLayers from "./PixiLayers.Editor";
import PixiCanvasToolbar from "./PixiCanvasToolbar";
import { ExplorationStoreKey, setGlobalSlotIndex } from "state";
import { ExplorationSceneTemplate } from "utils/types";
import { noOp } from "utils";
import { RectFill, layerColors } from "./PixiCanvasLayer";
import useGlobalExploration from "hooks/GlobalExploration";
import { PixiCanvasBackground } from "./PixiCanvasBackground";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

const Canvas = styled.div`
  background: #000;
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  display: grid;
  height: 80vmin;
  width: 100%;
  @media screen and (max-width: 768px) and (orientation: landscape) {
    height: 85vmax;
  }
`;
type CanvasProps = {
  editing?: boolean;
  onChange?: (scene: ExplorationSceneTemplate) => void;
} & Omit<ComponentPropsWithRef<typeof Stage>, "onChange">;

const xkeys: ExplorationStoreKey[] = ["explorationScene", "activeLayer"];

/** @component PixiCanvas (create/manage Pixi component layers) */
export const PixiCanvas = (props: CanvasProps) => {
  const { editing, width = 0, height = 0, onChange = noOp } = props;
  const { activeLayer, explorationScene } = useGlobalExploration(xkeys);
  const [size, setSize] = useState({ width, height });
  const onBGClick = () => setGlobalSlotIndex(-1, activeLayer);
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
    setSize({ width: cw - 2, height: ch - 60 });
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
            <PixiCanvasBackground
              {...size}
              activeLayer={activeLayer}
              editing={editing}
            />
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
            <PixiEditorLayers
              {...size}
              layer={activeLayer}
              scene={explorationScene}
              onChange={onChange}
            />
          </Stage>

          {editing && <PixiCanvasToolbar floating />}
        </>
      ) : (
        <p>Loading Canvas...</p>
      )}
    </Canvas>
  );
};
