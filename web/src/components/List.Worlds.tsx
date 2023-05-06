import { useEffect } from "react";
import styled from "styled-components";
import { Card, CardTitle, PageDescription } from "components/Common/Containers";
import CreateWorldModal from "components/Modals/ManageWorldModal";
import ListView from "components/Common/ListView";
import WorldItem, { CreateWorldItem } from "components/WorldItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, World } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { clearGlobalWorld, setGlobalWorld } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { WorldIcon } from "components/ComponentIcons";

const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;
const LegendItem = styled.span`
  &,
  .material-icons {
    padding-right: 0.4rem;
  }
`;

const legend = [
  { icon: "public", class: "success--text", text: "Public/owned" },
  { icon: "public", class: "error--text", text: "Private" },
  { icon: "lock", class: "success--text", text: "Public/unowned" }
];

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
      <CreateWorldItem onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)} />
    );

  useEffect(() => {
    return () => clearComponentData();
  }, []);

  return (
    <>
      <Card>
        <CardTitle>{authenticated ? "Your" : "Public"} Worlds</CardTitle>

        <PageDescription className="flex">
          <b>Legend:&nbsp;</b>
          {legend.map(({ icon, class: className, text }) => (
            <LegendItem className="flex" key={text}>
              <WorldIcon
                permissions="Author"
                icon={icon}
                className={className}
              />
              {text}
            </LegendItem>
          ))}
        </PageDescription>

        {/* Empty List message */}
        {!worlds.length && (
          <EmptyText>
            A formless void, without <b>Worlds</b> to display
          </EmptyText>
        )}

        {/* Add new (button - top) */}

        {/* List */}
        <List
          grid
          data={worlds}
          dummyFirstItem={worlds.length > 5 && controls("transparent")}
          dummyLastItem={controls()}
          itemText={(world: APIData<World>) => (
            <WorldItem
              world={world}
              onEdit={onEditWorld}
              permissions={world.authorId === userId ? "Author" : "Reader"}
            />
          )}
        />

        {/* Add new (button - bottom) */}
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
