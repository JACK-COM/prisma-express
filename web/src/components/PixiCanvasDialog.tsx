import styled, { css } from "styled-components";
import { ActiveSceneData, setGlobalSceneData } from "state";
import ListView from "./Common/ListView";
import { SlotInteraction } from "utils/types";
import MatIcon from "./Common/MatIcon";
import { RoundButton } from "./Forms/Button";

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

/** @PixiComponent Display text or dialogue for the selected on-canvas item */
const PixiCanvasDialog = ({ data, name }: ActiveSceneData) => {
  const { choices, text } = data;
  const clearGlobalSceneData = () => setGlobalSceneData(null);
  if (!data) return null;

  return (
    <DialogContainer className="slide-in-up">
      {name && <h6>{name}</h6>}
      {text && <p>{text}</p>}
      {choices && (
        <ListView
          data={choices}
          itemText={(choice: SlotInteraction) => choice.data?.text}
        />
      )}
      <DialogButton className="flex" onClick={clearGlobalSceneData}>
        <MatIcon icon="close" />
      </DialogButton>
    </DialogContainer>
  );
};

export default PixiCanvasDialog;
