import styled from "styled-components";
import { APIData, UserRole, Exploration } from "utils/types";
import { suppressEvent } from "utils";
import {
  ItemLinkContainer,
  ItemName,
  ItemGridContainer,
  sharedGridItemStyles,
  GridItemName,
  GridContainer,
  GridItemControls,
  GridItemControl
} from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import defaultBG from "assets/mystic-explorer.png";
import Tooltip from "./Tooltip";
import { MODAL, setGlobalExploration, setGlobalModal } from "state";
import { useNavigate } from "react-router";
import { getExploration } from "graphql/requests/explorations.graphql";

const ExplorationIcon = styled(TallIcon).attrs({ icon: "explore" })`
  font-size: 1rem;
`;
const LinkContainer = styled(ItemLinkContainer)<{ permissions: UserRole }>`
  ${sharedGridItemStyles};
  grid-template-columns: 100%;

  .material-icons {
    grid-row: unset;
  }
`;

type ExplorationItemProps = {
  exploration: APIData<Exploration>;
  onSelect?: (w: APIData<Exploration>) => void;
  permissions?: UserRole;
  showControls?: boolean;
};
const ExplorationItem = ({
  exploration,
  onSelect,
  permissions = "Reader",
  showControls = false
}: ExplorationItemProps) => {
  const viewURL = insertId(Paths.Explorations.Run.path, exploration.id);
  const editURL = insertId(Paths.Explorations.Build.path, exploration.id);
  const navigate = useNavigate();
  const configure = requireAuthor(async () => {
    const expanded = await getExploration(exploration.id);
    setGlobalExploration(expanded);
    setGlobalModal(MODAL.MANAGE_EXPLORATION);
  }, permissions);
  const edit = requireAuthor(() => navigate(editURL), permissions);
  const onDelete = requireAuthor(() => {
    setGlobalExploration(exploration);
    setGlobalModal(MODAL.CONFIRM_DELETE_EXPLORATION);
  }, permissions);
  const select: React.MouseEventHandler = (e) => {
    if (!onSelect) return;
    suppressEvent(e);
    onSelect(exploration);
  };

  return (
    <LinkContainer
      style={{ backgroundImage: `url(${defaultBG})` }}
      to={viewURL}
      onClick={select}
      permissions={permissions}
    >
      <GridItemName className="title">
        <ExplorationIcon permissions={permissions} />
        <span role="button">
          <Tooltip text={exploration.description || "No description"}>
            {exploration.title}
          </Tooltip>
        </span>
      </GridItemName>

      {permissions === "Author" && showControls && (
        <GridItemControls columns="max-content auto">
          <GridContainer
            columns="repeat(3, 1fr)"
            className="controls"
            gap="0.2rem"
          >
            <GridItemControl variant="transparent">
              <MatIcon className="icon" icon="settings" onClick={configure} />
            </GridItemControl>
            <GridItemControl variant="transparent">
              <MatIcon className="icon" icon="edit" onClick={edit} />
            </GridItemControl>
          </GridContainer>

          <GridItemControl variant="outlined">
            <TallIcon
              icon="delete"
              className="delete"
              permissions={permissions}
              onClick={onDelete}
            />
          </GridItemControl>
        </GridItemControls>
      )}
    </LinkContainer>
  );
};

export default ExplorationItem;

const ButtonContainer = styled(ItemGridContainer)<{ permissions: UserRole }>`
  ${sharedGridItemStyles};
  place-content: center;
`;
export const CreateExplorationItem = () => {
  return (
    <ButtonContainer
      className="flex--column"
      permissions="Author"
      columns="auto"
      role="button"
      onClick={() => setGlobalModal(MODAL.CREATE_EXPLORATION)}
    >
      <MatIcon style={{ fontSize: "4.8rem" }} icon="add_circle" />
      <ItemName style={{ gridColumn: 1, gridRow: 2 }} permissions="Author">
        Add an exploration
      </ItemName>
    </ButtonContainer>
  );
};
