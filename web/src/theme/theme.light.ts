import { AppTheme } from "shared";
import shared from "./theme.shared";

/**
 * Defines colors for your application's `light` theme. The properties
 * of `LIGHT_THEME` can be accessed inline when using styled components
 * using the `theme` object, e.g.:
 *
 * border-color: ${({ theme }) => theme.colors.accent}; // #36b4c7
 */
const LIGHT_THEME: AppTheme = {
  colors: {
    accent: "#36b4c7",
    bgColor: "#f7f7f7",
    semitransparent: "#ececec33",
    error: "#db1c1c",
    errorDark: "#c73636",
    primary: "#282c34",
    secondary: "#07C",
    warning: "#f5d84c"
  },

  ...shared
};

export default LIGHT_THEME;
