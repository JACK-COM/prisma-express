import styled from "styled-components";
import { APIData, UserRole, Location, World } from "utils/types";
import { noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";

type WICProps = { permissions: UserRole };
const Container = styled(GridContainer)<WICProps>`
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
`;
const Icon = styled(MatIcon).attrs({ icon: "pin_drop" })<WICProps>`
  align-self: center;
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  &:active,
  &:focus {
    animation: beacon 400ms linear;
  }

  &:hover {
    animation: spin 300ms linear;
    color: ${({ theme }) => theme.colors.accent};
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

type LocationItemProps = {
  world: APIData<World>;
  location: APIData<Location>;
  onEdit?: (w: APIData<Location>) => void;
  onSelect?: (w: APIData<Location>) => void;
  permissions?: UserRole;
};

const LocationItem = ({
  world,
  location,
  onSelect = noOp,
  onEdit = noOp,
  permissions = "Reader"
}: LocationItemProps) => {
  const { public: isPublic } = world;
  const iconClass = isPublic ? "icon success--text" : "icon grey--text";
  const title = isPublic ? "Public Location" : "Private Location";
  const edit: React.MouseEventHandler = (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    onEdit(location);
  };
  const select: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onSelect(location);
  };

  return (
    <Container onClick={select} permissions={permissions}>
      <Icon permissions={permissions} className={iconClass} title={title} />

      <Name permissions={permissions} onClick={edit}>
        {location.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <Description>{location.description}</Description>
    </Container>
  );
};

export default LocationItem;
