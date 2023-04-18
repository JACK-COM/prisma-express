import { useEffect } from "react";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import CreateWorldModal from "components/Modals/ManageWorldModal";
import ListView from "components/Common/ListView";
import WorldItem from "components/WorldItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, World } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { clearGlobalWorld, setGlobalWorld } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";

const AddWorldButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

type WorldsListProps = {
  worlds?: APIData<World>[];
  focusedWorld?: APIData<World> | null;
};

/** @component List of worlds */
const WorldsList = (props: WorldsListProps) => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { focusedWorld, worlds = [] } = props;
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalWorld();
  };
  const onEditWorld = (world: APIData<World>) => {
    setGlobalWorld(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") =>
    authenticated && (
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
    <>
      <Card>
        <CardTitle>{authenticated ? "Your" : "Public"} Worlds</CardTitle>

        {/* Empty List message */}
        {!worlds.length && (
          <EmptyText>
            A formless void, without <b>Worlds</b> to display
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {authenticated && worlds.length > 5 && controls("transparent")}

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
        {authenticated && controls()}
      </Card>

      {/* Modal */}
      <CreateWorldModal
        data={focusedWorld}
        open={active === MODAL.MANAGE_WORLD}
        onClose={clearComponentData}
      />
    </>
  );
};

export default WorldsList;
