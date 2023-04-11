import styled from "styled-components";
import { APIData, PermissionProps, UserRole, World } from "utils/types";
import { noOp, suppressEvent } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "./Common/Containers";
import { Hint } from "./Forms/Form";
import { WorldPublicIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { Link } from "react-router-dom";
import { guard } from "utils";

const Container = styled(Link)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  color: inherit;
  cursor: pointer;
  display: grid;
  grid-template-areas:
    "icon name trash"
    "icon description trash";
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs};
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }
`;
const Description = styled(Hint)`
  ${lineclamp(1)};
  grid-area: description;
  width: 100%;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<PermissionProps>`
  grid-area: name;
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
  const edit = guard(() => onEdit(world), permissions);
  const select: React.MouseEventHandler = (e) => {
    if (!onSelect) return;
    suppressEvent(e);
    onSelect(world);
  };

  return (
    <Container to={url} onClick={select} permissions={permissions}>
      <WorldPublicIcon data={world} permissions={permissions} />

      <Name permissions={permissions} onClick={edit}>
        {world.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <Description>{world.description}</Description>
    </Container>
  );
};

export default WorldItem;
