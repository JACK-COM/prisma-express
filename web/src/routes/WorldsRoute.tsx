import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import WorldsListRoute from "./WorldsListRoute";
import { Suspense, lazy } from "react";
import FullScreenLoader from "components/Common/FullscreenLoader";

const WorldLocations = lazy(() => import("./WorldLocationsListRoute"));
const WorldLocationRoute = lazy(() => import("./WorldLocationRoute"));

/** Parent route for worlds-related content (public or user-created) */
const Worlds = () => {
  return (
    <Routes>
      {/* List of Worlds */}
      <Route index element={<WorldsListRoute />} />

      <Route
        // List of World Locations
        path={trimParent(Paths.Worlds.LocationsList.path, "worlds")}
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <WorldLocations />
          </Suspense>
        }
      />

      <Route
        // Explore a World Location
        path={trimParent(Paths.Worlds.ViewLocation.path, "worlds")}
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <WorldLocationRoute />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default Worlds;
