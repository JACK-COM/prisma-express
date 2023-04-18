import styled from "styled-components";
import { APIData, UserRole, World } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  MatIcon,
  ItemDescription,
  ItemLinkContainer,
  ItemName
} from "./Common/Containers";
import { DeleteWorldIcon, WorldPublicIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";

const WorldIcon = styled(WorldPublicIcon)`
  font-size: 1rem;
  grid-column: 1;
  grid-row: 1/3;
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
    <ItemLinkContainer to={url} onClick={select} permissions={permissions}>
      <WorldIcon data={world} permissions={permissions} />

      <ItemName permissions={permissions} onClick={edit}>
        {world.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>
      <ItemDescription
        dangerouslySetInnerHTML={{ __html: world.description }}
      />
      <DeleteWorldIcon className="delete" permissions={permissions} data={world} />
    </ItemLinkContainer>
  );
};

export default WorldItem;
