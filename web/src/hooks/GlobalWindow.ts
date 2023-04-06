import { useEffect, useState } from "react";

type Size = { height: number; width: number };

/** Track `window` size and anything else */
export function useGlobalWindow() {
  const [screenSize, setScreenSize] = useState<Size>(windowSize());
  const onResize = () => setScreenSize(windowSize());

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return {
    ...screenSize,
    isMobile: screenSize.width <= 768,
    ytIframeMaxHeight: screenSize.height * 0.7
  };
}

/** Get `window` size at time of invocation */
function windowSize() {
  const { innerHeight: height, innerWidth: width } = window;
  return { height, width };
}
