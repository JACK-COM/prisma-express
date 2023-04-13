import styled from "styled-components";
import { APIData, PermissionProps, UserRole, World } from "utils/types";
import { noOp, suppressEvent } from "utils";
import { lineclamp } from "theme/theme.shared";
import { MatIcon } from "./Common/Containers";
import { Hint } from "./Forms/Form";
import { DeleteWorldIcon, WorldPublicIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { Link } from "react-router-dom";
import { requireAuthor } from "utils";

const Container = styled(Link)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  color: inherit;
  cursor: pointer;
  display: grid;
  column-gap: ${({ theme }) => theme.sizes.sm};
  grid-template-columns: min-content ${({ permissions }) =>
      permissions === "Author" ? "3fr 24px" : "4fr"};
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs};
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }
`;
const Description = styled(Hint)`
  ${lineclamp(1)};
  grid-column: 2 / -1;
  grid-row: 2;
  width: 100%;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<PermissionProps>`
  grid-column: 2;
  grid-row: 1;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  .icon {
    display: inline-block;
    padding: ${({ theme }) => theme.sizes.xs};
    font-size: smaller;
    cursor: pointer;
  }
`;
const WorldIcon = styled(WorldPublicIcon)`
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
    <Container to={url} onClick={select} permissions={permissions}>
      <WorldIcon data={world} permissions={permissions} />

      <Name permissions={permissions} onClick={edit}>
        {world.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <Description dangerouslySetInnerHTML={{ __html: world.description }} />
      <DeleteWorldIcon permissions={permissions} data={world} />
    </Container>
  );
};

export default WorldItem;
