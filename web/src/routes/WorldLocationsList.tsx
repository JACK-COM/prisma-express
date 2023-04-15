import { useEffect, useMemo } from "react";
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
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Location, UserRole } from "utils/types";
import ListView from "components/Common/ListView";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useParams } from "react-router";
import LocationItem from "../components/LocationItem";
import { WorldPublicIcon } from "components/ComponentIcons";
import ManageLocationModal from "components/Modals/ManageLocationModal";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { FormRow } from "components/Forms/Form";
import ManageWorldEventsModal from "components/Modals/ManageWorldEventsModal";
import ManageCharacterModal from "components/Modals/ManageCharacterModal";

const { Worlds: WorldPaths } = Paths;
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

/** ROUTE: List of World `Locations` */
const WorldLocationsList = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const {
    active: activeModal,
    clearGlobalModal,
    setGlobalModal,
    MODAL
  } = useGlobalModal();
  const {
    focusedWorld,
    focusedLocation,
    worldLocations = [],
    clearGlobalWorld,
    setGlobalLocation,
    loadUserData
  } = useGlobalWorld(["focusedWorld", "focusedLocation", "worldLocations"]);
  const { worldId } = useParams<{ worldId: string }>();
  const [place, isPublic, publicClass, isAuthor, role] = useMemo(() => {
    const author = focusedWorld?.authorId === userId;
    const isPub = focusedWorld?.public;
    return [
      focusedWorld?.name || WorldPaths.Locations.text,
      isPub,
      isPub ? "success--text" : "error--text",
      author,
      author ? "Author" : ("Reader" as UserRole)
    ];
  }, [focusedWorld]);
  const loadComponentData = async () => {
    loadUserData({ worldId: Number(worldId) });
  };
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const onEditLocation = (location: APIData<Location>) => {
    setGlobalLocation(location);
    setGlobalModal(MODAL.MANAGE_LOCATION);
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
            <WorldPublicIcon data={focusedWorld} permissions={role} />
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

      {isAuthor && (
        <>
          <h3 className="h4 flex">World Actions</h3>
          <FormRow columns="repeat(2,1fr)" style={{ marginBottom: "1.5rem" }}>
            <AddItemButton
              icon="face"
              text="Add a Character"
              variant="outlined"
              onClick={() => setGlobalModal(MODAL.MANAGE_CHARACTER)}
            />
            <AddItemButton
              icon="timeline"
              text="Add World Event"
              variant="outlined"
              onClick={() => setGlobalModal(MODAL.MANAGE_TIMELINE)}
            />
          </FormRow>
        </>
      )}

      <h3 className="h4 flex">All Locations</h3>
      <Card>
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

        {/* Add new (button - top) */}
        {authenticated &&
          controls(worldLocations.length > 5 ? "transparent" : "outlined")}

        {focusedWorld && (
          <List
            data={worldLocations}
            itemText={(location: APIData<Location>) => (
              <LocationItem
                world={focusedWorld}
                location={location}
                onEdit={onEditLocation}
                onSelect={onEditLocation}
                permissions={location.authorId === userId ? "Author" : "Reader"}
              />
            )}
          />
        )}

        {/* Add new (button - bottom) */}
        {authenticated && worldLocations.length > 5 && controls()}
      </Card>

      {/* Modals */}
      {focusedWorld && (
        <>
          <ManageLocationModal
            // Locations
            data={focusedLocation}
            open={activeModal === MODAL.MANAGE_LOCATION}
            onClose={clearModalData}
            worldId={focusedWorld.id}
          />
          <ManageWorldEventsModal
            // World Events
            data={focusedWorld.Events}
            open={activeModal === MODAL.MANAGE_TIMELINE}
          />
          <ManageCharacterModal
            // Characters
            open={activeModal === MODAL.MANAGE_CHARACTER}
          />
        </>
      )}
    </PageContainer>
  );
};

export default WorldLocationsList;
