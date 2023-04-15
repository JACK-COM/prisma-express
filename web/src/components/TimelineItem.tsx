import { Link } from "react-router-dom";
import styled from "styled-components";
import { APIData, UserRole, Timeline, PermissionProps } from "utils/types";
import { requireAuthor, noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import {
  ItemDescription,
  ItemName,
  MatIcon
} from "components/Common/Containers";
import { Hint } from "components/Forms/Form";
import { PermissionedIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";

const Container = styled(Link)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  display: grid;
  color: inherit;
  column-gap: ${({ theme }) => theme.sizes.sm};
  grid-template-columns: 24px 10fr max-content;
  justify-content: space-between;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;

  @media screen and (max-width: 600px) {
    grid-template-columns: 24px 3fr 1fr;
  }
`;
const TimelineIcon = styled(PermissionedIcon)`
  align-self: center;
  display: inline-block;
  grid-row: 1/3;
  margin-right: ${({ theme }) => theme.sizes.xs};
`;
const TimelineWorld = styled(Hint)`
  ${lineclamp(1)};
  align-self: center;
  font-size: small;
  grid-column: 3;
  grid-row: 1/3;
  text-align: right;
  text-transform: uppercase;
  width: 100%;
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
  const colorClass = isPublic ? "success--text" : "grey";
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
      <TimelineIcon
        icon="timeline"
        permissions={permissions}
        className={`icon ${colorClass}`}
        title={title}
      />

      <ItemName permissions={permissions} onClick={edit}>
        {timeline.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>
      <ItemDescription>Hello World</ItemDescription>
      <TimelineWorld
        className={colorClass}
        children={timelineDescription(timeline)}
      />
    </Container>
  );
};

export default TimelineItem;

/* HELPER */

/** Describe a timeline by its qualities */
function timelineDescription(timeline: Timeline) {
  if (timeline.World) return timeline.World.name;
}
