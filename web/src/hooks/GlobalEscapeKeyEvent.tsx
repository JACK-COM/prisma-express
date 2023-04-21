import { MutableRefObject, useEffect } from "react";
import { noOp } from "utils";

/**
 * Captures when a blur event occurs on a component
 *
 * Example:
 * ```typescript
 * import useEscapeKeyListener from 'hooks/GlobalEscapeKeyEvents'
 *
 * useEscapeKeyListener(callBack)
 * ```
 * @param onEscape - callback to be triggered on ESC key press
 * @param condition - condition to trigger the effect
 */
export default function useEscapeKeyListener(
  onEscape: () => void,
  condition: any
) {
  useEffect(() => {
    // Trigger handler on ESC keypress
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onEscape();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onEscape, condition]);
}
