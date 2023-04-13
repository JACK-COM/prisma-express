import styled from "styled-components";
import { APIData, UserRole, Location, World, Richness } from "utils/types";
import { noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";

type WICProps = { permissions: UserRole };
const Container = styled(GridContainer)<WICProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  grid-template-areas:
    "icon name"
    "icon description";
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;
`;
const Icon = styled(MatIcon).attrs({ icon: "pin_drop" })<WICProps>`
  align-self: center;
  animation: bounce 400ms linear;
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
`;
const Description = styled(Hint)`
  ${lineclamp(1)};
  grid-area: description;
  width: 100%;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<WICProps>`
  grid-area: name;
  cursor: pointer;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  .icon {
    display: inline-block;
    padding: ${({ theme }) => theme.sizes.xs};
    font-size: smaller;
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
      <Icon
        icon="pin_drop"
        permissions={permissions}
        className={iconClass}
        title={title}
      />

      <Name permissions={permissions} onClick={edit}>
        {location.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <Description>{locationDescription(location)}</Description>
    </Container>
  );
};

export default LocationItem;

/* HELPER */

/** Describe a location by its qualities */
function locationDescription(location: Location) {
  if (location.description !== "No description.") return location.description;

  const abundance = (lbl: string, rch: Richness) => {
    switch (rch) {
      case "Abundant":
        return `abundant ${lbl}`;
      case "Sparse":
        return `no ${lbl}`;
      case "Adequate":
      default:
        return `normal ${lbl}`;
    }
  };

  const { climate, flora, fauna } = location;
  const sameFloraFauna = flora === fauna;
  const floraDescription = abundance("vegetation", flora);
  const climateDescription = `${climate} climate`;
  const floraFauna = sameFloraFauna
    ? `${floraDescription} and animals`
    : `${floraDescription} and ${fauna.toLowerCase()} wildlife`;

  return `${climateDescription} with ${floraFauna}`;
}
