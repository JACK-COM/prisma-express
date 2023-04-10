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
  ...shared,

  colors: {
    ...shared.colors,
    /* accent: "#36b4c7",
    bgColor: "#f7f7f7",
    error: "#db1c1c",
    errorDark: "#c73636",
    primary: "#282c34",
    secondary: "#07C",
    semitransparent: "#cecece99",
    success: "#2e7d32",
    warning: "#f5d84c" */

    // LIGHT_GPT THEME
    accent: "#30457a", // --marian-blue: #30457aff;
    bgColor: "#acbdba", // --ash-gray: #acbdbaff;
    bgGradient: "linear-gradient(180deg, #30457aff 0%, #11234fff 100%)",
    // semitransparent: "#020300cc",
    semitransparent: "#FFFFFF33",
    error: "#37060e", // --black-bean: #37060eff;
    errorDark: "#020300",
    primary: "#5d5a53", // --davys-gray: #5d5a53ff;
    secondary: "#3b3c34", // --black-olive: #3b3c34ff;
    warning: "#11234f" // --space-cadet: #11234fff;

    // GPT_PURE THEME

    /* accent: "#EF476F",
    bgColor: "#F7F7FF",
    bgGradient: "#F2F2F2",
    semitransparent: "#FFFFFF33",
    error: "#FF6B6B",
    errorDark: "#D63C3C",
    primary: "#1D3557",
    secondary: "#457B9D",
    success: "#06D6A0",
    warning: "#FFD166" */
  }
};

export default LIGHT_THEME;
