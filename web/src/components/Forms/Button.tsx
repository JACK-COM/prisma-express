import { ComponentPropsWithRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import styled, { css } from "styled-components";
import MatIcon from "../Common/MatIcon";
import AllButtonProps, * as UI from "./Button.Helpers";

const classOverrides = css`
  &.error {
    border-color: transparent;
    &:hover {
      background-color: ${({ theme }) => theme.colors.errorDark};
    }
  }
`;
const IconPaddingRight = ({ round }: { round?: boolean }) =>
  round ? 0 : "0.4rem";
export const defaultButtonCSS = css`
  align-items: center;
  background-color: ${UI.bgColor};
  border-radius: ${UI.borderRadius};
  border: ${UI.border};
  color: ${UI.textColor};
  cursor: pointer;
  display: inline-flex;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: ${UI.fontSize};
  height: ${UI.height};
  margin: 0;
  padding: ${UI.padding};
  place-content: center;
  text-decoration: none;
  text-shadow: ${UI.textShadow};
  transition: border-color 150ms background-color 150ms filter 150ms;
  width: ${UI.width};

  &:not([disabled]):hover {
    background-color: ${UI.bgColorHover};
    box-shadow: 0 1px 0.4em inset #001125ca;
    outline: 1px solid ${({ theme }) => theme.colors.semitransparent};
    filter: drop-shadow(0 0 1.2em #aa64ffaa);
    transform: scale(0.99, 0.99);
    transition: 0.12s linear;
  }

  &[disabled],
  &.disabled {
    transition: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
  ${classOverrides}
`;
const ButtonBase = styled.button<AllButtonProps>`
  ${defaultButtonCSS}
  &.button--icon > .material-icons {
    padding-right: ${IconPaddingRight};
  }
`;
/** Default Application button */
export const Button = styled(ButtonBase)``;
export default Button;

/** Anchor tag with app button styles (and some props) */
export const ButtonLink = styled.a<UI.SharedButtonProps>`
  ${defaultButtonCSS}
  color: inherit;
  height: ${(props) => (props.round ? UI.width(props) : "auto")};
  padding: ${({ theme }) => theme.sizes.xs};
  width: ${(props) => (props.round ? UI.width(props) : "auto")};
  > .material-icons {
    padding-right: ${IconPaddingRight};
  }
`;
/** `<Link>` component with app button styles (and some props) */
export const StyledLink = styled(Link)<UI.SharedButtonProps>`
  ${defaultButtonCSS}
  line-height: initial;
  > .material-icons {
    padding-right: ${IconPaddingRight};
  }
`;
type WithIconProps = {
  /** Name of Material Icon to apply (e.g. `account_circle`) */
  icon: string;
  /** Link or Button text */
  text?: string | JSX.Element;
};
type LinkWithIconProps = Pick<
  ComponentPropsWithRef<"a">,
  "title" | "target" | "href"
> &
  WithIconProps & {
    /** Appends `target=_blank` attribute when true */
    external?: boolean;
    /** Style variant */
    variant?: AllButtonProps["variant"];
    size?: AllButtonProps["size"];
  };

/** An anchor tag with button stylings and an inline icon */
export const LinkWithIcon = (props: LinkWithIconProps) => {
  const {
    icon,
    text = "",
    external,
    href = "",
    variant,
    size = "sm",
    ...linkProps
  } = props;

  return external ? (
    <ButtonLink
      size={size}
      target="_blank"
      href={href}
      variant={variant}
      {...linkProps}
    >
      <MatIcon icon={icon} />
      <span className="text">{text}</span>
    </ButtonLink>
  ) : (
    <StyledLink size={size} to={href} variant={variant} {...linkProps}>
      <MatIcon icon={icon} />
      <span className="text">{text}</span>
    </StyledLink>
  );
};
type ButtonWithIconProps = Partial<AllButtonProps> & WithIconProps;

/** A button with an inline icon */
export const ButtonWithIcon = (props: ButtonWithIconProps) => {
  const { icon, text, ...buttonProps } = props;
  const classN = `button--icon ${buttonProps.className || ""}`;

  return (
    <Button className={classN} {...buttonProps}>
      <MatIcon icon={icon} />
      {text && <span className="text">{text}</span>}
    </Button>
  );
};

/** A circular button */
type AnimationProps = {
  animation?: string;
  duration?: string;
  timing?: string;
  repeat?: string;
};
export const RoundButton = styled(ButtonBase).attrs({
  round: true
})<AnimationProps>`
  align-items: center;
  display: flex;
  font-size: ${UI.fontSize};
  padding: ${({ theme }) => theme.sizes.sm};
  > * {
    font-size: inherit;
  }
  .material-icons {
    font-size: larger;
    padding: 0;
    transition: color 0.2s ease-in-out;
  }
  &:hover .material-icons {
    animation-name: ${({ animation = "rotate180" }) => animation};
    animation-duration: ${({ duration = "0.5s" }) => duration};
    animation-timing-function: ${({ timing = "ease-in-out" }) => timing};
    animation-iteration-count: ${({ repeat = "1" }) => repeat};
    animation-fill-mode: forwards;

    &.delete {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

/** A transparent button (no background color) */
export const TransparentButton = styled(ButtonBase).attrs({
  variant: "transparent"
})``;

/** A wide button (full-width; accepts other button props except size) */
export const WideButton = styled(ButtonBase).attrs({ size: "lg" })`
  bottom: 0;
  position: sticky;
  margin: 0 0 ${({ theme }) => theme.sizes.sm};
  max-width: calc(100% - 2px);
`;
