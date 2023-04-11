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
import { Paths, insertId } from "routes";
import { listWorlds } from "graphql/requests/worlds.graphql";
import CreateWorldModal from "components/Modals/ManageWorldModal";
import ListView from "components/Common/ListView";
import WorldItem from "components/WorldItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, UserRole, World } from "utils/types";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate } from "react-router";
import { clearGlobalWorld } from "state";

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
  const navigate = useNavigate();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    selectedWorld,
    worlds = [],
    setGlobalWorld,
    setGlobalWorlds
  } = useGlobalWorld(["selectedWorld", "worlds", "worldLocations"]);
  const loadWorlds = async () => {
    const params = userId > -0 ? { authorId: userId } : { public: true };
    setGlobalWorlds(await listWorlds(params));
  };
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalWorld();
  };
  const onEditWorld = (world: APIData<World>) => {
    setGlobalWorld(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };
  const onSelectWorld = (world: APIData<World>) => {
    // setGlobalWorld(world);
    navigate(insertId(WorldPaths.Locations.path, world.id));
  };

  useEffect(() => {
    loadWorlds();
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

      <Card>
        <h3 className="h4">{authenticated ? "Your" : "Public"} Worlds</h3>
        {/* Empty List message */}
        {!worlds.length && (
          <EmptyText>
            A formless void, without <b>Worlds</b> to display
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {worlds.length > 5 && (
          <AddWorldButton
            size="lg"
            icon="public"
            text="Create New World"
            variant="outlined"
            onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
          />
        )}

        {/* List */}
        <List
          data={worlds}
          itemText={(world: APIData<World>) => (
            <WorldItem
              world={world}
              onEdit={onEditWorld}
              // onSelect={onSelectWorld}
              permissions={world.authorId === userId ? "Author" : "Reader"}
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && (
          <AddWorldButton
            size="lg"
            icon="public"
            text="Create New World"
            variant={worlds.length > 5 ? "transparent" : "outlined"}
            onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
          />
        )}
      </Card>

      {/* Modal */}
      <CreateWorldModal
        data={selectedWorld}
        open={active === MODAL.MANAGE_WORLD}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default WorldsList;
