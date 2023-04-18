import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useParams } from "react-router";
import { GlobalWorld } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import ManageTimelineEventsModal from "components/Modals/ManageTimelineEventsModal";
import ListView from "components/Common/ListView";
import TimelineEventItem from "components/TimelineEventItem";
import { deleteTimelineEvent } from "graphql/requests/timelines.graphql";
import { loadTimelines } from "hooks/loadUserData";
import { APIData, Timeline, World } from "utils/types";

const { Timelines: TimelinePaths } = Paths;
const AddEventButton = styled(ButtonWithIcon)`
  align-self: end;
`;

type TimelinesEventsListProps = {
  focusedTimeline?: APIData<Timeline> | null;
};

/** @component List of timeline events */
const TimelinesEventsList = (props: TimelinesEventsListProps) => {
  const { focusedTimeline } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { timelineId } = useParams<{ timelineId: string }>();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { updateTimelines } = useGlobalWorld([]);
  const role = useMemo(
    () => (userId === focusedTimeline?.authorId ? "Author" : "Reader"),
    [focusedTimeline]
  );
  const [crumbTitle, timelineEvents] = useMemo(() => {
    const { name = "Timeline", TimelineEvents = [] } = focusedTimeline || {};
    return [`${name} Events`, TimelineEvents];
  }, [focusedTimeline]);
  const crumbs = [
    TimelinePaths.Index,
    {
      text: crumbTitle,
      path: insertId(TimelinePaths.Events.path, Number(timelineId))
    }
  ];
  const clearComponentData = () => {
    clearGlobalModal();
    GlobalWorld.focusedTimeline(null);
  };
  const deleteItem = async (itemId: number) => {
    const resp = await deleteTimelineEvent(itemId);
    if (!resp) return console.log("Timeline event was not deleted.");
    if (typeof resp === "string") return console.log(resp);
    updateTimelines([resp]);
    GlobalWorld.focusedTimeline(resp);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") =>
    role === "Author" ? (
      <AddEventButton
        icon="add"
        size="lg"
        variant={variant}
        onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE_EVENTS)}
        text="Add Timeline Event"
      />
    ) : null;

  useEffect(() => {
    loadTimelines({ timelineId: Number(timelineId) });
    return () => clearComponentData();
  }, []);

  return (
    <>
      <Card>
        <CardTitle>Timeline Events</CardTitle>
        {/* Controls */}
        {authenticated && timelineEvents.length > 5 && controls("transparent")}

        {/* <List> */}
        {timelineEvents.length > 0 && (
          <ListView
            data={timelineEvents}
            itemText={(item) => (
              <TimelineEventItem
                key={item.id}
                showDescription
                timelineEvent={item}
                onSelect={() => setGlobalModal(MODAL.MANAGE_TIMELINE_EVENTS)}
                onRemove={() => deleteItem(item.id)}
                permissions={role}
              />
            )}
          />
        )}

        {/* Controls */}
        {authenticated && controls()}
      </Card>

      {active === MODAL.MANAGE_TIMELINE_EVENTS && (
        <ManageTimelineEventsModal
          open
          timelineId={Number(timelineId)}
          data={timelineEvents}
        />
      )}
    </>
  );
};

export default TimelinesEventsList;
