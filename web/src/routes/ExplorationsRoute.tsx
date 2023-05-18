import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import { Suspense, lazy } from "react";
import FullScreenLoader from "components/Common/FullscreenLoader";

const ExplorationBuilderRoute = lazy(() => import("./ExplorationBuilder"));
const ExplorationsListRoute = lazy(() => import("./ExplorationsListRoute"));

/** Parent route for worlds-related content (public or user-created) */
const Explorations = () => {
  return (
    <Routes>
      {/* List of Explorations */}
      <Route
        index
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <ExplorationsListRoute />
          </Suspense>
        }
      />

      <Route
        // Build a Exploration Location
        path={trimParent(Paths.Explorations.Build.path, "explorations")}
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <ExplorationBuilderRoute />
          </Suspense>
        }
      />

      <Route
        // Explore a Exploration Location
        path={trimParent(Paths.Explorations.Run.path, "explorations")}
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <ExplorationBuilderRoute />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default Explorations;
