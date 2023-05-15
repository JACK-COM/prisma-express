import { RoundButton } from "components/Forms/Button";
import { ComponentPropsWithRef } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { lineclamp } from "theme/theme.shared";
import {
  EventPolarity,
  EventPolarityColors,
  PermissionProps
} from "utils/types";

type FlexContainerProps = {
  inline?: boolean;
  padded?: boolean;
};

export const Accent = styled.span.attrs({ className: "accent--text" })``;

export const ExLink = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer"
})``;

/** General-purpose default container */
export const BaseContainer = styled.section``;

/** UI bordered section */
export const Card = styled(BaseContainer).attrs<{ className?: string }>(
  (props) => ({
    className: `card ${props.className || ""}`.trim()
  })
)`
  border: ${({ theme }) => `1px dotted ${theme.colors.semitransparent}`};
  border-radius: ${({ theme }) => `${theme.presets.round.sm}`};
  padding: 0 1em 1em;

  @media screen and (max-width: 768px) {
    padding: 0.4em;
  }
`;
export const CardTitle = styled.h4`
  border-bottom: 1px solid ${({ theme }) => theme.colors.semitransparent};
  height: 2.5em;
  line-height: 2.5em;
`;
export const CardSubitle = styled.h5`
  height: 2.1em;
  line-height: 2.1em;
`;

/** Page or View description element */
export const Description = styled.p<{ lines?: number }>`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ lines = 2 }) => lines};
  display: -webkit-box;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/** Error message container */
export const ErrorMessage = styled.aside.attrs({
  role: "alert",
  className: "error shake"
})`
  border-radius: ${({ theme }) => theme.presets.round.sm};
  padding: 0.4rem;
`;

/** Error message container */
export const WarningMessage = styled.aside.attrs({
  role: "alert",
  className: "warning bounce"
})`
  border-radius: ${({ theme }) => theme.presets.round.sm};
  padding: 0.4rem;
`;

/** Flex-container for displaying items in a row */
export const FlexRow = styled(BaseContainer)<FlexContainerProps>`
  align-items: center;
  display: ${({ inline }) => (inline ? "inline-" : "")}flex;
  padding: ${({ padded, theme }) => (padded ? theme.sizes.sm : 0)};
`;

/** Flex-container for displaying items in a column */
export const FlexColumn = styled(FlexRow)`
  flex-direction: column;

  > * {
    width: 100%;
  }
`;

export const Code = styled.code`
  font-family: monospace;
  padding: ${({ theme }) => theme.sizes.sm};
`;

export const GridContainer = styled.div<{ columns?: string; gap?: string }>`
  display: grid;
  grid-template-columns: ${({ columns = "auto auto" }) => columns};
  grid-gap: ${({ gap = 0 }) => gap};
`;

export const ItemDescription = styled.div`
  ${lineclamp(1)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: smaller;
  grid-column: 2 / -1;
  grid-row: 2;
  line-height: ${({ theme }) => theme.sizes.md};
  margin: 0;
  opacity: 0.7;
  padding: 0;
  text-shadow: none;
  width: 100%;

  > p {
    margin: 0;
  }
`;
type NameProps = PermissionProps & { polarity?: EventPolarity };
export const sharedListItemNameStyles = css`
  ${({ theme }) => theme.mixins.ellipsis};
  font-family: ${({ theme }) => theme.presets.fonts.heading};
  width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  .icon {
    display: inline-block;
    padding: ${({ theme }) => theme.sizes.xs};
    font-size: smaller;
    cursor: pointer;
  }
`;
export const ItemName = styled.b.attrs({
  role: "button",
  tabIndex: -1
})<NameProps>`
  color: ${({ polarity }) => EventPolarityColors(polarity)};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  grid-column: 2;
  grid-row: 1;
`;
export const GridItemName = styled.h6`
  align-self: flex-start;
  background: linear-gradient(0deg, #00000000, #000717ce);
  border-radius: ${({ theme }) => `${theme.sizes.xs} ${theme.sizes.xs} 0 0}`};
  color: white;
  display: grid;
  font-weight: normal;
  grid-template-columns: 32px auto;
  overflow: visible;
  padding: ${({ theme }) => theme.sizes.xs};
  text-shadow: 0 0 0.05rem #000717ce;
  white-space: normal;
  width: 100%;
`;

// Shared list item styles
const sharedListItemStyles = css`
  color: initial;
  column-gap: ${({ theme }) => theme.sizes.sm};
  cursor: pointer;
  display: grid;
  padding: ${({ theme }) => theme.sizes.xs};
  text-shadow: ${({ theme }) => theme.presets.elevate.xxs} #001125ec;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
    text-shadow: none;
  }
`;
export const sharedGridItemStyles = css`
  align-items: center;
  background-size: cover;
  background-position: center;
  border: ${({ theme }) =>
    `${theme.sizes.xs} solid ${theme.colors.semitransparent}`};
  border-radius: ${({ theme }) => theme.sizes.sm};
  color: inherit;
  justify-content: space-between;
  height: 25vh;
  padding: 0;
  transition: all 0.2s ease-in-out;
  width: 200px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }

  @media (max-width: 768px) {
    height: 30vh;
  }
`;
export const GridItemControls = styled(GridContainer)`
  align-self: flex-end;
  background: linear-gradient(180deg, #00000000, #000717ce);
  border-radius: ${({ theme }) => `0 0 ${theme.sizes.xs} ${theme.sizes.xs}`};
  color: white;
  grid-column-gap: ${({ theme }) => theme.sizes.xs};
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.sizes.xs} ${theme.sizes.sm}`};
  width: 100%;
`;
export const GridItemControl = styled(RoundButton).attrs({ size: "lg" })`
  &:hover {
    color: inherit;
    animation: scale-up 1s ease-in-out infinite;
  }
`;
// Shared ListItem grid container
type ItemProps = { columns?: string } & PermissionProps;
export const ItemGridContainer = styled(GridContainer)<ItemProps>`
  ${sharedListItemStyles}
  grid-template-columns: ${({ columns = "24px 10fr max-content" }) => columns};
  justify-content: space-between;

  .list-item {
    padding-right: 0;
  }
`;
// Shared ListItem link container
export const ItemLinkContainer = styled(Link).attrs({
  className: "list-item"
})<ItemProps>`
  ${sharedListItemStyles}
  grid-template-columns: ${({ columns = "24px 10fr 3fr" }) => columns};

  .delete {
    align-self: center;
    padding: ${({ theme }) => theme.sizes.xs};
    grid-row: 1/3;
  }
`;
// Shared ListItem World name
export const ItemWorldName = styled(ItemDescription)<{ public?: boolean }>`
  ${({ theme }) => theme.mixins.lineclamp(1)};
  align-self: center;
  color: ${({ theme, public: isPublic }) =>
    isPublic ? theme.colors.success : theme.colors.grey};
  font-size: 0.72rem;
  grid-column: 3;
  grid-row: 1/3;
  text-align: right;
  text-transform: uppercase;
  width: 100%;
`;

type PCProps = FlexContainerProps & { minHeight?: string };
export const PageContainer = styled(FlexColumn)<PCProps>`
  height: fit-content;
  justify-content: flex-start;
  padding: 0.5rem 0.5rem 0;
  margin: 0 auto;
  max-width: 1280px;
  min-height: ${({ minHeight = "70vh" }) => minHeight};
  text-align: left;
  width: 100%;

  > hr {
    background-color: ${({ theme }) => theme.colors.primary};
    border: 0;
    height: 1px;
    margin: 1.5rem 0;
    opacity: 0.6;
  }

  /* Content max-width 1280px above display resolution of 1200px */
  @media screen and (min-width: 1200px) {
    max-width: 1280px;
  }

  @media screen and (max-width: 1200px) {
    /* max-width: 90vmin; */
  }

  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

const pageTitleStyles = css`
  margin-bottom: 0;
  margin-top: 0.25rem;
`;
export const PageTitle = styled.h1.attrs({ className: "h3" })`
  ${pageTitleStyles}
`;
export const PageTitleVariable = styled.h1`
  ${pageTitleStyles}
`;

export const PageDescription = styled.div`
  font-size: smaller;
  line-height: ${({ theme }) => theme.sizes.md};
  margin: 0 0 1.5rem;
  opacity: 0.7;
  padding: 0;
`;

export const Figure = styled.figure`
  margin-bottom: ${({ theme }) => theme.sizes.md};

  img {
    max-width: 448px;
    height: auto;
    width: 100%;
  }
`;

export const BigValue = styled.div`
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
`;

export const CapsLabel = styled.div`
  color: #666;
  font-size: 0.8rem;
  text-transform: uppercase;
`;

export const DataColumn = styled(FlexColumn)`
  text-align: left;
  width: 50%;
`;

export const Section = styled(FlexColumn)`
  align-items: flex-start;
  min-height: 60vh;
  place-content: center;

  hr {
    background-color: ${({ theme }) => theme.colors.accent};
    border: 0;
    height: 1px;
    margin: 2rem 0;
    opacity: 0.7;
  }
`;

const Icon = styled.span`
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
    {...{ rest }}
  />
);

export const GridItem = styled(GridContainer)`
  background-color: inherit;
  border-top: 1px solid ${({ theme }) => theme.colors.semitransparent};
  grid-template-columns: ${({ columns = "auto 4.8rem" }) => columns};

  &:last-of-type {
    margin: 0;
  }

  &,
  a {
    border-radius: 4px;
    padding: 0.4rem;
  }
`;
export const GridItemTitle = styled.p`
  font-size: 1rem;
  font-weight: bold;
`;
