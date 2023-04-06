import { useEffect, useMemo, useState } from "react";
import THEME, { GlobalTheme, ThemeInstance, getTheme } from "theme";
import logoLightTheme from "assets/Logo-dark.png";
import logoDarkTheme from "assets/Logo-white.png";

/* Listen to theme changes */
export function useGlobalTheme() {
  const [activeTheme, setActiveTheme] = useState(getTheme() || "Dark");
  const [themeData, setThemeData] = useState(THEME[activeTheme]);
  const logoImage = useMemo(
    () => (activeTheme === "Dark" ? logoDarkTheme : logoLightTheme),
    [activeTheme]
  );
  const onTheme = (s: Partial<ThemeInstance>) => {
    if (s.theme === undefined) return;
    setActiveTheme(s.theme);
    setThemeData(THEME[s.theme]);
  };

  useEffect(() => {
    return GlobalTheme.subscribeToKeys(onTheme, ["theme"]);
  }, []);

  return { theme: themeData, logoImage };
}
