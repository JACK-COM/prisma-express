import { RoundButton, WideButton } from "components/Forms/Button";
import { MouseEventHandler, useMemo } from "react";
import styled, { css } from "styled-components";
import { noOp } from "utils";
import { FlexColumn, GridContainer, MatIcon } from "../Common/Containers";
import useEscapeKeyListener from "hooks/GlobalEscapeKeyEvent";
import {
  ModalContainer,
  ModalContents,
  ModalControls,
  ModalTitle
} from "./Modal.Components";

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

  // close modal on ESC key press
  useEscapeKeyListener(onClose);

  if (!open) return <></>;

  return (
    <ModalContainer className={rootClass} onClick={onBGClick}>
      <ModalTitle>
        {title && <h1 className="title h4">{title}</h1>}
        <RoundButton variant="transparent" onClick={onClose}>
          <MatIcon icon="close" />
        </RoundButton>
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
