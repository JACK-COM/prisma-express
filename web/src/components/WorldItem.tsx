import styled from "styled-components";
import { APIData, UserRole, World } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  MatIcon,
  ItemDescription,
  ItemLinkContainer,
  ItemName,
  ItemGridContainer,
  sharedGridItemStyles,
  GridItemName,
  GridContainer,
  GridItemControls,
  GridItemControl
} from "./Common/Containers";
import { DeleteWorldIcon, WorldPublicIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import defaultWorld from "assets/mystic-world.png";
import Tooltip from "./Tooltip";

const WorldIcon = styled(WorldPublicIcon)`
  font-size: 1rem;
`;
const LinkContainer = styled(ItemLinkContainer)<{ permissions: UserRole }>`
  ${sharedGridItemStyles};
  grid-template-columns: 100%;

  .material-icons {
    grid-row: unset;
  }
`;

type WorldItemProps = {
  world: APIData<World>;
  onEdit?: (w: APIData<World>) => void;
  onSelect?: (w: APIData<World>) => void;
  permissions?: UserRole;
};
const WorldItem = ({
  world,
  onSelect,
  onEdit = noOp,
  permissions = "Reader"
}: WorldItemProps) => {
  const url = insertId(Paths.Worlds.Locations.path, world.id);
  const edit = requireAuthor(() => onEdit(world), permissions);
  const select: React.MouseEventHandler = (e) => {
    if (!onSelect) return;
    suppressEvent(e);
    onSelect(world);
  };

  return (
    <LinkContainer
      style={{ backgroundImage: `url(${defaultWorld})` }}
      to={url}
      onClick={select}
      permissions={permissions}
    >
      <GridItemName className="title">
        <WorldIcon data={world} permissions={permissions} />
        <span role="button">
          <Tooltip text={world.description}>{world.name}</Tooltip>
        </span>
      </GridItemName>

      {permissions === "Author" && (
        <GridItemControls columns="max-content auto">
          <GridContainer
            columns="repeat(3, 1fr)"
            className="controls"
            gap="0.2rem"
          >
            <GridItemControl variant="transparent">
              <MatIcon className="icon" icon="settings" onClick={edit} />
            </GridItemControl>
          </GridContainer>

          <GridItemControl variant="outlined">
            <DeleteWorldIcon
              className="delete"
              permissions={permissions}
              data={world}
            />
          </GridItemControl>
        </GridItemControls>
      )}
    </LinkContainer>
  );
};

export default WorldItem;

const ButtonContainer = styled(ItemGridContainer)<{ permissions: UserRole }>`
  ${sharedGridItemStyles};
  place-content: center;
`;
export const CreateWorldItem = ({ onClick }: { onClick?: any }) => {
  return (
    <ButtonContainer
      className="flex--column"
      permissions="Author"
      columns="auto"
      role="button"
      onClick={onClick}
    >
      <MatIcon style={{ fontSize: "4.8rem" }} icon="add_circle" />
      <ItemName style={{ gridColumn: 1, gridRow: 2 }} permissions="Author">
        Create a new world
      </ItemName>
    </ButtonContainer>
  );
};
