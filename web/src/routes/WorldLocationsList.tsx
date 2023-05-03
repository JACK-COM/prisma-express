import { useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  Card,
  CardTitle,
  GridContainer,
  PageDescription
} from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { UserRole } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useParams } from "react-router";
import { WorldPublicIcon } from "components/ComponentIcons";
import { loadWorld } from "api/loadUserData";
import WorldLocationsList from "../components/List.WorldLocations";
import PageLayout from "components/Common/PageLayout";
import TimelinesList from "components/List.Timelines";
import { loadTimelines } from "api/loadUserData";

const { Worlds: WorldPaths } = Paths;
const AddItemButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const PageGrid = styled(GridContainer)`
  grid-template-columns: 4fr 1.5fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/** @route List of World `Locations` */
const WorldLocationsListRoute = () => {
  const { id: userId } = useGlobalUser(["id"]);
  const { clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    clearGlobalWorld,
    setGlobalLocation,
    focusedLocation,
    focusedWorld,
    focusedTimeline,
    timelines = [],
    worldLocations = []
  } = useGlobalWorld([
    "focusedWorld",
    "focusedLocation",
    "focusedTimeline",
    "timelines",
    "worldLocations"
  ]);
  const { worldId } = useParams<{ worldId: string }>();
  const worldTimelines = useMemo(
    () =>
      Boolean(worldId) && timelines.length > 0
        ? timelines.filter(({ worldId: wid }) => wid === Number(worldId))
        : [],
    [timelines]
  );
  const [place, isPublic, publicClass, isAuthor, role] = useMemo(() => {
    const author = focusedWorld?.authorId === userId;
    const isPub = focusedWorld?.public;
    return [
      focusedWorld?.name || WorldPaths.Locations.text,
      isPub,
      isPub ? "success--text" : "error--text",
      author,
      author ? "Author" : ("Reader" as UserRole)
    ];
  }, [focusedWorld]);
  const worldName = focusedWorld?.name || "a World";
  const worldPublic = focusedWorld?.public ? "PUBLIC" : "PRIVATE";
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const loadComponentData = async () => {
    await Promise.all([
      loadWorld({ worldId: Number(worldId) }),
      loadTimelines({ worldId: Number(worldId) })
    ]);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
  };
  const worldIcon = useMemo(
    () =>
      focusedWorld ? (
        <WorldPublicIcon data={focusedWorld} permissions={role} />
      ) : (
        <></>
      ),
    [focusedWorld]
  );

  useEffect(() => {
    loadComponentData();
    return clearComponentData;
  }, []);

  return (
    <PageLayout
      id="world-locations"
      breadcrumbs={[WorldPaths.Index, WorldPaths.Locations]}
      title={
        <>
          {worldIcon} {place}
        </>
      }
      description={`(<b class="${publicClass}">${worldPublic}</b>) All <b>unique story settings</b> in <b>${worldName}</b>`}
    >
      <PageGrid gap="0.6rem">
        <WorldLocationsList
          focusedWorld={focusedWorld}
          focusedLocation={focusedLocation}
          worldLocations={worldLocations}
        />

        <div>
          {(isAuthor || isPublic) && (
            <Card>
              <CardTitle>World Actions</CardTitle>
              <GridContainer columns="1fr" style={{ marginBottom: "1.5rem" }}>
                <AddItemButton
                  icon="face"
                  text="Add a Character"
                  variant="outlined"
                  onClick={() => setGlobalModal(MODAL.MANAGE_CHARACTER)}
                />
                <hr />
                <AddItemButton
                  icon="manage_history"
                  text="Add World Event"
                  variant="outlined"
                  onClick={() => setGlobalModal(MODAL.MANAGE_WORLD_EVENTS)}
                />
                <hr />
                <AddItemButton
                  icon="timeline"
                  text="Add Timeline"
                  variant="outlined"
                  onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE)}
                />
              </GridContainer>
            </Card>
          )}

          <hr />

          <TimelinesList
            timelines={worldTimelines}
            focusedTimeline={focusedTimeline}
          />
        </div>
      </PageGrid>
    </PageLayout>
  );
};

export default WorldLocationsListRoute;
