import { useEffect } from "react";
import styled from "styled-components";
import { Card, CardTitle, PageDescription } from "components/Common/Containers";
import ListView from "components/Common/ListView";
import WorldItem, { CreateWorldItem } from "components/WorldItem";
import { APIData, World, WorldCore } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { MODAL, clearGlobalModal, setGlobalModal } from "state";
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
  showControls?: boolean;
  className?: string;
  worlds?: APIData<WorldCore>[];
  focusedWorld?: APIData<World> | null;
};

/** @component List of worlds */
const WorldsList = (props: WorldsListProps) => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { className, worlds = [], showControls = false } = props;
  const controls = () =>
    authenticated &&
    showControls && (
      <CreateWorldItem onClick={() => setGlobalModal(MODAL.CREATE_WORLD)} />
    );

  useEffect(() => {
    return clearGlobalModal;
  }, []);

  return (
    <Card className={className}>
      <CardTitle>{authenticated ? "Your" : "Public"} Worlds</CardTitle>

      <PageDescription className="flex">
        <b>Legend:&nbsp;</b>
        {legend.map(({ icon, class: className, text }) => (
          <LegendItem className="flex" key={text}>
            <WorldIcon permissions="Author" icon={icon} className={className} />
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

      {/* List */}
      <List
        grid
        data={worlds}
        dummyFirstItem={worlds.length > 5 && controls()}
        dummyLastItem={controls()}
        itemText={(world: APIData<World>) => (
          <WorldItem
            world={world}
            permissions={world.authorId === userId ? "Author" : "Reader"}
            showControls={showControls}
          />
        )}
      />
    </Card>
  );
};

export default WorldsList;
