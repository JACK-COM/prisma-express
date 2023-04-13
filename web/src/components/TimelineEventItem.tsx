import styled from "styled-components";
import {
  APIData,
  PermissionProps,
  UserRole,
  TimelineEvent,
  EventPolarity,
  EventPolarityColors,
  EventPolarityText
} from "utils/types";
import { noOp, suppressEvent } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "./Common/Containers";
import { Hint } from "./Forms/Form";
import { DeleteItemIcon, PermissionedIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";

const Container = styled(GridContainer)<PermissionProps>`
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

  .delete {
    align-self: center;
    grid-row: 1/3;
  }

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
type NameProps = PermissionProps & { polarity?: EventPolarity };
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<NameProps>`
  color: ${({ polarity }) => EventPolarityColors(polarity)};
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
const TimelineEventIcon = styled(PermissionedIcon)`
  grid-column: 1;
  grid-row: 1/3;
`;

type TimelineEventItemProps = {
  timelineEvent: APIData<TimelineEvent>;
  onEdit?: (w: APIData<TimelineEvent>) => void;
  onRemove?: (w: APIData<TimelineEvent>) => void;
  onSelect?: (w: APIData<TimelineEvent>) => void;
  permissions?: UserRole;
  showDescription?: boolean;
};

const TimelineEventItem = ({
  timelineEvent: tEvent,
  onSelect = noOp,
  onRemove = noOp,
  permissions = "Reader",
  showDescription = false
}: TimelineEventItemProps) => {
  const icon = tEvent.order === 1 ? "event" : "trending_flat";
  const color = tEvent.order === 1 ? "success--text" : undefined;
  const remove = requireAuthor(() => onRemove(tEvent), permissions, false);
  const edit = requireAuthor(() => onSelect(tEvent), permissions);
  const select = requireAuthor(() => onSelect(tEvent), permissions);

  return (
    <Container onClick={select} permissions={permissions}>
      <TimelineEventIcon
        className={color}
        icon={icon}
        permissions={permissions}
      />

      <Name
        polarity={tEvent.Event?.polarity}
        permissions={permissions}
        onClick={edit}
      >
        {tEvent?.Event?.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      {showDescription && (
        <Description dangerouslySetInnerHTML={itemDescription(tEvent)} />
      )}
      {showDescription && permissions === "Author" && (
        <DeleteItemIcon
          className="delete"
          onItemClick={remove}
          permissions={permissions}
          data={tEvent.id}
        />
      )}
    </Container>
  );
};

export default TimelineEventItem;

function itemDescription(item: APIData<TimelineEvent>) {
  const toHTML = (s: string) => ({ __html: s });
  const { Event } = item;
  if (!Event) return toHTML("");
  const polarityDesc = EventPolarityText(Event.polarity);
  if (Event.description === "No description")
    return toHTML(`${polarityDesc} event`);
  return toHTML(`[ ${polarityDesc} ] ${Event.description}`);
}
