import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import WorldsList from "./WorldsList";
import WorldLocations from "./WorldLocationsList";

const { Worlds: WorldPaths } = Paths;

/** All worlds (public or user-created) */
const Worlds = () => {
  return (
    <Routes>
      <Route index element={<WorldsList />} />

      <Route
        path={trimParent(WorldPaths.Locations.path, "worlds")}
        element={<WorldLocations />}
      />
    </Routes>
  );
};

export default Worlds;
