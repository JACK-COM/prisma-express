import { useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  Accent,
  Card,
  CardTitle,
  GridContainer,
  MatIcon,
  PageDescription
} from "components/Common/Containers";
import {
  ButtonWithIcon,
  LinkWithIcon,
  RoundButton
} from "components/Forms/Button";
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
const PlaceDescription = styled(PageDescription)`
  font-style: italic;
  padding-left: ${({ theme }) => theme.sizes.sm};
  margin-top: 1.5rem;
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
          <CardTitle>
            Explore <Accent>{place}</Accent>
          </CardTitle>
          <PlaceDescription
            as="blockquote"
            className="location-description"
            dangerouslySetInnerHTML={{ __html: focusedLocation?.description }}
          />

          <CardTitle>
            To <Accent>do</Accent>?
          </CardTitle>
          <ol>
            <li>
              <b>Author:</b> Create an <b>Exploration</b> for this location; may
              generate from any <b>Book</b> linked here.
            </li>
            <li>
              <b>Reader:</b> Choose a <b>Scenario</b> to explore this location
            </li>
          </ol>

          <CardTitle>
            Build an <Accent>Exploration</Accent> scenario
          </CardTitle>
          <ol>
            <li>
              Select a <b>Book</b> linked to this location
            </li>
            <li>
              <b>Select Scene to build:</b>
              <ol>
                <li>Choose background</li>
                <li>Place foreground elems (templates = elem slots?)</li>
                <li>[ Auto-insert any content-links as scene choices ]</li>
              </ol>
            </li>
          </ol>

          <CardTitle>Notes</CardTitle>
          <ol>
            <li>
              Requires new{" "}
              <Accent>
                <b>Content Viewer</b>
              </Accent>
            </li>
            <li>
              <Accent>Exploration</Accent> will be named after book
            </li>
            <li>
              Content is default viewed scene-by-scene: enable{" "}
              <Accent>add content-links</Accent> here
            </li>
            <li>
              <b>Storyboard Component</b> preview chapter + scene outline
            </li>
          </ol>
        </Card>

        {/* Sidebar */}
        <div>
          {authenticated && (isAuthor || isPublic) && (
            <>
              <Card>
                <CardTitle>
                  <RoundButton
                    variant="transparent"
                    size="md"
                    onClick={() => setGlobalModal(MODAL.MANAGE_LOCATION)}
                  >
                    <MatIcon className="accent--text" icon="settings" />
                  </RoundButton>
                  Manage <Accent>Location</Accent>
                </CardTitle>
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
                  onClick={() => setGlobalModal(MODAL.CREATE_BOOK)}
                />
                <hr className="transparent" />
              </Card>
              <hr />
            </>
          )}

          <Card>
            <CardTitle>
              {focusedWorld.name} <Accent>({focusedWorld.type})</Accent>
            </CardTitle>
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
