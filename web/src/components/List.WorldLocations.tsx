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
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import {
  GlobalWorld,
  clearGlobalModal,
  clearGlobalWorld,
  setGlobalLocation,
  setGlobalModal
} from "state";
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

/** @component List of a World's `Child Worlds` and `Locations`  */
const WorldLocationsList = (props: WorldLocationsListProps) => {
  const {
    focusedWorld,
    focusedLocation,
    worldLocations = [],
    showDescription
  } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, MODAL } = useGlobalModal();
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
      insertId(Paths.Worlds.ViewLocation.path, location.id, "locationId"),
      focusedWorld.id,
      "worldId"
    );
    navigate(url);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") =>
    authenticated && (
      <AddItemButton
        icon="pin_drop"
        text="Create New Location"
        size="lg"
        variant={variant}
        onClick={() => {
          GlobalWorld.focusedLocation(null);
          setGlobalModal(MODAL.MANAGE_LOCATION);
        }}
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

  if (!worldLocations.length) {
    return (
      <Card>
        <CardTitle>Locations</CardTitle>
        <EmptyText>
          {!focusedWorld && worldId ? (
            "This world may be private or deleted."
          ) : (
            <>
              <span>
                Before <b>Locations</b> existed, or even the <b>characters</b>{" "}
                that lived in them, there was an empty space.
              </span>
              <span>The Creator's mind stirred restlessly...</span>

              {/* Add new (button - top) */}
              {controls("outlined")}
            </>
          )}
        </EmptyText>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Locations</CardTitle>

      {showDescription && (
        <PageDescription as="p">
          All locations in <b className="accent--text">{focusedWorld?.name}</b>.
        </PageDescription>
      )}

      {focusedWorld && (
        /* Locations List */
        <List
          data={parentLocations}
          dummyFirstItem={controls("outlined")}
          dummyLastItem={controls("transparent")}
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
    </Card>
  );
};

export default WorldLocationsList;
