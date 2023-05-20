import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, useTick } from "@pixi/react";
import PixiSprite from "./PixiSprite";
import { InteractiveSlot } from "utils/types";
import {
  CanvasLayerProps,
  editableSpriteProps,
  layerFilters,
  layerColors,
  previewSpriteProps,
  EditorProps
} from "./Pixi.Helpers";
import {
  ExplorationSceneLayer,
  GlobalExploration,
  setGlobalLayer
} from "state";
import { noOp } from "utils";
import { RectFill } from "./RectFill";
import { BlurFilter, TextStyle } from "pixi.js";
import PixiText from "./PixiText";

type SceneIntroProps = Pick<EditorProps, "width" | "height">;
enum IntroPhases {
  NONE = "none",
  FADE_IN = "fade-in",
  FADE_OUT = "fade-out"
}

const round = (n: number) => Math.round(n * 100) / 100;

/** @PixiComponent Canvas group of sprites + interactions  */
export default function PixiSceneIntro(props: SceneIntroProps) {
  const size = { width: props.width || 800, height: props.height || 600 };
  const { explorationScene } = GlobalExploration.getState();
  const { title, order } = explorationScene || {};
  const [phase, setPhase] = useState<IntroPhases>(IntroPhases.FADE_IN);
  const [phaseStart, setPhaseStart] = useState(0);
  const [textAlpha, setTextAlpha] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [blur, setBlur] = useState(5);
  const blurFilter = useMemo(
    () => (blur > 0 ? [new BlurFilter(blur, 3, 10)] : null),
    [blur]
  );
  const textStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 32,
    fontWeight: "bold",
    stroke: 0x000000,
    strokeThickness: 1
  });
  const changePhase = (nextPhase: IntroPhases) => {
    setPhaseStart(0);
    setPhase(nextPhase);
  };

  useTick((delta) => {
    // blurFilter.blur = 5 + Math.sin(delta / 100) * 5;
    if (phase === IntroPhases.NONE) return;

    if (phase === IntroPhases.FADE_IN) {
      const incr = round(Math.sin(delta / 100) * 5);
      const nextBlur = Math.max(round(blur - incr), 1);
      const nextAlpha = Math.min(round(textAlpha + incr), 1);
      setBlur(nextBlur);
      setTextAlpha(nextAlpha);
      if (nextBlur > 1) return;
      setBlur(0);
      return changePhase(IntroPhases.FADE_OUT);
    }

    if (phase === IntroPhases.FADE_OUT && phaseStart >= 75) {
      if (phaseStart < 125) return setPhaseStart(phaseStart + delta);
      const incr = round(Math.sin(delta / 200) * 5);
      const nextAlpha = Math.max(round(alpha - incr), 0);
      setAlpha(nextAlpha);
      if (nextAlpha === 0) return changePhase(IntroPhases.NONE);
    }

    return setPhaseStart(phaseStart + delta);
  });

  return (
    <Container {...size} x={0} y={0} alpha={alpha} anchor={0.5}>
      <RectFill {...size} fill={0x0} alpha={alpha} />
      <PixiText
        alpha={textAlpha}
        text={title || `Scene ${order}`}
        style={textStyle}
        eventMode={phase === IntroPhases.FADE_IN ? "dynamic" : "none"}
        filters={blurFilter}
        scale={1}
        x={size.width / 2}
        y={size.height / 2}
      />
    </Container>
  );
}
