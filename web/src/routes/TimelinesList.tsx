import { useEffect } from "react";
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
import CreateTimelineModal from "components/Modals/ManageTimelineModal";
import ListView from "components/Common/ListView";
import TimelineItem from "components/TimelineItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Timeline } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate } from "react-router";
import { GlobalWorld } from "state";
import { useGlobalWorld } from "hooks/GlobalWorld";

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

/** ROUTE: List of timelines */
const TimelinesList = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const navigate = useNavigate();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    focusedTimeline,
    timelines = [],
    loadUserData: loadTimelines
  } = useGlobalWorld(["focusedTimeline", "timelines"]);
  const clearComponentData = () => clearGlobalModal();
  const onEditTimeline = (timeline: APIData<Timeline>) => {
    GlobalWorld.focusedTimeline(timeline);
    setGlobalModal(MODAL.MANAGE_TIMELINE);
  };
  const onSelectTimeline = (timeline: APIData<Timeline>) => {
    navigate(insertId(TimelinePaths.Events.path, timeline.id));
  };

  useEffect(() => {
    loadTimelines({ userId });
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="timeline-list">
      <header>
        <Breadcrumbs data={[TimelinePaths.Index]} />
        <PageTitle>{TimelinePaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Timelines</b> and <b>Events</b> here.
        </PageDescription>
      </header>

      <h3 className="h4">{authenticated ? "Your" : "Public"} Timelines</h3>
      <Card>
        {/* Empty List message */}
        {!timelines.length && (
          <EmptyText>
            Before <b>Events</b> or even <b>Time</b> existed, there was only the{" "}
            <b>Creator</b>.
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {timelines.length > 5 && (
          <AddTimelineButton
            size="lg"
            icon="public"
            text="Create New Timeline"
            variant="outlined"
            onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE)}
          />
        )}

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
        {authenticated && (
          <AddTimelineButton
            size="lg"
            icon="public"
            text="Create New Timeline"
            variant={timelines.length > 5 ? "transparent" : "outlined"}
            onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE)}
          />
        )}
      </Card>

      {/* Modal */}
      <CreateTimelineModal
        data={focusedTimeline}
        open={active === MODAL.MANAGE_TIMELINE}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default TimelinesList;
