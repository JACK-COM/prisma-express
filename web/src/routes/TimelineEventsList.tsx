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
import ManageTimelineModal from "components/Modals/ManageTimelineModal";
import ListView from "components/Common/ListView";
// import TimelineItem from "components/TimelineItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { APIData, Timeline } from "utils/types";
import { useNavigate } from "react-router";
import { GlobalWorld } from "state";

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

/** ROUTE: List of worlds */
const TimelinesEventsList = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const navigate = useNavigate();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    focusedTimeline: focusedTimeline,
    worlds = [],
    setGlobalTimeline,
    setGlobalTimelines
  } = useGlobalWorld(["focusedTimeline", "worlds", "worldLocations"]);
  const loadTimelines = async () => {
    const params = userId > -0 ? { authorId: userId } : { public: true };
    setGlobalTimelines(await listTimelines(params));
  };
  const clearComponentData = () => {
    clearGlobalModal();
    GlobalWorld.focusedTimeline(null);
  };
  const onEditTimeline = (world: APIData<Timeline>) => {
    setGlobalTimeline(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };
  const onSelectTimeline = (world: APIData<Timeline>) => {
    // setGlobalTimeline(world);
    navigate(insertId(TimelinePaths.Locations.path, world.id));
  };

  useEffect(() => {
    loadTimelines();
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="timelines-list">
      <header>
        <Breadcrumbs data={[TimelinePaths.Index]} />
        <PageTitle>{TimelinePaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Timelines</b> here.
        </PageDescription>
      </header>

      <Card>
        <AddTimelineButton
          icon="plus"
          onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE)}
          text="Create Timeline"
        />
      </Card>

      {/* Modal */}
      <ManageTimelineModal
        data={focusedTimeline}
        open={active === MODAL.MANAGE_TIMELINE}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default TimelinesEventsList;
