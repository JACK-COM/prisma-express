import styled from "styled-components";
import {
  APIData,
  UserRole,
  Timeline,
  World,
  Richness,
  PermissionProps
} from "utils/types";
import { requireAuthor, noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";
import { useMemo } from "react";
import { PermissionedIcon } from "./ComponentIcons";

const Container = styled(GridContainer)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  grid-template-areas:
    "icon name"
    "icon description";
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;
`;
const Description = styled(Hint)`
  ${lineclamp(1)};
  grid-area: description;
  width: 100%;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<PermissionProps>`
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
  timeline: APIData<Timeline>;
  onEdit?: (w: APIData<Timeline>) => void;
  onSelect?: (w: APIData<Timeline>) => void;
  permissions?: UserRole;
};

const LocationItem = ({
  world,
  timeline,
  onSelect = noOp,
  onEdit = noOp,
  permissions = "Reader"
}: LocationItemProps) => {
  const { public: isPublic } = world;
  const iconClass = isPublic ? "icon success--text" : "icon grey--text";
  const title = isPublic ? "Public Timeline" : "Private Timeline";
  const edit = requireAuthor(() => onEdit(timeline), permissions);
  const select: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onSelect(timeline);
  };

  return (
    <Container onClick={select} permissions={permissions}>
      <PermissionedIcon
        icon="timeline"
        permissions={permissions}
        className={iconClass}
        title={title}
      />

      <Name permissions={permissions} onClick={edit}>
        {timeline.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <Description>{timelineDescription(timeline)}</Description>
    </Container>
  );
};

export default LocationItem;

/* HELPER */

/** Describe a timeline by its qualities */
function timelineDescription(timeline: Timeline) {
  if (timeline.World) return timeline.World.name;
}
