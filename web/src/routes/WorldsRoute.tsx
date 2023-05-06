import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import WorldsListRoute from "./WorldsList";
import WorldLocations from "./WorldLocationsList";
import WorldLocationRoute from "./WorldLocationRoute";

/** All worlds (public or user-created) */
const Worlds = () => {
  return (
    <Routes>
      <Route index element={<WorldsListRoute />} />

      <Route
        path={trimParent(Paths.Worlds.Locations.path, "worlds")}
        element={<WorldLocations />}
      />

      <Route
        path={trimParent(Paths.Worlds.ExploreLocation.path, "worlds")}
        element={<WorldLocationRoute />}
      />
    </Routes>
  );
};

export default Worlds;
