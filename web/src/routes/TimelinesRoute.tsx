import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import { lazy } from "react";

const { Timelines } = Paths;
const TimelinesListRoute = lazy(() => import("./TimelinesList"));
const TimelineEventsList = lazy(() => import("./TimelineEventsList"));

/** All `Timelines` created for a `World` */
const TimelinesRoute = () => {
  return (
    <Routes>
      <Route index element={<TimelinesListRoute />} />

      <Route
        path={trimParent(Timelines.Events.path, "timelines")}
        element={<TimelineEventsList />}
      />
    </Routes>
  );
};

export default TimelinesRoute;
