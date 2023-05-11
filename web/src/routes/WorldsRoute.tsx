import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import WorldsListRoute from "./WorldsListRoute";
import WorldLocations from "./WorldLocationsListRoute";
import WorldLocationRoute from "./WorldLocationRoute";

/** Parent route for worlds-related content (public or user-created) */
const Worlds = () => {
  return (
    <Routes>
      {/* List of Worlds */}
      <Route index element={<WorldsListRoute />} />

      <Route
        // List of World Locations
        path={trimParent(Paths.Worlds.Locations.path, "worlds")}
        element={<WorldLocations />}
      />

      <Route
        // Explore a World Location
        path={trimParent(Paths.Worlds.ExploreLocation.path, "worlds")}
        element={<WorldLocationRoute />}
      />
    </Routes>
  );
};

export default Worlds;
