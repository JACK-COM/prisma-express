import styled from "styled-components";
import { APIData, UserRole, World } from "utils/types";
import { noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";

type WICProps = { permissions: UserRole };
const WorldItemContainer = styled(GridContainer)<WICProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  cursor: pointer;
  grid-template-areas:
    "icon name"
    "icon description";
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }

  > .name {
    grid-area: name;
    > span {
      display: inline-block;
      padding: ${({ theme }) => theme.sizes.xs};
      font-size: smaller;
      cursor: pointer;
    }

    &:hover {
      color: ${({ theme, permissions }) =>
        permissions === "Author" ? theme.colors.accent : "initial"};
    }
  }
`;
const PublicIcon = styled(MatIcon).attrs({ icon: "public" })`
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
`;
const WorldItemHint = styled(Hint)`
  ${lineclamp(1)};
  grid-area: description;
  width: 100%;
`;

type WorldItemProps = {
  world: APIData<World>;
  onEdit?: (w: APIData<World>) => void;
  onSelect?: (w: APIData<World>) => void;
  permissions?: UserRole;
};

export const WorldItem = ({
  world,
  onSelect = noOp,
  onEdit = noOp,
  permissions = "Reader"
}: WorldItemProps) => {
  const iconClass = world.public ? "icon success--text" : "icon grey--text";
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
    <WorldItemContainer onClick={select} permissions={permissions}>
      <PublicIcon className={iconClass} />

      <b className="name" role="button" tabIndex={-1} onClick={edit}>
        {world.name}
        {permissions === "Author" && <MatIcon icon="edit" />}
      </b>
      <WorldItemHint>{world.description}</WorldItemHint>
    </WorldItemContainer>
  );
};
