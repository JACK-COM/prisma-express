import Breadcrumbs from "components/Common/Breadcrumbs";
import { PageContainer, PageTitle } from "components/Common/Containers";
import { StyledLink } from "components/Forms/Button";
import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";

const { Worlds: WorldPaths } = Paths;

const WorldsHome = () => {
  return (
    <PageContainer>
      <Breadcrumbs data={[WorldPaths.Index]} />
      <PageTitle>{WorldPaths.Index.text}</PageTitle>
      <p>
        These are your <b>Worlds</b>
      </p>
      <StyledLink to={WorldPaths.Locations.path}>Go away</StyledLink>
    </PageContainer>
  );
};

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

const trim = (str: string) => trimParent(str, "worlds");

const Worlds = () => {
  return (
    <Routes>
      <Route index element={<WorldsHome />} />
      <Route
        path={trim(WorldPaths.Locations.path)}
        element={<WorldLocations />}
      />
    </Routes>
  );
};

export default Worlds;
