import { useEffect } from "react";
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
import CreateWorldModal from "components/Modals/ManageWorldModal";
import ListView from "components/Common/ListView";
import WorldItem from "components/WorldItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, World } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { clearGlobalWorld } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";

const { Worlds: WorldPaths } = Paths;
const AddWorldButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

/** ROUTE: List of worlds */
const WorldsList = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    focusedWorld,
    worlds = [],
    setGlobalWorld
  } = useGlobalWorld(["focusedWorld", "worlds", "worldLocations"]);
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalWorld();
  };
  const onEditWorld = (world: APIData<World>) => {
    setGlobalWorld(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") => (
    <>
      <AddWorldButton
        icon="public"
        size="lg"
        text="Create New World"
        variant={variant}
        onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
      />
    </>
  );

  useEffect(() => {
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="world-list">
      <header>
        <Breadcrumbs data={[WorldPaths.Index]} />
        <PageTitle>{WorldPaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Worlds</b> and realms here.
        </PageDescription>
      </header>

      <h3 className="h4">{authenticated ? "Your" : "Public"} Worlds</h3>
      <Card>
        {/* Empty List message */}
        {!worlds.length && (
          <EmptyText>
            A formless void, without <b>Worlds</b> to display
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {controls("transparent")}

        {/* List */}
        <List
          data={worlds}
          itemText={(world: APIData<World>) => (
            <WorldItem
              world={world}
              onEdit={onEditWorld}
              permissions={world.authorId === userId ? "Author" : "Reader"}
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && worlds.length > 5 && controls()}
      </Card>

      {/* Modal */}
      <CreateWorldModal
        data={focusedWorld}
        open={active === MODAL.MANAGE_WORLD}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default WorldsList;
