import {
  ComponentPropsWithRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import styled from "styled-components";
import { SCALE_MODES, BaseTexture } from "pixi.js";
import { Stage, useTick } from "@pixi/react";
import PixiEditorLayers from "./PixiLayers.Editor";
import PixiCanvasToolbar from "./PixiCanvasToolbar";

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
} & ComponentPropsWithRef<typeof Stage>;

/** @component PixiCanvas (create/manage Pixi component layers) */
export const PixiCanvas = (props: CanvasProps) => {
  const { editing, width = 0, height = 0 } = props;
  const [size, setSize] = useState({ width, height });

  useEffect(() => {
    const $elem = document.querySelector("#builder-canvas");
    if (!$elem) return;
    const { width: cw, height: ch } = $elem.getBoundingClientRect();
    setSize({ width: cw - 2, height: ch });
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
            <PixiEditorLayers />
          </Stage>

          {editing && <PixiCanvasToolbar floating />}
        </>
      ) : (
        <p>Loading Canvas...</p>
      )}
    </Canvas>
  );
};
