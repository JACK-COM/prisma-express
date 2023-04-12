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
import { listTimelines } from "graphql/requests/timelines.graphql";
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
    focusedTimeline: focusedTimeline,
    focusedWorld: focusedWorld,
    timelines = [],
    setGlobalTimeline,
    setGlobalTimelines
  } = useGlobalWorld(["focusedTimeline", "timelines"]);
  const loadTimelines = async () => {
    const params = userId > -0 ? { authorId: userId } : {};
    setGlobalTimelines(await listTimelines(params));
  };
  const clearComponentData = () => {
    clearGlobalModal();
    GlobalWorld.focusedTimeline(null);
  };
  const onEditTimeline = (timeline: APIData<Timeline>) => {
    setGlobalTimeline(timeline);
    setGlobalModal(MODAL.MANAGE_TIMELINE);
  };
  const onSelectTimeline = (timeline: APIData<Timeline>) => {
    setGlobalTimeline(timeline);
    navigate(insertId(TimelinePaths.Locations.path, timeline.id));
  };

  useEffect(() => {
    loadTimelines();
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="timeline-list">
      <header>
        <Breadcrumbs data={[TimelinePaths.Index]} />
        <PageTitle>{TimelinePaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Timelines</b> and realms here.
        </PageDescription>
      </header>

      <Card>
        <h3 className="h4">{authenticated ? "Your" : "Public"} Timelines</h3>
        {/* Empty List message */}
        {!timelines.length && (
          <EmptyText>
            A formless void, without <b>Timelines</b> to display
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {timelines.length > 5 && (
          <AddTimelineButton
            size="lg"
            icon="public"
            text="Create New Timeline"
            variant="outlined"
            onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
          />
        )}

        {/* List */}
        {focusedWorld && (
          <List
            data={timelines}
            itemText={(timeline: APIData<Timeline>) => (
              <TimelineItem
                world={focusedWorld}
                timeline={timeline}
                onEdit={onEditTimeline}
                onSelect={onSelectTimeline}
                permissions={timeline.authorId === userId ? "Author" : "Reader"}
              />
            )}
          />
        )}

        {/* Add new (button - bottom) */}
        {authenticated && (
          <AddTimelineButton
            size="lg"
            icon="public"
            text="Create New Timeline"
            variant={timelines.length > 5 ? "transparent" : "outlined"}
            onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
          />
        )}
      </Card>

      {/* Modal */}
      <CreateTimelineModal
        data={focusedTimeline}
        open={active === MODAL.MANAGE_WORLD}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default TimelinesList;
