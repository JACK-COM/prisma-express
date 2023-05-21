import {
  ComponentPropsWithRef,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState
} from "react";
import styled from "styled-components";
import { SCALE_MODES, BaseTexture } from "pixi.js";
import { Container, Stage } from "@pixi/react";
import { ExplorationStoreKey, setGlobalSlotIndex } from "state";
import { ExplorationSceneTemplate } from "utils/types";
import { noOp } from "utils";
import useGlobalExploration from "hooks/GlobalExploration";
import { layerColors } from "./Pixi.Helpers";
import { RectFill } from "./RectFill";
import FullScreenLoader from "./Common/FullscreenLoader";
import PixiEditorLayers from "./PixiLayers.Editor";
import PixiSceneIntro from "./PixiSceneIntro";
import PixiCanvasBackground from "./PixiCanvasBackground";

const PixiCanvasDialog = lazy(() => import("./PixiCanvasDialog"));
const PixiCanvasToolbar = lazy(() => import("./PixiCanvasToolbar"));

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

const Canvas = styled.div.attrs({ id: "builder-canvas" })`
  background: #000;
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  display: grid;
  height: 80vmin;
  place-content: center;
  width: 100%;
  @media screen and (max-width: 768px) and (orientation: landscape) {
    height: 85vmax;
  }
`;
type CanvasProps = {
  editing?: boolean;
  onChange?: (scene: ExplorationSceneTemplate) => void;
} & Omit<ComponentPropsWithRef<typeof Stage>, "onChange">;

const xkeys: ExplorationStoreKey[] = [
  "explorationScene",
  "activeLayer",
  "sceneData"
];

/** @component PixiCanvas (create/manage Pixi component layers) */
export const PixiCanvas = (props: CanvasProps) => {
  const { editing, width = 0, height = 0, onChange = noOp } = props;
  const { activeLayer, explorationScene, sceneData } =
    useGlobalExploration(xkeys);
  const [size, setSize] = useState({ width, height });
  const onBGClick = () => setGlobalSlotIndex(-1, activeLayer);
  const fillBG = useMemo(
    () => activeLayer && layerColors[activeLayer],
    [activeLayer]
  );
  const compFallback = <FullScreenLoader msg="Loading ..." />;

  useEffect(() => {
    const $parent = document.querySelector("#builder-canvas");
    if (!$parent) return;
    const { width: cw, height: ch } = $parent.getBoundingClientRect();
    // -2 for border, -50 for toolbar
    setSize({
      width: Math.min(1200, cw - 2),
      height: Math.min(640, ch - 2)
    });
  }, []);

  return (
    <Canvas>
      {size.width > 0 ? (
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
            editing={editing}
            layer={activeLayer}
            scene={explorationScene}
            onChange={onChange}
          />

          {!editing && explorationScene && (
            <PixiSceneIntro key={explorationScene.id} {...size} />
          )}
        </Stage>
      ) : (
        <FullScreenLoader msg="Loading Canvas..." />
      )}

      {editing ? (
        <Suspense fallback={compFallback}>
          <PixiCanvasToolbar floating />
        </Suspense>
      ) : (
        sceneData && (
          <Suspense fallback={compFallback}>
            <PixiCanvasDialog {...sceneData} />
          </Suspense>
        )
      )}
    </Canvas>
  );
};
