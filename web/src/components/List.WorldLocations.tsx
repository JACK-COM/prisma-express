import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Card, CardTitle, PageDescription } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Location, World } from "utils/types";
import ListView from "components/Common/ListView";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate, useParams } from "react-router";
import LocationItem from "./LocationItem";
import ManageLocationModal from "components/Modals/ManageLocationModal";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import ManageWorldEventsModal from "components/Modals/ManageWorldEventsModal";
import { clearGlobalWorld, setGlobalLocation } from "state";
import groupBy from "lodash.groupby";
import { Paths, insertId } from "routes";

const AddItemButton = styled(ButtonWithIcon)`
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

type WorldLocationsListProps = {
  focusedLocation?: APIData<Location> | null;
  focusedWorld?: APIData<World> | null;
  worldLocations?: APIData<Location>[];
  showDescription?: boolean;
};

/** @component List of World `Locations` */
const WorldLocationsList = (props: WorldLocationsListProps) => {
  const {
    focusedWorld,
    focusedLocation,
    worldLocations = [],
    showDescription
  } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const onEditLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
    setGlobalModal(MODAL.MANAGE_LOCATION);
  };
  const goToLocation = (location: APIData<Location>) => {
    if (!focusedWorld) return;
    setGlobalLocation(location);
    const url = insertId(
      insertId(Paths.Worlds.ExploreLocation.path, location.id, "locationId"),
      focusedWorld.id,
      "worldId"
    );
    navigate(url);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") => (
    <AddItemButton
      icon="pin_drop"
      text="Add Location"
      size="lg"
      variant={variant}
      onClick={() => setGlobalModal(MODAL.MANAGE_LOCATION)}
    />
  );
  const [parentLocations, childLocations] = useMemo(() => {
    const g = groupBy(worldLocations, "parentLocationId");
    const all = Object.values(g);
    const lastIndex = all.length - 1;
    const p = all[lastIndex] || [];
    const gl = new Map<number, APIData<Location>[]>();
    all
      .filter((x, l) => l !== lastIndex)
      .forEach((x) => {
        gl.set(x[0].parentLocationId as number, x);
      });
    return [p, gl];
  }, [worldLocations]);

  useEffect(() => {
    return clearComponentData;
  }, []);

  return (
    <>
      <Card>
        <CardTitle>Places</CardTitle>
        {/* List */}
        {!worldLocations.length && (
          <EmptyText>
            {!focusedWorld && worldId ? (
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

        {showDescription && (
          <PageDescription>
            <p>
              <b>{focusedWorld?.name}:</b>{" "}
              <span>{focusedWorld?.description}</span>
            </p>
          </PageDescription>
        )}

        {/* Add new (button - top) */}
        {authenticated &&
          controls(parentLocations.length > 5 ? "transparent" : "outlined")}

        {focusedWorld && (
          <List
            data={parentLocations}
            itemText={(location: APIData<Location>) => (
              <LocationItem
                world={focusedWorld}
                location={location}
                childLocations={childLocations.get(location.id)}
                onEdit={onEditLocation}
                onSelect={goToLocation}
                permissions={location.authorId === userId ? "Author" : "Reader"}
              />
            )}
          />
        )}

        {/* Add new (button - bottom) */}
        {authenticated && parentLocations.length > 5 && controls()}
      </Card>

      {/* Modals */}
      {focusedWorld && (
        <>
          <ManageLocationModal
            // Locations
            data={focusedLocation}
            open={active === MODAL.MANAGE_LOCATION}
            onClose={clearModalData}
            worldId={focusedWorld.id}
          />

          <ManageWorldEventsModal
            // World Events
            data={focusedWorld.Events}
            open={active === MODAL.MANAGE_WORLD_EVENTS}
          />
        </>
      )}
    </>
  );
};

export default WorldLocationsList;
