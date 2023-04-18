import { useEffect } from "react";

/**
 * Captures when a blur event occurs on a component
 *
 * Example:
 * ```typescript
 * import useEscapeKeyListener from 'hooks/GlobalEscapeKeyEvents'
 *
 * useEscapeKeyListener(callBack)
 * ```
 */
export default function useEscapeKeyListener(onEscape: () => void) {
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
  }, []);
}
