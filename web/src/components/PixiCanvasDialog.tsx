import styled, { css } from "styled-components";
import { ActiveSceneData, setGlobalSceneData } from "state";
import ListView from "./Common/ListView";
import { SlotInteractionChoice } from "utils/types";
import MatIcon from "./Common/MatIcon";
import { RoundButton } from "./Forms/Button";
import { Blockquote, Selectable } from "./Common/Containers";
import { handleSlotInteraction } from "./Pixi.SpriteHandlers";

const dialogUI = css`
  border: 0.2rem solid ${({ theme }) => theme.colors.bgColor};
  color: #222;
  position: absolute;
`;
const DialogContainer = styled.div`
  ${dialogUI}
  background: #fff9;
  border-radius: ${({ theme }) => theme.sizes.sm};
  bottom: 2rem;
  left: 50%;
  margin-left: -400px;
  padding: ${({ theme }) => theme.sizes.sm};
  width: 90%;
  max-width: 800px;
`;
const DialogButton = styled(RoundButton)`
  ${dialogUI}
  background: #fff;
  top: -12.5px;
  right: -12.5px;
`;
const DialogChoice = styled(Selectable)`
  background-color: ${({ theme }) => theme.colors.semitransparent};
  color: #0009;
  font-size: 0.9rem;
  width: 100%;
  &:hover {
    background-color: #0009;
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const DialogSpeech = styled(Blockquote)`
  border: 0;
  padding-left: 0.1rem;
  padding-bottom: 0.6rem;
  &::after,
  &::before {
    color: ${({ theme }) => theme.colors.bgColor};
  }
`;

/** @PixiComponent Display text or dialogue for the selected on-canvas item */
const PixiCanvasDialog = ({ data, name = "" }: ActiveSceneData) => {
  const { choices, text } = data;
  const clearGlobalSceneData = () => setGlobalSceneData(null);
  const choose = (choice: SlotInteractionChoice) => {
    handleSlotInteraction({ name, action: choice.action, data: choice.data });
  };

  if (!data) return null;

  return (
    <DialogContainer id="canvas--dialog" className="slide-in-up">
      {name && <h6>{name}</h6>}
      {text && <DialogSpeech>{text}</DialogSpeech>}

      {choices && (
        <ListView
          data={choices}
          itemText={(choice: SlotInteractionChoice) => (
            <DialogChoice className="flex">
              <MatIcon icon="filter_vintage" />
              &nbsp;<span>{choice.text}</span>
            </DialogChoice>
          )}
          onItemClick={choose}
        />
      )}
      <DialogButton size="lg" className="flex" onClick={clearGlobalSceneData}>
        <MatIcon icon="close" />
      </DialogButton>
    </DialogContainer>
  );
};

export default PixiCanvasDialog;
