import { RoundButton, WideButton } from "components/Forms/Button";
import { MouseEventHandler, useEffect, useMemo } from "react";
import { noOp } from "utils";
import { MatIcon } from "components/Common/MatIcon";
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
  useEffect(() => {
    if (!open) return noOp;
    // Trigger handler on ESC keypress
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  if (!open) return <></>;

  return (
    <ModalContainer className={rootClass} onClick={onBGClick}>
      <ModalTitle>
        {title && (
          <h1
            className="title h4"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
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
