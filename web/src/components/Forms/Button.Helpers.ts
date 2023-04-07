import { ComponentPropsWithRef } from "react";
import { AppTheme } from "shared";

interface AllButtonProps extends ComponentPropsWithRef<"button"> {
  /** Application Theme */
  theme: AppTheme;
  /** Circular button when `true` */
  round?: boolean;
  /** Button size preset */
  size?: "sm" | "md" | "lg";
  /** Button theme preset */
  variant?: "accent" | "outlined" | "transparent";
}

export default AllButtonProps;

export function bgColor({ theme, variant, disabled }: AllButtonProps) {
  switch (true) {
    case ["outlined", "transparent"].includes(variant as string):
    case disabled: {
      return "transparent";
    }
    case !variant:
    case variant === "accent": {
      return theme.colors.accent;
    }
    default:
      return "white";
  }
}

export function bgColorHover({ theme, variant, disabled }: AllButtonProps) {
  if (variant === "transparent") return theme.colors.semitransparent;
  return bgColor({ theme, variant, disabled });
}

export function border({ variant, disabled, theme }: AllButtonProps) {
  if (variant === "transparent") return 0;
  const style = disabled ? "dotted" : "solid";
  const borderColor = variant === "outlined" ? textColor : bgColor;
  return `1px ${style} ${borderColor({ theme, variant, disabled })}`;
}

export function padding({ theme, size, round }: AllButtonProps) {
  const { sizes } = theme;
  if (round) return "0.8rem";
  return size === "sm" ? sizes.xs : sizes.sm;
}

export function borderRadius({ theme, round }: AllButtonProps) {
  if (round) return "100%";
  const { round: corners } = theme.presets;
  return corners.sm;
}

export function textColor({ variant, disabled, theme }: AllButtonProps) {
  const { primary, secondary, accent } = theme.colors;
  if (disabled) return accent;
  return variant === "transparent" ? secondary : primary;
}

export function width({ theme, size, round }: AllButtonProps) {
  if (round) return theme.sizes.md;
  return size === "lg" ? "100%" : "initial";
}
