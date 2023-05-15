import styled from "styled-components";
import { APIData, UserRole, Exploration } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  MatIcon,
  ItemLinkContainer,
  ItemName,
  ItemGridContainer,
  sharedGridItemStyles,
  GridItemName,
  GridContainer,
  GridItemControls,
  GridItemControl
} from "./Common/Containers";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import defaultBG from "assets/mystic-explorer.png";
import Tooltip from "./Tooltip";
import { MODAL, setFocusedExploration, setGlobalModal } from "state";
import { useNavigate } from "react-router";

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
  onEdit?: (w: APIData<Exploration>) => void;
  onSelect?: (w: APIData<Exploration>) => void;
  permissions?: UserRole;
  showControls?: boolean;
};
const ExplorationItem = ({
  exploration,
  onSelect,
  onEdit = noOp,
  permissions = "Reader",
  showControls = false
}: ExplorationItemProps) => {
  const viewURL = insertId(Paths.Explorations.Run.path, exploration.id);
  const editURL = insertId(Paths.Explorations.Build.path, exploration.id);
  const navigate = useNavigate();
  const configure = requireAuthor(() => {
    setFocusedExploration(exploration);
    setGlobalModal(MODAL.MANAGE_EXPLORATION);
  }, permissions);
  const edit = requireAuthor(() => navigate(editURL), permissions);
  const onDelete = requireAuthor(() => {
    setFocusedExploration(exploration);
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
            <DeleteItemIcon
              className="delete"
              permissions={permissions}
              data={exploration}
              onItemClick={onDelete}
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
