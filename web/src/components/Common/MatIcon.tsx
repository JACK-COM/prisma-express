import styled from "styled-components";
import { ComponentPropsWithRef } from "react";

export const Icon = styled.span`
  font-size: inherit;
  display: inline-block;
`;
export type MatIconProps = { icon: string } & ComponentPropsWithRef<"span">;
export const MatIcon = ({
  icon,
  className = "",
  title = "",
  onClick,
  style,
  ...rest
}: MatIconProps) => (
  <Icon
    className={`material-icons ${className}`.trim()}
    title={title}
    onClick={onClick}
    children={icon}
    style={style}
    {...rest}
  />
);

export default MatIcon;
