import { useGlobalTheme } from "hooks/GlobalTheme";
import { UIThemeType } from "theme";
import { RoundButton } from "./Forms/Button";
import { MatIcon } from "./Common/MatIcon";
import { useMemo } from "react";

const ThemeSelector = () => {
  const { activeTheme, setTheme } = useGlobalTheme();
  const [nextTheme, icon]: [UIThemeType, string] = useMemo(
    () =>
      activeTheme === "Light" ? ["Dark", "dark_mode"] : ["Light", "light_mode"],
    [activeTheme]
  );

  return (
    <RoundButton
      size="lg"
      variant="transparent"
      onClick={() => setTheme(nextTheme)}
      title={`Switch to ${nextTheme} mode`}
      animation="none"
    >
      <MatIcon icon={icon} />
    </RoundButton>
  );
};

export default ThemeSelector;
