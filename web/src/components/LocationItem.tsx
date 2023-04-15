import styled from "styled-components";
import {
  APIData,
  UserRole,
  Location,
  World,
  Richness,
  PermissionProps
} from "utils/types";
import { noOp, requireAuthor } from "utils";
import {
  GridContainer,
  ItemDescription,
  ItemName,
  MatIcon
} from "components/Common/Containers";

const Container = styled(GridContainer)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  cursor: pointer;
  grid-template-areas:
    "icon name"
    "icon description";
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;
`;
const Icon = styled(MatIcon)<PermissionProps>`
  align-self: center;
  animation: bounce 400ms linear;
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
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
  const isAuthor = permissions === "Author";
  const iconClass = isPublic ? "icon success--text" : "icon error--text";
  const title = isPublic ? "Public Location" : "Private Location";
  const edit = requireAuthor(() => onEdit(location), permissions);
  const select = requireAuthor(() => onSelect(location), permissions);

  return (
    <Container onClick={select} permissions={permissions}>
      <Icon
        icon={isAuthor ? "pin_drop" : "lock"}
        permissions={permissions}
        className={iconClass}
        title={title}
      />

      <ItemName permissions={permissions} onClick={edit}>
        {location.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>
      <ItemDescription
        dangerouslySetInnerHTML={locationDescription(location)}
      />
    </Container>
  );
};

export default LocationItem;

/* HELPER */

/** Describe a location by its qualities */
function locationDescription(location: Location) {
  const toHTML = (str: string) => ({ __html: str });
  if (location.description !== "No description.")
    return toHTML(location.description);

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

  return toHTML(`${climateDescription} with ${floraFauna}.`);
}
