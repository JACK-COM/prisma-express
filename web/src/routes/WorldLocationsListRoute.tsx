import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Card, CardTitle, GridContainer } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { UserRole } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useParams } from "react-router";
import { WorldPublicIcon } from "components/ComponentIcons";
import { loadCharacters, loadWorld } from "api/loadUserData";
import WorldLocationsList from "../components/List.WorldLocations";
import PageLayout from "components/Common/PageLayout";
import TimelinesList from "components/List.Timelines";
import { loadTimelines } from "api/loadUserData";
import {
  GlobalCharacter,
  GlobalWorldInstanceKey,
  MODAL,
  clearGlobalCharacter,
  clearGlobalModal,
  clearGlobalWorld,
  setGlobalLocation
} from "state";
import CharactersList from "components/List.Characters";
import WorldsList from "components/List.Worlds";
import WorldActions from "components/WorldActions";
import ExplorationsList from "components/List.Explorations";
import useGlobalExploration from "hooks/GlobalExploration";

const { Worlds: WorldPaths } = Paths;
const PageGrid = styled(GridContainer)`
  grid-template-columns: 4fr 1.5fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const wkeys: GlobalWorldInstanceKey[] = [
  "focusedLocation",
  "focusedTimeline",
  "focusedWorld",
  "timelines",
  "worldLocations"
];

/** @route List of World `Locations` */
const WorldLocationsListRoute = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { explorations = [] } = useGlobalExploration(["explorations"]);
  const {
    focusedLocation,
    focusedTimeline,
    focusedWorld,
    timelines = [],
    worldLocations = []
  } = useGlobalWorld(wkeys);
  const { worldId: wid } = useParams<{ worldId: string }>();
  const worldId = useMemo(() => Number(wid), [wid]);
  const worldTimelines = useMemo(
    () => timelines.filter(({ worldId: w }) => w === worldId),
    [timelines]
  );
  const localExplorations = useMemo(() => {
    return explorations.filter((e) => e.worldId === worldId);
  }, [explorations, worldId]);
  const [place, isPublic, publicClass, isAuthor, worldIcon] = useMemo(() => {
    const author = focusedWorld?.authorId === userId;
    const isPub = focusedWorld?.public;
    const role = author ? "Author" : ("Reader" as UserRole);
    return [
      focusedWorld?.name || WorldPaths.LocationsList.text,
      isPub,
      isPub ? "success--text" : "error--text",
      author,
      focusedWorld && <WorldPublicIcon data={focusedWorld} permissions={role} />
    ];
  }, [focusedWorld]);
  const [ChildWorlds, worldDesc] = useMemo(() => {
    if (!focusedWorld) return [[], "All <b>unique locations</b>"];
    return [focusedWorld.ChildWorlds, focusedWorld.description];
  }, [focusedWorld]);
  const worldType = `${focusedWorld?.public ? "PUBLIC" : "PRIVATE"} ${
    focusedWorld?.type
  }`;
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
    clearGlobalCharacter();
    GlobalCharacter.characters([]);
  };
  const PageTitle = (
    <>
      {worldIcon} {place}
    </>
  );

  useEffect(() => clearComponentData, [worldId]);

  return (
    <PageLayout
      id="world-locations"
      breadcrumbs={[WorldPaths.Index, WorldPaths.LocationsList]}
      title={PageTitle}
      description={`(<b class="${publicClass}">${worldType}</b>) ${worldDesc}`}
    >
      <PageGrid className="fill" gap="0.6rem">
        <section>
          <ExplorationsList showControls explorations={localExplorations} />
          {ChildWorlds.length > 0 && (
            <>
              <WorldsList worlds={ChildWorlds} focusedWorld={focusedWorld} />
              <hr className="transparent" />
            </>
          )}

          <WorldLocationsList
            showDescription
            focusedWorld={focusedWorld}
            focusedLocation={focusedLocation}
            worldLocations={worldLocations}
          />
        </section>

        <aside>
          {authenticated && (isAuthor || isPublic) && (
            <>
              <WorldActions />
              <hr className="transparent" />
            </>
          )}

          {(focusedWorld?.Events ?? []).length > 0 && (
            <TimelinesList
              timelines={worldTimelines}
              focusedTimeline={focusedTimeline}
            />
          )}

          <hr className="transparent" />
          <CharactersList />
        </aside>
      </PageGrid>
    </PageLayout>
  );
};

export default WorldLocationsListRoute;
