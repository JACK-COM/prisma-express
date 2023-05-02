import { useEffect, useMemo } from "react";
import { PageDescription } from "components/Common/Containers";
import { Paths, insertId } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useParams } from "react-router";
import { GlobalWorld } from "state";
import { loadTimelines } from "api/loadUserData";
import PageLayout from "components/Common/PageLayout";
import TimelinesEventsList from "components/List.TimelineEvents";

const { Timelines: TimelinePaths } = Paths;

/** @route List of events in a single timeline */
const TimelinesEventsListRoute = () => {
  const { timelineId } = useParams<{ timelineId: string }>();
  const { clearGlobalModal } = useGlobalModal();
  const { focusedTimeline, focusedWorld } = useGlobalWorld([
    "focusedTimeline",
    "focusedWorld"
  ]);
  const timelineName = focusedTimeline?.name || "Timeline";
  const worldName = focusedWorld?.name || "A World";
  const crumbTitle = useMemo(() => `${timelineName} Events`, [focusedTimeline]);
  const crumbs = [
    TimelinePaths.Index,
    {
      text: `${crumbTitle}`,
      path: insertId(TimelinePaths.Events.path, Number(timelineId))
    }
  ];
  const clearComponentData = () => {
    clearGlobalModal();
    GlobalWorld.focusedTimeline(null);
  };

  useEffect(() => {
    loadTimelines({ timelineId: Number(timelineId) });
    return () => clearComponentData();
  }, []);

  return (
    <PageLayout id="timelines-list" title={timelineName} breadcrumbs={crumbs}>
      <PageDescription>
        A <b>Timeline</b> in <b className="accent--text">{worldName}</b>.
      </PageDescription>

      <TimelinesEventsList focusedTimeline={focusedTimeline} />
    </PageLayout>
  );
};

export default TimelinesEventsListRoute;
