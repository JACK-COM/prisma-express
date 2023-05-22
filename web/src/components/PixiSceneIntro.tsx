import { useMemo, useState } from "react";
import { Container, useTick } from "@pixi/react";
import { EditorProps } from "./Pixi.SceneProps";
import { GlobalExploration } from "state";
import { BlurFilter, EventMode, TextStyle } from "pixi.js";
import { suppressEvent } from "utils";
import { RectFill } from "./RectFill";
import PixiText from "./PixiText";

type SceneIntroProps = Pick<EditorProps, "width" | "height">;
enum IntroPhases {
  NONE = "none",
  FADE_IN = "fade-in",
  FADE_OUT = "fade-out"
}

const { NONE, FADE_IN, FADE_OUT } = IntroPhases;

const round = (n: number) => Math.round(n * 100) / 100;
const tsshared = { fill: 0xffffff, fontFamily: `"Ubuntu", sans-serif` };

/** @PixiComponent Canvas group of sprites + interactions  */
export default function PixiSceneIntro(props: SceneIntroProps) {
  const size = { width: props.width || 800, height: props.height || 600 };
  const headingStyle = new TextStyle({ ...tsshared, fontSize: 48 });
  const descrptStyle = new TextStyle({
    ...tsshared,
    fontSize: 14,
    wordWrap: true,
    wordWrapWidth: size.width - 100
  });
  const { explorationScene } = GlobalExploration.getState();
  const { title, description, order } = explorationScene || {};
  const [phase, setPhase] = useState<IntroPhases>(FADE_IN);
  const [phaseStart, setPhaseStart] = useState(0);
  const [textAlpha, setTextAlpha] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [blur, setBlur] = useState(5);
  const blurFilter = useMemo(() => [new BlurFilter(blur, 3, 10)], [blur]);
  const evMode = useMemo<EventMode>(
    () => (phase === FADE_IN ? "dynamic" : "none"),
    [phase]
  );
  const changePhase = (nextPhase: IntroPhases) => {
    setPhaseStart(0);
    setPhase(nextPhase);
  };
  const haltTransitions = (e: any) => {
    suppressEvent(e);
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    changePhase(NONE);
    setBlur(1);
    setAlpha(0);
    setTextAlpha(0);
  };

  useTick((delta) => {
    if (phase === NONE) return;

    if (phase === FADE_IN) {
      const incr = round(Math.sin(delta / 100) * 5);
      const nextBlur = Math.max(round(blur - incr), 1);
      const nextAlpha = Math.min(round(textAlpha + incr), 1);
      setBlur(nextBlur);
      setTextAlpha(nextAlpha);
      if (nextBlur > 1) return;
      setBlur(0);
      return changePhase(FADE_OUT);
    }

    if (phase === FADE_OUT && phaseStart >= 75) {
      if (phaseStart < 125) return setPhaseStart(phaseStart + delta);
      const incr = round(Math.sin(delta / 200) * 5);
      const nextAlpha = Math.max(round(alpha - incr), 0);
      setAlpha(nextAlpha);
      if (nextAlpha === 0) return changePhase(NONE);
    }

    return setPhaseStart(phaseStart + delta); // increment to next threshold
  });

  return (
    <Container {...size} x={0} y={0} alpha={alpha} anchor={0.5}>
      <RectFill
        eventMode="dynamic"
        pointerdown={haltTransitions}
        {...size}
        fill={0x0}
        alpha={alpha}
      />
      <PixiText
        alpha={textAlpha}
        text={title || `Scene ${order}`}
        style={headingStyle}
        eventMode={evMode}
        filters={blurFilter}
        x={size.width / 2}
        y={size.height / 2}
      />
      {description && (
        <PixiText
          alpha={textAlpha}
          text={description}
          style={descrptStyle}
          eventMode={evMode}
          filters={blurFilter}
          x={size.width / 2}
          y={size.height * 0.58}
        />
      )}
    </Container>
  );
}
