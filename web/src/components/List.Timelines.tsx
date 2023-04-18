import { useEffect } from "react";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import CreateTimelineModal from "components/Modals/ManageTimelineModal";
import ListView from "components/Common/ListView";
import TimelineItem from "components/TimelineItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Timeline } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate } from "react-router";
import { GlobalWorld } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { loadTimelines } from "hooks/loadUserData";

const { Timelines: TimelinePaths } = Paths;
const AddTimelineButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

type TimelinesListProps = {
  timelines?: APIData<Timeline>[];
  focusedTimeline?: APIData<Timeline> | null;
};

/** @component List of timelines */
const TimelinesList = (props: TimelinesListProps) => {
  const { focusedTimeline, timelines = [] } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const navigate = useNavigate();
  const clearComponentData = () => clearGlobalModal();
  const onEditTimeline = (timeline: APIData<Timeline>) => {
    GlobalWorld.focusedTimeline(timeline);
    setGlobalModal(MODAL.MANAGE_TIMELINE);
  };
  const onSelectTimeline = (timeline: APIData<Timeline>) => {
    navigate(insertId(TimelinePaths.Events.path, timeline.id));
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") => (
    <AddTimelineButton
      size="lg"
      icon="timeline"
      text="Create New Timeline"
      variant={variant}
      onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE)}
    />
  );

  useEffect(() => {
    loadTimelines({ userId });
    return () => clearComponentData();
  }, []);

  return (
    <>
      <Card>
        <CardTitle>{authenticated ? "Your" : "Public"} Timelines</CardTitle>

        {/* Empty List message */}
        {!timelines.length && (
          <EmptyText>
            Before <b>Events</b> or even <b>Time</b> existed, there was only the{" "}
            <b>Creator</b>.
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {authenticated && timelines.length > 5 && controls("transparent")}

        {/* List */}
        <List
          data={timelines}
          itemText={(timeline: APIData<Timeline>) => (
            <TimelineItem
              timeline={timeline}
              onEdit={onEditTimeline}
              onSelect={onSelectTimeline}
              permissions={timeline.authorId === userId ? "Author" : "Reader"}
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && controls()}
      </Card>

      {/* Modal */}
      <CreateTimelineModal
        data={focusedTimeline}
        open={active === MODAL.MANAGE_TIMELINE}
        onClose={clearComponentData}
      />
    </>
  );
};

export default TimelinesList;
