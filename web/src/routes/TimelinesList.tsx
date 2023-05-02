import { useEffect } from "react";
import { Paths } from "routes";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalWorld } from "hooks/GlobalWorld";
import PageLayout from "components/Common/PageLayout";
import { loadTimelines } from "api/loadUserData";
import TimelinesList from "components/List.Timelines";

const { Timelines: TimelinePaths } = Paths;

/** @route List of timelines */
const TimelinesListRoute = () => {
  const { id: userId } = useGlobalUser(["id", "authenticated"]);
  const { focusedTimeline, timelines = [] } = useGlobalWorld([
    "focusedTimeline",
    "timelines"
  ]);

  useEffect(() => {
    loadTimelines({ userId });
  }, []);

  return (
    <PageLayout
      id="timeline-list"
      breadcrumbs={[TimelinePaths.Index]}
      title={TimelinePaths.Index.text}
      description="Create or manage your <b>Timelines</b> and <b>Events</b> here."
    >
      <TimelinesList timelines={timelines} focusedTimeline={focusedTimeline} />
    </PageLayout>
  );
};

export default TimelinesListRoute;
