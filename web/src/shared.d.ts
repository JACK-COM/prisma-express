import { createGlobalStyle, ThemeProps } from "styled-components";

/** Size labels */
export type DefaultSizes = {
  xxs?: string;
  xs?: string;
  sm: string;
  default?: string;
  md: string;
  lg: string;
  xlg: string;
  xxlg?: string;
};

/** Customized `styled-components` app theme */
export type AppTheme = ThemeProps<{
  sizes: DefaultSizes;

  colors: {
    accent: string;
    bgColor: string;
    bgGradient?: string;
    semitransparent: string;
    error: string;
    errorDark: string;
    primary: string;
    secondary: string;
    warning: string;
  };

  presets: {
    elevate: DefaultSizes;
    round: DefaultSizes;
  };
}>["theme"];
