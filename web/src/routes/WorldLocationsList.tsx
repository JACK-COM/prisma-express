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
import { Paths, insertId } from "routes";
// import {} from "../graphql/requests/locations.graphql";
import { listLocations, listWorlds } from "../graphql/requests/worlds.graphql";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Location, World } from "utils/types";
import ListView from "components/Common/ListView";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate, useParams } from "react-router";
import LocationItem from "../components/LocationItem";
import WorldPublicIcon from "components/WorldPublicIcon";
import ManageLocationModal from "components/Modals/ManageLocationModal";

const { Worlds: WorldPaths } = Paths;
const AddLocationButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

/** ROUTE: List of World `Locations` */
const WorldLocationsList = () => {
  const { role, authenticated } = useGlobalUser(["role", "authenticated"]);
  const navigate = useNavigate();
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
    setGlobalWorld,
    setGlobalLocation,
    setGlobalLocations
  } = useGlobalWorld(["selectedWorld", "selectedLocation", "worldLocations"]);
  const [error, setError] = useState<string>();
  const { worldId } = useParams<{ worldId: string }>();
  const place = useMemo(() => selectedWorld?.name || "World", [selectedWorld]);
  const loadComponentData = async () => {
    if (!worldId || isNaN(Number(worldId))) return;
    const [[world], locations] = await Promise.all([
      selectedWorld ? [selectedWorld] : listWorlds({ id: Number(worldId) }),
      listLocations({ worldId: Number(worldId) })
    ]);
    if (!world) setError("World not found");
    else {
      setGlobalWorld(world);
      setGlobalLocations(locations);
    }
  };
  const clearModalData = () => {
    setGlobalLocation(null);
    clearGlobalModal();
  };
  const clearComponentData = () => {
    clearModalData();
    setGlobalWorld(null);
    setGlobalLocations([]);
  };
  const onEditLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
    setGlobalModal(MODAL.MANAGE_LOCATION);
  };
  const onSelectLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
  };

  useEffect(() => {
    loadComponentData();
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="world-locations">
      <header>
        <Breadcrumbs data={[WorldPaths.Index, WorldPaths.Locations]} />
        <PageTitle>{WorldPaths.Locations.text}</PageTitle>
        <PageDescription>
          All <b>Locations</b> (unique story settings) in{" "}
          <b>{selectedWorld?.name || "a world ... if it exists"}</b>
        </PageDescription>
      </header>

      <Card>
        <h3 className="h4 flex">
          {error || (
            <>
              {selectedWorld && (
                <WorldPublicIcon world={selectedWorld} permissions={role} />
              )}
              {place} Locations
            </>
          )}
        </h3>
        {/* List */}
        {!worldLocations.length && (
          <EmptyText>
            {error ? (
              "This world may be private or deleted."
            ) : (
              <>
                A chaotic space with no <b>Locations</b> to be found. The
                Creator considered the space; its mind stirred restlessly.
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
