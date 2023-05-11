import { ThemeProps } from "styled-components";

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
    bgGradientDir?: (direction?: string) => string;
    semitransparent: string;
    grey: string;
    error: string;
    errorDark: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
  };

  presets: {
    fonts: {
      heading: string;
      body: string;
    };
    elevate: DefaultSizes;
    round: DefaultSizes;
  };
}>["theme"];

/** Global Size presets */
const sizes = {
  xxs: "0.125rem",
  xs: "0.3rem",
  sm: "0.6rem",
  default: "1rem",
  md: "1.4rem",
  lg: "2.1rem",
  xlg: "2.6rem",
  xxlg: "3.2rem",
  xxxlg: "4.8rem"
};

/** Global */
const presets = {
  elevate: {
    md: `0 ${sizes.xs} ${sizes.xs}`,
    sm: `0 ${sizes.xxs} ${sizes.xs}`,
    xs: `0 1px 2px`,
    xxs: `0 0 2px`,
    lg: `0 ${sizes.sm} ${sizes.xs}`,
    xlg: `0 ${sizes.default} ${sizes.xs}`
  },

  round: {
    xlg: `72px`,
    lg: `48px`,
    md: `16px`,
    sm: `8px`,
    xs: `4px`
  },

  fonts: {
    // heading: "'Ubuntu', sans-serif",
    // body: "'Source Sans 3', sans-serif",
    heading: "'Source Sans 3', sans-serif",
    body: "'Ubuntu', sans-serif"
  }
};

/** CSS mixins */
const mixins = {
  ellipsis: `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  `,
  lineclamp
};

/**
 * Defines additional properties you want to access when using styled
 * components. The properties of `shared` can be accessed inline using
 * the `theme` object, e.g.:
 * border-radius: ${({ theme }) => theme.presets.round.xlg}; // 72px
 *
 */
const shared = {
  sizes,
  colors: {
    bgGradient: "linear-gradient(180deg, #282c34 0%, #101918 100%)",
    success: "#2ca258",
    grey: "#9c9c9c"
  },
  presets,
  mixins
};

export default shared;

export const sidebarWidth = "12rem";

/* Shared CSS Helpers */

/** apply line-clamp rule (limit number of displayed lines with ellipsis) */
export function lineclamp(lines: number) {
  return `
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
  `;
}
