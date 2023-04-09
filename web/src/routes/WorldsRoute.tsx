import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import WorldsList from "./WorldsList";
import WorldLocations from "./WorldLocationsList";

const { Worlds: WorldPaths } = Paths;
const trim = (str: string) => trimParent(str, "worlds");

const Worlds = () => {
  return (
    <Routes>
      <Route index element={<WorldsList />} />

      <Route
        path={trim(WorldPaths.Locations.path)}
        element={<WorldLocations />}
      />
    </Routes>
  );
};

export default Worlds;
