import shared, { AppTheme }  from "./theme.shared";

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

    accent: "#30457a", // --marian-blue: #30457aff;
    bgColor: "#acbdba", // --ash-gray: #acbdbaff;
    bgGradient: "linear-gradient(45deg, #11234fff 0%, #30457aff 100%)",
    bgGradientDir: (dir = "45deg") =>
      `linear-gradient(${dir}, #11234fff 0%, #30457aff 100%)`,
    semitransparent: "#FFFFFF33",
    error: "#92150d", // --barn-red: #77100aff;
    errorDark: "#020300",
    primary: "#5d5a53", // --davys-gray: #5d5a53ff;
    secondary: "#3b3c34", // --black-olive: #3b3c34ff;
    warning: "#11234f" // --space-cadet: #11234fff;
  }
};

export default LIGHT_THEME;
