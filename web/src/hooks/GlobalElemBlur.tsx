import { useEffect } from "react";

/**
 * Captures when a blur event occurs on a component
 *
 * Example:
 * ```typescript
 * import useElemBlur from 'hooks/GlobalElemBlur'
 * const componentWrapperRef = React.useRef<HTMLHeadingElement>(null)
 * useElemBlur(componentWrapperRef, callBack)
 * ```
 */
export default function useElemBlur(ref: any, onBlur: (event: MouseEvent) => void) {
  useEffect(() => {
    const handleBlurTrigger = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onBlur(e);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleBlurTrigger);

    // Cleanup: remove event listener
    return () => {
      document.removeEventListener("mousedown", handleBlurTrigger);
    };
  }, [ref, onBlur]);
}
