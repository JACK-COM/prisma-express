import { Link } from "react-router-dom";
import styled from "styled-components";
import { APIData, UserRole, Timeline, PermissionProps } from "utils/types";
import { requireAuthor, noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";
import { PermissionedIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";

const Container = styled(Link)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  display: grid;
  color: inherit;
  column-gap: ${({ theme }) => theme.sizes.sm};
  grid-template-columns: 24px 1fr;
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;

  > .icon {
    align-self: center;
    display: inline-block;
    grid-row: 1/3;
    margin-right: ${({ theme }) => theme.sizes.xs};
  }
`;
const TimelineWorld = styled(Hint)`
  ${lineclamp(1)};
  grid-column: 2;
  grid-row: 2;
  width: 100%;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<PermissionProps>`
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

type TimelineItemProps = {
  timeline: APIData<Timeline>;
  onEdit?: (w: APIData<Timeline>) => void;
  onSelect?: (w: APIData<Timeline>) => void;
  permissions?: UserRole;
};

const TimelineItem = ({
  timeline,
  onSelect = undefined,
  onEdit = noOp,
  permissions = "Reader"
}: TimelineItemProps) => {
  const { public: isPublic = false } = timeline.World || {};
  const iconClass = isPublic ? "icon success--text" : "icon grey--text";
  const title = `${isPublic ? "Public" : "Private"} Timeline`;
  const url = insertId(Paths.Timelines.Events.path, timeline.id);
  const edit = requireAuthor(() => onEdit(timeline), permissions);
  const select =
    onSelect &&
    (((e) => {
      e.stopPropagation();
      onSelect(timeline);
    }) as React.MouseEventHandler);

  return (
    <Container to={url} onClick={select} permissions={permissions}>
      <PermissionedIcon
        icon="timeline"
        permissions={permissions}
        className={iconClass}
        title={title}
        onClick={edit}
      />

      <Name permissions={permissions} onClick={edit}>
        {timeline.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <TimelineWorld>{timelineDescription(timeline)}</TimelineWorld>
    </Container>
  );
};

export default TimelineItem;

/* HELPER */

/** Describe a timeline by its qualities */
function timelineDescription(timeline: Timeline) {
  if (timeline.World) return timeline.World.name;
}
