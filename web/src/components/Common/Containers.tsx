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
export const Card = styled(BaseContainer).attrs({ className: "card" })`
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
export const ItemName = styled.b.attrs({
  role: "button",
  tabIndex: -1
})<NameProps>`
  color: ${({ polarity }) => EventPolarityColors(polarity)};
  grid-column: 2;
  grid-row: 1;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  width: fit-content;

  /* Experimental
  background: #10191839;
  border-radius: 4px;
  padding: 0 0.4rem;
  /* Experimental */

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

// Shared list item styles
const sharedListItemStyles = css`
  color: initial;
  column-gap: ${({ theme }) => theme.sizes.sm};
  cursor: pointer;
  display: grid;
  grid-template-columns: 24px 10fr max-content;
  padding: ${({ theme }) => theme.sizes.xs};
  text-shadow: ${({ theme }) => theme.presets.elevate.xxs} #001125ec;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
    text-shadow: none;
  }
`;
// Shared ListItem grid container
export const ItemGridContainer = styled(GridContainer)<PermissionProps>`
  ${sharedListItemStyles}
  justify-content: space-between;

  .list-item {
    padding-right: 0;
  }
`;
// Shared ListItem link container
export const ItemLinkContainer = styled(Link).attrs({
  className: "list-item"
})<PermissionProps>`
  ${sharedListItemStyles}

  .delete {
    align-self: center;
    padding: ${({ theme }) => theme.sizes.xs};
    grid-row: 1/3;
  }
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

export const PageTitle = styled.h1.attrs({ className: "h3" })`
  margin-bottom: 0;
  margin-top: 0.25rem;
`;

export const PageDescription = styled.div`
  font-size: smaller;
  line-height: ${({ theme }) => theme.sizes.md};
  margin: 0 0 1.5rem;
  opacity: 0.7;
  padding: 0;
  width: 100%;
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

const Icon = styled.span``;
export type MatIconProps = { icon: string } & ComponentPropsWithRef<"span">;
export const MatIcon = ({ icon, ...props }: MatIconProps) => (
  <Icon
    className={`material-icons ${props.className || ""}`.trim()}
    title={props.title || ""}
    onClick={props.onClick}
    children={icon}
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
