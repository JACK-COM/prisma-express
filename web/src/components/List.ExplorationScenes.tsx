import styled from "styled-components";
import { Accent, Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import ListView from "components/Common/ListView";
import ExplorationSceneItem, {
  AddExplorationSceneItem
} from "components/ExplorationSceneItem";
import { useGlobalModal } from "hooks/GlobalModal";
import {
  APIData,
  Chapter,
  Exploration,
  ExplorationScene,
  Scene
} from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { ExplorationStore, GlobalLibrary } from "state";
import { noOp } from "utils";

const AddButtons = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

type ExplorationScenesListProps = Pick<
  Partial<ExplorationStore>,
  "exploration" | "explorationScene"
> & {
  hideTitle?: boolean;
  title?: string;
  emptyText?: string;
};

/** @component List of `Exploration Scenes` */
const ExplorationScenesList = (props: ExplorationScenesListProps) => {
  const {
    emptyText,
    exploration,
    explorationScene,
    title = "Select a Scene",
    hideTitle = false
  } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const owner = authenticated && exploration?.authorId === userId;
  const controls = () => (owner ? <AddExplorationSceneItem /> : <></>);
  const scenes = exploration?.Scenes || [];

  return (
    <Card style={{ paddingTop: 0 }}>
      {!hideTitle && <CardTitle className="h5">{title}</CardTitle>}

      {/* Empty List message */}
      {!scenes.length && (
        <EmptyText>
          {emptyText || (
            <>
              The Creator paused in final thought. What{" "}
              <Accent as="b">paths</Accent> would the first explorers walk? What{" "}
              <Accent as="b">scenes</Accent> would they encounter?
            </>
          )}
        </EmptyText>
      )}

      {/* Add new (button - top) */}
      {scenes.length > 5 && controls()}

      {/* List */}
      <List
        data={scenes}
        itemText={(scene: APIData<ExplorationScene>) => (
          <ExplorationSceneItem
            key={scene.id}
            scene={scene}
            active={explorationScene?.id === scene.id}
            permissions={scene.authorId === userId ? "Author" : "Reader"}
          />
        )}
      />

      {/* Add new (button - bottom) */}
      {controls()}
    </Card>
  );
};

export default ExplorationScenesList;
