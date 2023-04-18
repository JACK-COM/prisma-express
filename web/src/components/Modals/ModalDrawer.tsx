import Button, { WideButton } from "components/Forms/Button";
import { MouseEventHandler, useMemo } from "react";
import styled, { css } from "styled-components";
import { noOp } from "utils";
import { FlexColumn, GridContainer, MatIcon } from "../Common/Containers";
import useEscapeKeyListener from "hooks/GlobalEscapeKeyEvent";

const DrawerContainer = styled(FlexColumn)`
  height: 100vh;
  left: 0;
  place-content: center;
  align-items: start;
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
/** Shared width of content */
const contentWidthBoundary = css`
  width: 50vw;
  min-width: 300px;
  z-index: 995;

  @media screen and (max-width: 768px) {
    width: 100vw;
  }
`;
const ModalDrawerControls = styled(GridContainer)`
  ${contentWidthBoundary}
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
const ModalDrawerTitle = styled(GridContainer).attrs({
  columns: "auto min-content"
})`
  ${contentWidthBoundary}
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
type ContentProps = { centered?: boolean };
const ModalDrawerContents = styled(FlexColumn).attrs({
  padded: true
})<ContentProps>`
  ${contentWidthBoundary}
  background: ${({ theme }) => theme.colors.bgColor};
  border-radius: ${({ theme }) => theme.presets.round.default};
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  color: ${({ theme }) => theme.colors.primary};
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  place-content: ${({ centered = false }) => (centered ? "center" : "start")};
`;

type ModalDrawerProps = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  openTowards?: string & ("left" | "right" | "up" | "down");
  centerContent?: boolean;
  onClose?: { (): void };
  onConfirm?: { (): any };
} & React.ComponentPropsWithRef<"div">;

const ModalDrawer = (p: ModalDrawerProps) => {
  const {
    title,
    onClose = noOp,
    onConfirm = noOp,
    children,
    centerContent,
    open,
    openTowards: openFrom = "left",
    confirmText = "",
    cancelText = ""
  } = p;
  const rootClass = "modal-root--default";
  const contentEntryClass = `slide-in-${openFrom}`;
  const modalControlCols = useMemo(
    () => (confirmText && cancelText ? "repeat(2,1fr)" : "auto"),
    [confirmText, cancelText]
  );
  const onBGClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const $elem = e.target as HTMLDivElement;
    if ($elem.classList.contains(rootClass)) onClose();
  };

  // Close on escape
  useEscapeKeyListener(onClose);

  if (!open) return <></>;

  return (
    <DrawerContainer className={rootClass} onClick={onBGClick}>
      <ModalDrawerTitle>
        {title && <h1 className="title h4">{title}</h1>}
        <Button variant="transparent" onClick={onClose}>
          <MatIcon icon="close" />
        </Button>
      </ModalDrawerTitle>

      <ModalDrawerContents
        centered={centerContent}
        className={contentEntryClass}
      >
        {children}
      </ModalDrawerContents>

      {(confirmText || cancelText) && (
        <ModalDrawerControls columns={modalControlCols}>
          {cancelText && (
            <WideButton variant="transparent" onClick={onClose}>
              {cancelText}
            </WideButton>
          )}
          {confirmText && (
            <WideButton onClick={onConfirm}>{confirmText}</WideButton>
          )}
        </ModalDrawerControls>
      )}
    </DrawerContainer>
  );
};

export default ModalDrawer;
