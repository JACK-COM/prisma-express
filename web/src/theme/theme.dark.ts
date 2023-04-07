import { AppTheme } from "shared";
import shared from "./theme.shared";

/**
 * Define the colors for your application's `dark` theme here.
 * When using styled components, the properties of `DARK_THEME`
 * can be accessed inline using the `theme` object, e.g.:
 *
 * border-color: ${({ theme }) => theme.colors.accent}; // #36b4c7
 */
const DARK_THEME: AppTheme = {
  colors: {
    accent: "#87C0CB", // light grey/timberwolf
    bgColor: "#101918", // eerie black
    error: "#77100A", // barn red
    errorDark: "#380703",
    primary: "#e6dad8", // sky blue
    secondary: "#154B54", // midnight green
    semitransparent: "#7a7a7a42", // grey
    warning: "#2b312f" // onyx
  },

  ...shared
};

export default DARK_THEME;
