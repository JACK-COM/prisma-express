import Button, { WideButton } from "components/Forms/Button";
import { MouseEventHandler, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { noOp } from "utils";
import { FlexColumn, GridContainer, MatIcon } from "../Common/Containers";

const ModalContainer = styled(FlexColumn)`
  height: 100vh;
  left: 0;
  place-content: center;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 9999;

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
  width: 100vw;
  min-width: 300px;
`;
const ModalControls = styled(GridContainer)`
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
const ModalTitle = styled(GridContainer).attrs({
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
const ModalContents = styled(FlexColumn).attrs({ padded: true })<ContentProps>`
  ${contentWidthBoundary}
  background: ${({ theme }) => theme.colors.bgColor};
  border-radius: ${({ theme }) => theme.presets.round.default};
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  color: ${({ theme }) => theme.colors.primary};
  height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  place-content: ${({ centered = false }) => (centered ? "center" : "start")};
`;

type ModalProps = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  centerContent?: boolean;
  onClose?: { (): void };
  onConfirm?: { (): any };
} & React.ComponentPropsWithRef<"div">;

const Modal = (p: ModalProps) => {
  const {
    title,
    onClose = noOp,
    onConfirm = noOp,
    children,
    centerContent,
    open,
    confirmText = "",
    cancelText = ""
  } = p;
  const rootClass = "modal-root--default";
  const contentEntryClass = "scale-in";
  const modalControlCols = useMemo(
    () => (confirmText && cancelText ? "repeat(2,1fr)" : "auto"),
    [confirmText, cancelText]
  );
  const onBGClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const $elem = e.target as HTMLDivElement;
    if ($elem.classList.contains(rootClass)) onClose();
  };

  useEffect(() => {
    // close modal on ESC key press
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!open) return <></>;

  return (
    <ModalContainer className={rootClass} onClick={onBGClick}>
      <ModalTitle>
        {title && <h1 className="title h4">{title}</h1>}
        <Button variant="transparent" onClick={onClose}>
          <MatIcon icon="close" />
        </Button>
      </ModalTitle>

      <ModalContents centered={centerContent} className={contentEntryClass}>
        {children}
      </ModalContents>

      {(confirmText || cancelText) && (
        <ModalControls columns={modalControlCols}>
          {cancelText && (
            <WideButton variant="transparent" onClick={onClose}>
              {cancelText}
            </WideButton>
          )}
          {confirmText && (
            <WideButton onClick={onConfirm}>{confirmText}</WideButton>
          )}
        </ModalControls>
      )}
    </ModalContainer>
  );
};

export default Modal;
