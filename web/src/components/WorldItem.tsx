import styled from "styled-components";
import { APIData, UserRole, World } from "utils/types";
import { noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "./Common/Containers";
import { Hint } from "./Forms/Form";
import {WorldPublicIcon} from "./ComponentIcons";

export type WICProps = { permissions: UserRole };
const Container = styled(GridContainer)<WICProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  cursor: pointer;
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
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<WICProps>`
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
  onSelect = noOp,
  onEdit = noOp,
  permissions = "Reader"
}: WorldItemProps) => {
  const edit: React.MouseEventHandler = (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    onEdit(world);
  };
  const select: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onSelect(world);
  };

  return (
    <Container onClick={select} permissions={permissions}>
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
