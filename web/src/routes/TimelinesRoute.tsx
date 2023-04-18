import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import TimelinesListRoute from "./TimelinesList";
import TimelineEventsList from "./TimelineEventsList";

const { Timelines } = Paths;

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
