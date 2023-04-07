import styled from "styled-components";

type FlexContainerProps = {
  inline?: boolean;
  padded?: boolean;
};

export const ExLink = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer"
})``;

/** General-purpose default container */
export const BaseContainer = styled.section``;

/** Page or View description element */
export const Description = styled.p<{ lines?: number }>`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ lines = 2 }) => lines};
  display: -webkit-box;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
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

type PCProps = FlexContainerProps & { minHeight?: string };
export const PageContainer = styled(FlexColumn)<PCProps>`
  height: fit-content;
  justify-content: flex-start;
  margin: 0 auto;
  max-width: 1280px;
  min-height: ${({ minHeight = "70vh" }) => minHeight};
  text-align: left;

  > hr {
    background-color: ${({ theme }) => theme.colors.primary};
    border: 0;
    height: 1px;
    margin: 1.5rem 0;
    opacity: 0.6;
  }

  @media screen and (min-width: 1200px) {
    max-width: 1280px;
  }

  @media screen and (max-width: 1200px) {
    max-width: 90vmin;
  }

  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

export const PageTitle = styled.h1.attrs({ className: "h3" })`
  margin-bottom: 0.25rem;
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

const Icon = styled.span.attrs({ className: "material-icons" })``;
export const MatIcon = ({ icon }: { icon: string }) => <Icon>{icon}</Icon>;

export const GridItem = styled(GridContainer)`
  background-color: inherit;
  border: 1px solid #232325;
  grid-template-columns: ${({ columns = "auto 4.8rem" }) => columns};
  margin-bottom: 1rem;

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
