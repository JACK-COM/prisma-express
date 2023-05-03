import { ComponentPropsWithRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import styled, { css } from "styled-components";
import { MatIcon } from "../Common/Containers";
import AllButtonProps, * as UI from "./Button.Helpers";

const classOverrides = css`
  &.error {
    border-color: transparent;
    &:hover {
      background-color: ${({ theme }) => theme.colors.errorDark};
    }
  }
`;
const defaultButtonCSS = css`
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
`;
/** `<Link>` component with app button styles (and some props) */
export const StyledLink = styled(Link)<UI.SharedButtonProps>`
  ${defaultButtonCSS}
  height: ${UI.width};
  width: ${(props) => (props.round ? UI.width(props) : "auto")};
  text-shadow: ${UI.textShadow} !important;
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
  };

/** An anchor tag with button stylings and an inline icon */
export const LinkWithIcon = (props: LinkWithIconProps) => {
  const { icon, text = "", external, href = "", variant, ...linkProps } = props;

  return external ? (
    <ButtonLink target="_blank" href={href} variant={variant} {...linkProps}>
      <MatIcon icon={icon} />
      {text}
    </ButtonLink>
  ) : (
    <StyledLink to={href} variant={variant} {...linkProps}>
      <MatIcon icon={icon} />
      {text}
    </StyledLink>
  );
};
type ButtonWithIconProps = Partial<AllButtonProps> & WithIconProps;

/** A button with an inline icon */
export const ButtonWithIcon = (props: ButtonWithIconProps) => {
  const { icon, text, ...buttonProps } = props;

  return (
    <Button {...buttonProps}>
      <MatIcon icon={icon} />
      {text && <span className="text">{text}</span>}
    </Button>
  );
};

/** A circular button */
export const RoundButton = styled(ButtonBase).attrs({
  round: true
})`
  padding: ${({ theme }) => theme.sizes.sm};
  > * {
    font-size: ${UI.fontSize};
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
