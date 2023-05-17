import { ComponentPropsWithRef, RefObject, useMemo } from "react";
import { BlurFilter, SCALE_MODES, BaseTexture, TextStyle } from "pixi.js";
import { Container, Text } from "@pixi/react";
import PixiSprite from "./PixiSprite";
import useGlobalExploration from "hooks/GlobalExploration";
import { createExplorationTemplateScene } from "routes/ExplorationBuilder.Helpers";
import { InteractiveSlotWithPosition } from "utils/types";
import { GlowFilter } from "@pixi/filter-glow";
import { OutlineFilter } from "@pixi/filter-outline";
import { ExplorationStoreKey, setGlobalLayer } from "state";
import PixiText from "./PixiText";

// Default scaling operation for the image assets in canvas
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
// Glow + Outline filters
const outlineFilterGreen = new OutlineFilter(2, 0x99ff99, 1);
const outlineFilterBlue = new OutlineFilter(2, 0x0077cc, 1);
const glowFilterRed = new GlowFilter({
  distance: 2,
  outerStrength: 2,
  innerStrength: 1,
  color: 0xff0022,
  quality: 0.5
});

type EditorProps = {
  x?: number;
  y?: number;
  parentRef?: RefObject<HTMLDivElement>;
} & ComponentPropsWithRef<typeof Container>;

const keys: ExplorationStoreKey[] = ["explorationScene", "activeLayer"];

export const PixiEditorLayers = (props: EditorProps) => {
  const { x = 400, y = 330 } = props;
  const { explorationScene, activeLayer = "all" } = useGlobalExploration(keys);
  const { background, characters, foreground } =
    explorationScene || createExplorationTemplateScene();
  const charY = Number(characters.length === 0) * 72;

  return (
    <Container sortableChildren {...{ x, y }}>
      {["background", "all"].includes(activeLayer) && (
        <PixiBackgroundLayer background={background} />
      )}
      {["characters", "all"].includes(activeLayer) && (
        <PixiCharactersLayer characters={characters} y={charY} />
      )}
      {["foreground", "all"].includes(activeLayer) && (
        <PixiForegroundLayer foreground={foreground} y={charY * 2} />
      )}
    </Container>
  );
};

type BgLayerProps = EditorProps & {
  background: InteractiveSlotWithPosition[];
};
function PixiBackgroundLayer(props: BgLayerProps) {
  const { x = 0, y = 0 } = props;
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const textStyle = new TextStyle({ fill: "white", fontSize: 36 });
  const { explorationScene } = useGlobalExploration(["explorationScene"]);
  const { background } = explorationScene || { background: [] };

  return (
    <Container sortableChildren {...{ x, y }}>
      {!background.length && (
        <PixiText
          text="No Background Image"
          alpha={0.2}
          containerProps={{ movable: true }}
          anchor={{ x: 0.5, y: 0.5 }}
          filters={[blurFilter]}
          style={textStyle}
          zIndex={0}
        />
      )}
      <PixiSprite
        filters={[glowFilterRed]}
        zIndex={10}
        containerProps={{
          movable: true,
        //   onDisplayChanged: () => setGlobalLayer("background")
        }}
      />
    </Container>
  );
}

type CharactersLayerProps = EditorProps & {
  characters: InteractiveSlotWithPosition[];
};
function PixiCharactersLayer(props: CharactersLayerProps) {
  const { x = 0, y = 0, characters } = props;
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const textStyle = new TextStyle({ fill: "white", fontSize: 72 });

  return (
    <Container sortableChildren {...{ x, y }}>
      {!characters.length && (
        <Text
          text="No Characters"
          alpha={0.2}
          anchor={{ x: 0.5, y: 0.5 }}
          filters={[blurFilter]}
          style={textStyle}
          zIndex={0}
        />
      )}
      <PixiSprite
        filters={[outlineFilterGreen]}
        zIndex={10}
        containerProps={{
          movable: true,
        //   onDisplayChanged: () => setGlobalLayer("characters")
        }}
      />
    </Container>
  );
}

type FgLayerProps = EditorProps & {
  foreground: InteractiveSlotWithPosition[];
};
function PixiForegroundLayer(props: FgLayerProps) {
  const { x = 0, y = 0, foreground } = props;
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const textStyle = new TextStyle({ fill: "white", fontSize: 72 });

  return (
    <Container sortableChildren {...{ x, y }}>
      {!foreground.length && (
        <Text
          text="No Foreground items"
          alpha={0.2}
          anchor={{ x: 0.5, y: 0.5 }}
          filters={[blurFilter]}
          style={textStyle}
          zIndex={0}
        />
      )}
      <PixiSprite
        filters={[outlineFilterBlue]}
        zIndex={10}
        containerProps={{
          movable: true,
          onDisplayChanged: (p) => {
            console.log(p);
            // setGlobalLayer("foreground");
          }
        }}
      />
    </Container>
  );
}

export default PixiEditorLayers;
