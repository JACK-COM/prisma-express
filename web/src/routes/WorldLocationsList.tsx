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
    selectedWorld,
    selectedLocation,
    worldLocations = [],
    clearGlobalWorld,
    setGlobalWorld,
    setGlobalLocation,
    setGlobalLocations
  } = useGlobalWorld([
    "selectedWorld",
    "selectedLocation",
    "worlds",
    "worldLocations"
  ]);
  const role = useMemo<UserRole>(
    () => (selectedWorld?.authorId === id ? "Author" : "Reader"),
    [id]
  );
  const [error, setError] = useState<string>();
  const { worldId } = useParams<{ worldId: string }>();
  const place = useMemo(
    () => selectedWorld?.name || WorldPaths.Locations.text,
    [selectedWorld]
  );
  const publicClass = useMemo(
    () => (selectedWorld?.public ? "success--text" : "error--text"),
    [selectedWorld]
  );
  const loadComponentData = async () => {
    const wId = Number(worldId);
    if (isNaN(Number(worldId)) || selectedWorld?.id === wId) return;
    const [[world], locations] = await Promise.all([
      selectedWorld ? [selectedWorld] : listWorlds({ id: Number(worldId) }),
      listLocations({ worldId: Number(worldId) })
    ]);
    if (!world) setError("World not found");
    else {
      if (world !== selectedWorld) setGlobalWorld(world);
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
          {selectedWorld && (
            <WorldPublicIcon
              data={selectedWorld}
              permissions={selectedWorld.authorId === id ? "Author" : "Reader"}
            />
          )}

          {place}
        </PageTitle>

        <PageDescription>
          (
          <b className={publicClass}>
            {selectedWorld?.public ? "PUBLIC" : "PRIVATE"}
          </b>
          ) All <b>unique story settings</b> in{" "}
          <b>{selectedWorld?.name || "a world ... if it exists"}</b>
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

        {selectedWorld && (
          <List
            data={worldLocations}
            itemText={(location: APIData<Location>) => (
              <LocationItem
                world={selectedWorld}
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

      {selectedWorld && (
        <ManageLocationModal
          data={selectedLocation}
          open={activeModal === MODAL.MANAGE_LOCATION}
          onClose={clearModalData}
          worldId={selectedWorld.id}
        />
      )}
    </PageContainer>
  );
};

export default WorldLocationsList;
