import Breadcrumbs from "components/Common/Breadcrumbs";
import { PageContainer, PageTitle } from "components/Common/Containers";
import { StyledLink } from "components/Forms/Button";
import { Paths } from "routes";

const { Worlds: WorldPaths } = Paths;

const WorldLocations = () => {
  return (
    <PageContainer>
      <Breadcrumbs data={Object.values(WorldPaths)} />
      <PageTitle>{WorldPaths.Locations.text}</PageTitle>
      <p>
        These are <b>Locations</b>
      </p>
      <StyledLink to={WorldPaths.Locations.path}>Go away</StyledLink>
    </PageContainer>
  );
};

export default WorldLocations;
