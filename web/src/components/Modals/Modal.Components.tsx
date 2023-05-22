import styled, { css } from "styled-components";
import { FlexColumn, GridContainer } from "../Common/Containers";

export type ContentProps = { centered?: boolean };

/** Shared width of content */
const defaultContentBoundary = css`
  width: 100vw;
  min-width: 300px;
`;
/** Shared width of content */
export const drawerContentBoundary = css`
  min-width: 300px;
  width: 50vw;
  z-index: 995;

  @media screen and (max-width: 768px) {
    ${defaultContentBoundary}
  }
`;
const controlsContainer = css`
  background-color: ${({ theme }) => theme.colors.bgColor};
  bottom: -10px;
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  margin-top: -1px;
  position: sticky;
  padding: 0.4rem;

  > button {
    font-weight: bolder;
    margin: 0;
  }
`;
const titleContainer = css`
  align-items: center;
  background: ${({ theme }) => theme.colors.bgColor};
  z-index: 1;

  .title {
    align-self: end;
    flex-grow: 1;
    line-height: 2.6rem;
    margin: 0.8rem 0;
    padding-left: 0.4rem;
    text-align: left;
  }
`;
const contentContainer = css<ContentProps>`
  background: ${({ theme }) => theme.colors.bgColor};
  border-radius: ${({ theme }) => theme.presets.round.default};
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  color: ${({ theme }) => theme.colors.primary};
  overflow-y: auto;
  overflow-x: hidden;
  place-content: ${({ centered = false }) => (centered ? "center" : "start")};
`;
const container = css`
  height: 100vh;
  left: 0;
  place-content: center;
  position: fixed;
  top: 0;
  z-index: 999;

  &::before {
    background: #00000099;
    content: "";
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: 0;
  }
`;

// DRAWER MODAL COMPONENTS

export const DrawerContainer = styled(FlexColumn)`
  align-items: start;
  ${container}
`;
export const ModalDrawerControls = styled(GridContainer).attrs({
  id: "modal-drawer--controls"
})`
  ${drawerContentBoundary}
  ${controlsContainer}
`;
export const ModalDrawerContents = styled(FlexColumn).attrs(
  ({ className = "" }) => ({
    padded: true,
    id: "modal-drawer--contents",
    className: `${className} hide-scrollbar`.trim()
  })
)<ContentProps>`
  ${drawerContentBoundary}
  ${contentContainer}
  height: 100vh;
`;
export const ModalDrawerTitle = styled(GridContainer).attrs({
  id: "modal-drawer--title",
  columns: "auto 32px"
})`
  ${drawerContentBoundary}
  ${titleContainer}
`;

// DEFAULT MODAL COMPONENTS

export const ModalContainer = styled(FlexColumn)`
  width: 100vw;
  ${container}
`;
export const ModalControls = styled(GridContainer).attrs({
  id: "modal--controls"
})`
  ${defaultContentBoundary}
  ${controlsContainer}
`;
export const ModalTitle = styled(GridContainer).attrs({
  id: "modal--title",
  columns: "auto min-content"
})`
  ${defaultContentBoundary}
  ${titleContainer}
`;
export const ModalContents = styled(FlexColumn).attrs({
  id: "modal--contents",
  padded: true
})<ContentProps>`
  ${defaultContentBoundary}
  ${contentContainer}
  height: 80vh;
  z-index: inherit;
`;
