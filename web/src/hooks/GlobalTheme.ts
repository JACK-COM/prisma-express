import { useEffect, useState } from "react";
import THEME, { GlobalTheme, ThemeInstance, getTheme } from "theme";
import logoLightTheme from "assets/Logo-dark.png";
import logoDarkTheme from "assets/Logo-white.png";

/* Listen to theme changes */
export function useGlobalTheme() {
  const currentTheme = getTheme() || "Dark";
  const [theme, setTheme] = useState(THEME[currentTheme]);
  const logoImage = currentTheme === "Dark" ? logoDarkTheme : logoLightTheme;
  const onTheme = (s: Partial<ThemeInstance>) => {
    if (s.theme !== undefined) setTheme(THEME[s.theme]);
  };

  useEffect(() => {
    return GlobalTheme.subscribeToKeys(onTheme, ["theme"]);
  }, []);

  return { theme, logoImage };
}
