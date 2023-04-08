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
  }
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
  presets
};

export default shared;

/* Shared CSS Helpers */

/** apply line-clamp rule */
export function lineclamp(lines: number) {
  return `
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
  `;
}
