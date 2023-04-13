import { useEffect, useMemo } from "react";
import styled from "styled-components";
import Breadcrumbs from "components/Common/Breadcrumbs";
import {
  Card,
  PageContainer,
  PageDescription,
  PageTitle
} from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useParams } from "react-router";
import { GlobalWorld } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { FormRow } from "components/Forms/Form";
import ManageWorldEventsModal from "components/Modals/ManageWorldEventsModal";
import ManageTimelineEventsModal from "components/Modals/ManageTimelineEventsModal";
import ListView from "components/Common/ListView";
import TimelineEventItem from "components/TimelineEventItem";
import { deleteTimelineEvent } from "graphql/requests/timelines.graphql";

const { Timelines: TimelinePaths } = Paths;
const AddEventButton = styled(ButtonWithIcon)`
  align-self: end;
`;

/** ROUTE: List of timeline events */
const TimelinesEventsList = () => {
  const { id: userId, role } = useGlobalUser(["id", "authenticated", "role"]);
  const { timelineId } = useParams<{ timelineId: string }>();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { focusedTimeline, focusedWorld, loadWorlds, updateTimelines } =
    useGlobalWorld(["focusedTimeline", "focusedWorld"]);
  const [crumbTitle, timelineEvents] = useMemo(
    () => [
      focusedTimeline
        ? `"${focusedTimeline.name}" Events`
        : TimelinePaths.Events.text,
      focusedTimeline?.TimelineEvents || []
    ],
    [focusedTimeline]
  );
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
  const deleteItem = async (itemId: number) => {
    const resp = await deleteTimelineEvent(itemId);
    if (!resp) return console.log("Timeline event was not deleted.");
    if (typeof resp === "string") return console.log(resp);
    updateTimelines([resp]);
    GlobalWorld.focusedTimeline(resp);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") => (
    <AddEventButton
      icon="add"
      size="lg"
      variant={variant}
      onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE_EVENTS)}
      text="Add Timeline Event"
    />
  );

  useEffect(() => {
    loadWorlds({ userId, timelineId: Number(timelineId) });
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="timelines-list">
      <header>
        <Breadcrumbs data={crumbs} />
        <PageTitle>
          {focusedTimeline?.name || TimelinePaths.Events.text}
        </PageTitle>
        <PageDescription>
          A <b>Timeline</b> in{" "}
          <b className="accent--text">{focusedWorld?.name || "A World"}</b>.
        </PageDescription>
      </header>

      <h3 className="h4">Timeline Events</h3>
      <Card>
        {/* Controls */}
        {controls(timelineEvents.length > 5 ? "transparent" : "outlined")}

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
        {(focusedTimeline?.TimelineEvents || [])?.length > 5 && controls()}
      </Card>

      <ManageTimelineEventsModal
        timelineId={Number(timelineId)}
        data={timelineEvents}
        open={active === MODAL.MANAGE_TIMELINE_EVENTS}
      />
    </PageContainer>
  );
};

export default TimelinesEventsList;
