import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import TimelinesList from "./TimelinesList";
import TimelineEventsList from "./TimelineEventsList";

const { Timelines } = Paths;
const trim = (str: string) => trimParent(str, "worlds");

/** All `Timelines` created for a `World` */
const TimelinesRoute = () => {
  return (
    <Routes>
      <Route /* index route */ index element={<TimelinesList />} />

      <Route
        // Events in timeline
        path={trim(Timelines.Events.path)}
        element={<TimelineEventsList />}
      />
    </Routes>
  );
};

export default TimelinesRoute;
