import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import WorldsListRoute from "./WorldsList";
import WorldLocations from "./WorldLocationsList";

const { Worlds: WorldPaths } = Paths;

/** All worlds (public or user-created) */
const Worlds = () => {
  return (
    <Routes>
      <Route index element={<WorldsListRoute />} />

      <Route
        path={trimParent(WorldPaths.Locations.path, "worlds")}
        element={<WorldLocations />}
      />
    </Routes>
  );
};

export default Worlds;
