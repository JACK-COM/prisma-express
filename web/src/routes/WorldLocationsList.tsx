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
import { listWorlds } from "../graphql/requests/worlds.graphql";
import CreateWorldModal from "components/Modals/ManageWorldModal";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Location, World } from "utils/types";
import ListView from "components/Common/ListView";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate, useParams } from "react-router";
import LocationItem from "../components/LocationItem";
import WorldPublicIcon from "components/WorldPublicIcon";

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
  const { role } = useGlobalUser(["role"]);
  const navigate = useNavigate();
  const {
    active: activeModal,
    clearGlobalModal,
    setGlobalModal,
    MODAL
  } = useGlobalModal();
  const {
    selectedWorld,
    worldLocations = [],
    setGlobalWorld,
    setGlobalLocation
  } = useGlobalWorld(["selectedWorld", "worldLocations"]);
  const [error, setError] = useState<string>();
  const { worldId } = useParams<{ worldId: string }>();
  const place = useMemo(() => selectedWorld?.name || "World", [selectedWorld]);
  const loadComponentData = async () => {
    if (selectedWorld || !worldId || isNaN(Number(worldId))) return;
    const [world] = await listWorlds({ id: Number(worldId) });
    setGlobalWorld(world);
    if (!world) setError("World not found");
  };
  const clearComponentData = () => {
    setGlobalWorld(null);
    clearGlobalModal();
  };
  const onEditLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
    setGlobalModal(MODAL.MANAGE_LOCATION);
  };
  const onSelectLocation = ({ id }: APIData<Location>) => {
    navigate(insertId(WorldPaths.Locations.path, id));
  };

  useEffect(() => {
    loadComponentData();
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer>
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
              Locations in
              {selectedWorld && (
                <WorldPublicIcon world={selectedWorld} permissions={role} />
              )}
              {place}
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
        <AddLocationButton
          size="lg"
          icon="pin_drop"
          text="Add a Location"
          variant={worldLocations.length > 5 ? "transparent" : "outlined"}
          onClick={() => setGlobalModal(MODAL.MANAGE_LOCATION)}
        />
      </Card>

      <CreateWorldModal
        data={selectedWorld}
        open={activeModal === MODAL.MANAGE_LOCATION}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default WorldLocationsList;
