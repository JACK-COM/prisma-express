import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Card, CardTitle, GridContainer } from "components/Common/Containers";
import { ButtonWithIcon, LinkWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { UserRole } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useParams } from "react-router";
import { WorldPublicIcon } from "components/ComponentIcons";
import { loadCharacters, loadWorld } from "api/loadUserData";
import PageLayout from "components/Common/PageLayout";
import { loadTimelines } from "api/loadUserData";
import {
  GlobalCharacter,
  GlobalWorld,
  clearGlobalCharacter,
  clearGlobalWorld,
  setGlobalLocation
} from "state";
import CharactersList from "components/List.Characters";

const { Worlds: WorldPaths } = Paths;
const AddItemButton = styled(ButtonWithIcon)`
  align-self: end;
  width: 100%;
`;
const PageGrid = styled(GridContainer)`
  grid-template-columns: 4fr 1.5fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const Description = styled.div`
  padding: 0.5rem 0;
`;
const GoToWorld = styled(LinkWithIcon)`
  margin-top: 0.5rem;
  width: 100%;
`;
const Cardinality = styled(GridContainer)`
  grid-template-columns:
    auto
    1fr 1fr
    auto;
  grid-template-rows: auto;
`;

type Params = { worldId: string; locationId: string };
/** @route A single World `Location` */
const WorldLocationRoute = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    focusedLocation,
    focusedWorld,
    timelines = []
  } = useGlobalWorld(["focusedWorld", "focusedLocation", "timelines"]);
  const { worldId, locationId } = useParams<Params>();
  const worldTimelines = useMemo(
    () =>
      Boolean(worldId) && timelines.length > 0
        ? timelines.filter(({ worldId: wid }) => wid === Number(worldId))
        : [],
    [timelines]
  );
  const [place, isPublic, publicClass, isAuthor, worldIcon] = useMemo(() => {
    const author = focusedLocation?.authorId === userId;
    const isPub = focusedWorld?.public;
    const role = author ? "Author" : ("Reader" as UserRole);
    return [
      focusedLocation?.name || WorldPaths.ExploreLocation.text,
      isPub,
      isPub ? "success--text" : "error--text",
      author,
      focusedWorld && <WorldPublicIcon data={focusedWorld} permissions={role} />
    ];
  }, [focusedWorld, focusedLocation]);
  const worldName = focusedWorld?.name || "a World";
  const worldPublic = useMemo(() => {
    return `${isPublic ? "PUBLIC" : "PRIVATE"} ${focusedLocation?.type}`;
  }, [focusedWorld, focusedLocation]);
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const loadComponentData = async () => {
    await Promise.all([
      loadWorld({ worldId: Number(worldId) }),
      loadTimelines({ worldId: Number(worldId) }),
      loadCharacters({ worldId: Number(worldId) })
    ]);
    const { focusedLocation: nfl, focusedWorld: fw } = GlobalWorld.getState();
    if (nfl) return;
    const lid = Number(locationId);
    const focusNext = fw?.Locations.find(({ id }) => id === lid);
    if (focusNext) setGlobalLocation(focusNext);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
    clearGlobalCharacter();
    GlobalCharacter.characters([]);
  };
  const Title = (
    <>
      {worldIcon} {place}
    </>
  );

  useEffect(() => {
    loadComponentData();
    return clearComponentData;
  }, []);

  if (!focusedLocation || !focusedWorld)
    return (
      <PageLayout
        id="world-locations"
        breadcrumbs={[WorldPaths.Index, WorldPaths.Locations]}
        title={Title}
        description={`(<b class="${publicClass}">${worldPublic}</b>) Explore <b>${place}</b> in <b>${worldName}</b>`}
      >
        <Card className="fill">
          <CardTitle>{place}</CardTitle>
          <Description>No world or location found</Description>
        </Card>
      </PageLayout>
    );

  return (
    <PageLayout
      id="world-locations"
      breadcrumbs={[WorldPaths.Index, WorldPaths.Locations]}
      title={Title}
      description={`(<b class="${publicClass}">${worldPublic}</b>) Explore <b>${place}</b> in <b>${worldName}</b>`}
    >
      <PageGrid className="fill" gap="0.6rem">
        <Card>
          <CardTitle>{place}</CardTitle>
          <Description
            dangerouslySetInnerHTML={{ __html: focusedLocation?.description }}
          />
          <Cardinality gap="0.5rem">
            <span>North</span>
            <span>West</span>
            <span>East</span>
            <span>South</span>
          </Cardinality>

          <CardTitle>TO DO</CardTitle>
          <ol>
            <li>
              Select location type (<b>irreversible!</b>)
            </li>
            <li>Add rules for location-type</li>
            <li>Build + Save map for location type</li>
            <li>
              <b>Explore!</b>
            </li>
          </ol>
        </Card>

        {/* Sidebar */}
        <div>
          {authenticated && (isAuthor || isPublic) && (
            <>
              <Card>
                <CardTitle>Location Actions</CardTitle>
                <AddItemButton
                  icon="face"
                  text="Add a Character"
                  variant="outlined"
                  onClick={() => setGlobalModal(MODAL.MANAGE_CHARACTER)}
                />
                <hr className="transparent" />
                <AddItemButton
                  icon="book"
                  text="Add Book"
                  variant="outlined"
                  onClick={() => setGlobalModal(MODAL.MANAGE_BOOK)}
                />
                <hr className="transparent" />
              </Card>
              <hr />
            </>
          )}

          <Card>
            <CardTitle>{focusedWorld.name}</CardTitle>
            <Description
              dangerouslySetInnerHTML={{ __html: focusedWorld.description }}
            />
            <GoToWorld
              icon="public"
              text="Back to world"
              href={insertId(WorldPaths.Locations.path, Number(worldId))}
              title={`Back to ${focusedWorld.name}`}
              variant="outlined"
            />
          </Card>
          <hr />
          <CharactersList />
        </div>
      </PageGrid>
    </PageLayout>
  );
};

export default WorldLocationRoute;
