import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Breadcrumbs from "components/Common/Breadcrumbs";
import {
  Card,
  PageContainer,
  PageDescription,
  PageTitle
} from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import { listLocations, listWorlds } from "../graphql/requests/worlds.graphql";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Location, UserRole, World } from "utils/types";
import ListView from "components/Common/ListView";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useParams } from "react-router";
import LocationItem from "../components/LocationItem";
import { WorldPublicIcon } from "components/ComponentIcons";
import ManageLocationModal from "components/Modals/ManageLocationModal";

const { Worlds: WorldPaths } = Paths;
const AddLocationButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  display: flex;
  flex-direction: column;
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

/** ROUTE: List of World `Locations` */
const WorldLocationsList = () => {
  const { id, authenticated } = useGlobalUser(["id", "authenticated"]);
  const {
    active: activeModal,
    clearGlobalModal,
    setGlobalModal,
    MODAL
  } = useGlobalModal();
  const {
    focusedWorld: focusedWorld,
    focusedLocation: focusedLocation,
    worldLocations = [],
    clearGlobalWorld,
    setGlobalWorld,
    setGlobalLocation,
    setGlobalLocations
  } = useGlobalWorld([
    "focusedWorld",
    "focusedLocation",
    "worlds",
    "worldLocations"
  ]);
  const role = useMemo<UserRole>(
    () => (focusedWorld?.authorId === id ? "Author" : "Reader"),
    [id]
  );
  const [error, setError] = useState<string>();
  const { worldId } = useParams<{ worldId: string }>();
  const place = useMemo(
    () => focusedWorld?.name || WorldPaths.Locations.text,
    [focusedWorld]
  );
  const publicClass = useMemo(
    () => (focusedWorld?.public ? "success--text" : "error--text"),
    [focusedWorld]
  );
  const loadComponentData = async () => {
    const wId = Number(worldId);
    if (isNaN(Number(worldId)) || focusedWorld?.id === wId) return;
    const [[world], locations] = await Promise.all([
      focusedWorld ? [focusedWorld] : listWorlds({ id: Number(worldId) }),
      listLocations({ worldId: Number(worldId) })
    ]);
    if (!world) setError("World not found");
    else {
      if (world !== focusedWorld) setGlobalWorld(world);
      setGlobalLocations(locations);
    }
  };
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const onEditLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
    setGlobalModal(MODAL.MANAGE_LOCATION);
  };
  const onSelectLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
  };

  useEffect(() => {
    loadComponentData();
    return clearComponentData;
  }, []);

  return (
    <PageContainer id="world-locations">
      <header>
        <Breadcrumbs data={[WorldPaths.Index, WorldPaths.Locations]} />
        <PageTitle>
          {focusedWorld && (
            <WorldPublicIcon
              data={focusedWorld}
              permissions={focusedWorld.authorId === id ? "Author" : "Reader"}
            />
          )}

          {place}
        </PageTitle>

        <PageDescription>
          (
          <b className={publicClass}>
            {focusedWorld?.public ? "PUBLIC" : "PRIVATE"}
          </b>
          ) All <b>unique story settings</b> in{" "}
          <b>{focusedWorld?.name || "a world ... if it exists"}</b>
        </PageDescription>
      </header>

      <Card>
        <h3 className="h4 flex">{error || <>All Locations</>}</h3>
        {/* List */}
        {!worldLocations.length && (
          <EmptyText>
            {error ? (
              "This world may be private or deleted."
            ) : (
              <>
                <span>
                  A chaotic space, before <b>Locations</b>, or the beings that
                  inhabit them, were created.
                </span>
                <span>The Creator's mind stirred restlessly...</span>
              </>
            )}
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {worldLocations.length > 5 && (
          <AddLocationButton
            size="lg"
            icon="pin_drop"
            text="Add a Location"
            variant="outlined"
            onClick={() => setGlobalModal(MODAL.MANAGE_LOCATION)}
          />
        )}

        {focusedWorld && (
          <List
            data={worldLocations}
            itemText={(location: APIData<Location>) => (
              <LocationItem
                world={focusedWorld}
                location={location}
                onEdit={onEditLocation}
                onSelect={onSelectLocation}
                permissions={role}
              />
            )}
          />
        )}

        {/* Add new (button - bottom) */}
        {authenticated && (
          <AddLocationButton
            size="lg"
            icon="pin_drop"
            text="Add a Location"
            variant={worldLocations.length > 5 ? "transparent" : "outlined"}
            onClick={() => setGlobalModal(MODAL.MANAGE_LOCATION)}
          />
        )}
      </Card>

      {focusedWorld && (
        <ManageLocationModal
          data={focusedLocation}
          open={activeModal === MODAL.MANAGE_LOCATION}
          onClose={clearModalData}
          worldId={focusedWorld.id}
        />
      )}
    </PageContainer>
  );
};

export default WorldLocationsList;
