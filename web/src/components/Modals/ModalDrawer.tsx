import { RoundButton, WideButton } from "components/Forms/Button";
import { MouseEventHandler, useEffect, useMemo } from "react";
import { noOp } from "utils";
import { MatIcon } from "components/Common/MatIcon";
import {
  DrawerContainer,
  ModalDrawerControls,
  ModalDrawerTitle,
  ModalDrawerContents
} from "./Modal.Components";

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
    cancelText = "",
    style
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
  useEffect(() => {
    // Trigger handler on ESC keypress
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!open) return <></>;

  return (
    <DrawerContainer
      id="modal-drawer"
      style={style}
      className={rootClass}
      onClick={onBGClick}
    >
      <ModalDrawerTitle>
        {title && (
          <h1
            className="title h4"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        <RoundButton size="md" variant="transparent" onClick={onClose}>
          <MatIcon icon="close" />
        </RoundButton>
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
