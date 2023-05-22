import { useEffect } from "react";
import styled from "styled-components";
import {
  Accent,
  Card,
  CardTitle,
  Description,
  PageDescription
} from "components/Common/Containers";
import ListView from "components/Common/ListView";
import ExplorationItem, {
  CreateExplorationItem
} from "components/ExplorationItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Exploration } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import {
  MODAL,
  clearGlobalModal,
  setGlobalModal,
  setGlobalExploration
} from "state";
import { TallIcon } from "components/ComponentIcons";
import { useGlobalWorld } from "hooks/GlobalWorld";

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
  { icon: "explore", class: "success--text", text: "Public/owned" },
  { icon: "explore", class: "error--text", text: "Private" },
  { icon: "lock", class: "success--text", text: "Public/unowned" }
];

type ExplorationsListProps = {
  showControls?: boolean;
  className?: string;
  explorations?: APIData<Exploration>[];
};

/** @component List of explorations */
const ExplorationsList = (props: ExplorationsListProps) => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { focusedLocation } = useGlobalWorld(["focusedLocation"]);
  const locationName = focusedLocation?.name || "Locations";
  const { className, explorations = [], showControls = false } = props;
  const controls = () =>
    authenticated && showControls && <CreateExplorationItem />;

  useEffect(() => {
    return clearGlobalModal;
  }, []);

  return (
    <Card className={className}>
      <CardTitle>
        Explore <Accent>{locationName}</Accent>
      </CardTitle>

      <PageDescription className="flex">
        <b>Legend:&nbsp;</b>
        {legend.map(({ icon, class: className, text }) => (
          <LegendItem className="flex" key={text}>
            <TallIcon permissions="Author" icon={icon} className={className} />
            {text}
          </LegendItem>
        ))}
      </PageDescription>

      <Description>
        All <b>Explorations</b> created for this location
      </Description>

      {/* Empty List message */}
      {!explorations.length && (
        <EmptyText>
          The <b>Creator</b> called a place forth from the void. It was empty,
          and without form. The <b>Creator</b> pondered the void, and said, "Let
          there be <Accent>explorations</Accent>."
        </EmptyText>
      )}

      {/* List */}
      <List
        grid
        data={explorations}
        dummyFirstItem={explorations.length > 5 && controls()}
        dummyLastItem={controls()}
        itemText={(expl: APIData<Exploration>) => (
          <ExplorationItem
            exploration={expl}
            permissions={expl.authorId === userId ? "Author" : "Reader"}
            showControls={showControls}
          />
        )}
      />
    </Card>
  );
};

export default ExplorationsList;
