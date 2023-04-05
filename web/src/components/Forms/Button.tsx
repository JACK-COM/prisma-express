import { ComponentPropsWithRef } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { MatIcon } from "../Common/Containers";
import AllButtonProps, * as UI from "./Button.Helpers";

const defaultButtonCSS = css`
  align-items: center;
  background-color: ${UI.bgColor};
  border-radius: ${({ theme }) => theme.presets.rounded.sm};
  border: ${UI.border};
  color: ${UI.textColor};
  cursor: pointer;
  display: inline-flex;
  font-family: "Outfit", sans-serif;
  margin: 0;
  padding: ${({ theme }) => theme.sizes.sm};
  place-content: center;
  width: ${UI.width};

  &:not([disabled]):hover {
    background-color: ${UI.bgColorHover};
    transform: scale(0.99, 0.99);
    transition: 0.12s linear;
  }

  &[disabled],
  &.disabled {
    transition: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const classOverrides = css`
  &.error {
    border-color: transparent;
    &:hover {
      background-color: ${({ theme }) => theme.colors.errorDark};
    }
  }
`;
const ButtonBase = styled.button<AllButtonProps>`
  ${defaultButtonCSS}
`;
const DefaultButton = styled(ButtonBase)``;
export default DefaultButton;

export const ButtonLink = styled.a`
  ${defaultButtonCSS}
  height: auto;
  ${classOverrides}
`;
export const StyledLink = styled(Link)`
  ${defaultButtonCSS}
  height: auto;
  ${classOverrides}
`;
type WithIconProps = {
  icon: string;
  text: string | JSX.Element;
};
type LinkWithIconProps = Pick<ComponentPropsWithRef<"a">, "title" | "target"> &
  WithIconProps & { href: string; external?: boolean };

export const LinkWithIcon = (props: LinkWithIconProps) => {
  const { icon, text, external, href, ...linkProps } = props;

  return external ? (
    <ButtonLink target="_blank" href={href} {...linkProps}>
      <MatIcon icon={icon} />
      {text}
    </ButtonLink>
  ) : (
    <StyledLink to={href} {...linkProps}>
      <MatIcon icon={icon} />
      {text}
    </StyledLink>
  );
};
type ButtonWithIconProps = Partial<AllButtonProps> & WithIconProps;

export const ButtonWithIcon = (props: ButtonWithIconProps) => {
  const { icon, text, ...buttonProps } = props;

  return (
    <DefaultButton {...buttonProps}>
      <MatIcon icon={icon} />&nbsp;
      {text}
    </DefaultButton>
  );
};

export const RoundButton = styled(ButtonBase).attrs({ round: true })``;

export const TransparentButton = styled(ButtonBase).attrs({
  variant: "transparent"
})``;

export const WideButton = styled(ButtonBase).attrs({ size: "lg" })`
  bottom: 0;
  position: sticky;
  margin: 0 0 ${({ theme }) => theme.sizes.sm};
  max-width: calc(100% - 2px);
`;
