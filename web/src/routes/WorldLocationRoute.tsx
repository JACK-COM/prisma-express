import { useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  Accent,
  Card,
  CardTitle,
  GridContainer,
  PageDescription
} from "components/Common/Containers";
import { LinkWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import { UserRole } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useParams } from "react-router";
import { WorldPublicIcon, iconForWorld } from "components/ComponentIcons";
import PageLayout from "components/Common/PageLayout";
import {
  GlobalCharacter,
  addGlobalExplorations,
  clearGlobalCharacter,
  clearGlobalModal,
  clearGlobalWorld,
  setGlobalLocation
} from "state";
import CharactersList from "components/List.Characters";
import LocationActions from "components/LocationActions";
import ExplorationsList from "components/List.Explorations";
import useGlobalExploration from "hooks/GlobalExploration";
import { listExplorations } from "graphql/requests/explorations.graphql";

const { Worlds: WorldPaths } = Paths;
const PageGrid = styled(GridContainer)`
  grid-template-columns: 4fr 1.5fr;
  @media (max-width: 768px) {
    display: block;
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
  margin-top: 1.5rem;
`;
const Sidebar = styled.div`
  grid-row: 1 / span 2;
  grid-column: 2;
`;

type Params = { worldId: string; locationId: string };
/** @route A single World `Location` */
const WorldLocationRoute = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const glExploration = useGlobalExploration(["explorations", "exploration"]);
  const glWorld = useGlobalWorld(["focusedWorld", "focusedLocation"]);
  const { focusedLocation, focusedWorld } = glWorld;
  const { explorations = [], exploration } = glExploration;
  const { worldId: wid, locationId: lid } = useParams<Params>();
  const worldId = Number(wid);
  const locationId = Number(lid);
  const [place, isPublic, publicClass, isAuthor, worldIcon] = useMemo(() => {
    const author = focusedLocation?.authorId === userId;
    const isPub = focusedWorld?.public;
    const role = author ? "Author" : ("Reader" as UserRole);
    return [
      focusedLocation?.name || WorldPaths.ViewLocation.text,
      isPub,
      isPub ? "success--text" : "error--text",
      author,
      focusedWorld && <WorldPublicIcon data={focusedWorld} permissions={role} />
    ];
  }, [focusedWorld, focusedLocation]);
  const worldName = focusedWorld?.name || "a World";
  const description =
    JSON.stringify(focusedLocation?.description) ||
    `Explore <b>${place}</b> in <b>${worldName}</b>`;
  const worldPublic = useMemo(() => {
    return `${isPublic ? "PUBLIC" : "PRIVATE"} ${focusedLocation?.type}`;
  }, [focusedWorld, focusedLocation]);
  const localExplorations = useMemo(() => {
    return explorations.filter((e) => e.locationId === locationId);
  }, [explorations, locationId]);
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const loadComponentData = async () => {
    const params: any = {};
    if (!isNaN(worldId)) params.worldId = worldId;
    if (!isNaN(locationId)) params.locationId = locationId;
    const list = await listExplorations(params);
    addGlobalExplorations(list);
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
        breadcrumbs={[WorldPaths.Index, WorldPaths.LocationsList]}
        title={Title}
        description={`(<b class="${publicClass}">${worldPublic}</b>) ${description}`}
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
      breadcrumbs={[WorldPaths.Index, WorldPaths.LocationsList]}
      title={Title}
      description={`(<b class="${publicClass}">${worldPublic}</b>) ${description}`}
    >
      <PageGrid gap="0.6rem">
        <ExplorationsList showControls explorations={localExplorations} />

        <Card>
          <CardTitle>
            What's <Accent>here</Accent>?
          </CardTitle>
          <p>
            Choose a <Accent as="b">Scenario</Accent> to explore this location
          </p>

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
        <Sidebar>
          {authenticated && (isAuthor || isPublic) && (
            <>
              <LocationActions />
              <hr />
            </>
          )}

          <Card>
            <CardTitle>
              <span className="ellipsis">{focusedWorld.name}</span>
            </CardTitle>
            <Description
              dangerouslySetInnerHTML={{ __html: focusedWorld.description }}
            />
            <GoToWorld
              icon={iconForWorld(focusedWorld.type)}
              href={insertId(WorldPaths.LocationsList.path, Number(worldId))}
              text={`Back to ${focusedWorld.type}`}
              title={`Return to ${focusedWorld.type}`}
              variant="outlined"
            />
          </Card>
          <hr />
          <CharactersList />
        </Sidebar>
      </PageGrid>
    </PageLayout>
  );
};

export default WorldLocationRoute;
