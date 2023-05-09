import { useMemo } from "react";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { GlobalWorld, updateAsError } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import ManageTimelineEventsModal from "components/Modals/ManageTimelineEventsModal";
import ListView from "components/Common/ListView";
import TimelineEventItem from "components/TimelineEventItem";
import { deleteTimelineEvent } from "graphql/requests/timelines.graphql";
import { APIData, Timeline, UserRole } from "utils/types";

const AddEventButton = styled(ButtonWithIcon)`
  align-self: end;
`;

type TimelinesEventsListProps = {
  focusedTimeline?: APIData<Timeline> | null;
  className?: string;
};

/** @component List of timeline events */
const TimelinesEventsList = (props: TimelinesEventsListProps) => {
  const { focusedTimeline, className } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, setGlobalModal, MODAL } = useGlobalModal();
  const { updateTimelines } = useGlobalWorld([]);
  const [timelineId, role, crumbTitle, timelineEvents] = useMemo(() => {
    const { authorId, id, name = "Timeline" } = focusedTimeline || {};
    const userRole: UserRole = userId === authorId ? "Author" : "Reader";
    const events = focusedTimeline?.TimelineEvents || [];
    return [id, userRole, `${name} Events`, events];
  }, [focusedTimeline]);
  const deleteItem = async (itemId: number) => {
    const resp = await deleteTimelineEvent(itemId);
    if (typeof resp === "string") return updateAsError(resp);
    if (!resp) return updateAsError("Timeline event was not deleted.");
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

  return (
    <>
      <Card className={className}>
        <CardTitle>{crumbTitle}</CardTitle>
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
