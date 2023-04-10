import styled from "styled-components";
import { StyledLink } from "components/Forms/Button";
import ImageLoader from "./ImageLoader";

type GridImageLinkProps = {
  image: string;
  title: string;
  href: string;
  order?: "image-first" | "title-first";
};

const Title = styled.p.attrs({ className: "h6" })`
  line-height: 2.2;
`;
const LinkContainer = styled(StyledLink)<{ order?: string }>`
  border: 1px solid ${({ theme }) => theme.colors.accent};
  color: initial;
  display: grid;
  grid-template-columns: 1fr;

  ${ImageLoader} {
    order: ${({ order = "image-first" }) => (order === "image-first" ? 1 : 2)};
    border: inherit;
  }
  ${Title} {
    order: ${({ order = "image-first" }) => (order === "image-first" ? 2 : 1)};
  }
`;

/**
 * `GridImageLink` is an image with a title that links to a page. It doesn't have a max width.
 * @param props
 * @returns `GridImageLink`
 */
const GridImageLink = (props: GridImageLinkProps) => {
  const { image, title, href, order, ...rest } = props;

  return (
    <LinkContainer variant="transparent" to={href} order={order} {...rest}>
      <ImageLoader width="100%" src={image} alt={title} />
      <Title>{title}</Title>
    </LinkContainer>
  );
};

export default GridImageLink;
