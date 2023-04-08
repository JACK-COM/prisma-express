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
import { Paths, replaceId } from "routes";
import { listWorlds } from "graphql/requests/worlds.graphql";
import CreateWorldModal from "components/Modals/CreateWorldModal";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, World } from "utils/types";
import ListView from "components/Common/ListView";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { useNavigate } from "react-router";
import { WorldItem } from "../components/WorldItem";

const { Worlds: WorldPaths } = Paths;
const AddWorldButton = styled(ButtonWithIcon).attrs({ variant: "outlined" })`
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
  const { id, role } = useGlobalUser(["id", "role"]);
  const navigate = useNavigate();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { selectedWorld, worlds, setGlobalWorld, setGlobalWorlds } =
    useGlobalWorld(["selectedWorld", "worlds"]);
  const loadWorlds = async () => setGlobalWorlds(await listWorlds());
  const onEditWorld = (world: APIData<World>) => {
    setGlobalWorld(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };
  const onSelectWorld = ({ id }: APIData<World>) => {
    navigate(replaceId(WorldPaths.Locations.path, id));
  };

  useEffect(() => {
    loadWorlds();
    return () => setGlobalWorld(null);
  }, []);

  return (
    <PageContainer>
      <header>
        <Breadcrumbs data={[WorldPaths.Index]} />
        <PageTitle>{WorldPaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Worlds</b> and realms here.
        </PageDescription>
      </header>

      <Card>
        <h3 className="h4">{id === -1 ? "Public" : "Your"} Worlds</h3>
        {/* List */}
        {!worlds?.length && (
          <EmptyText>
            A formless void, without <b>Worlds</b> to display
          </EmptyText>
        )}

        <List
          data={worlds || []}
          itemText={(world: APIData<World>) => (
            <WorldItem
              world={world}
              onEdit={onEditWorld}
              onSelect={onSelectWorld}
              permissions={role}
            />
          )}
        />

        {/* Add new (button) */}
        <AddWorldButton
          size="lg"
          icon="public"
          text="Create New World"
          onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
        />
      </Card>

      <CreateWorldModal
        data={selectedWorld}
        open={active === MODAL.MANAGE_WORLD}
        onClose={() => {
          setGlobalWorld(null);
          clearGlobalModal();
        }}
      />
    </PageContainer>
  );
};

export default WorldsList;
