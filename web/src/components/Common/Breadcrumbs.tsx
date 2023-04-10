import { useMatch } from "react-router";
import { Paths, RouteDef } from "routes";
import { FlexRow, GridContainer, MatIcon } from "./Containers";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled(GridContainer)`
  align-self: flex-start;
  align-items: center;
  font-size: smaller;
  opacity: 0.9;
  width: fit-content;
`;

type BreadcrumbsProps = { data: RouteDef[] };

/** Application path breadcrumb container */
const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { data } = props;
  const crumbs = [Paths.Dashboard.Index, ...data]
  const active = data.filter(({ path }) => useMatch(path) !== null);

  return (
    <Container columns={`repeat(${crumbs.length}, max-content)`}>
      {crumbs.map(({ path, text }, i) => (
        <FlexRow key={path}>
          {path === active[0]?.path ? text : <Link to={path}>{text}</Link>}
          {i < crumbs.length - 1 && <MatIcon icon="chevron_right" />}
        </FlexRow>
      ))}
    </Container>
  );
};

export default Breadcrumbs;
