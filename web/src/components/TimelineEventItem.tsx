import {
  APIData,
  UserRole,
  TimelineEvent,
  EventPolarityText
} from "utils/types";
import { noOp } from "utils";
import {
  ItemDescription,
  ItemGridContainer,
  ItemName
} from "./Common/Containers";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { requireAuthor } from "utils";

type TimelineEventItemProps = {
  timelineEvent: APIData<TimelineEvent>;
  onEdit?: (w: APIData<TimelineEvent>) => void;
  onRemove?: (w: APIData<TimelineEvent>) => void;
  onSelect?: (w: APIData<TimelineEvent>) => void;
  permissions?: UserRole;
  showDescription?: boolean;
};

/** @component A `World Event` in a timeline */
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
    <ItemGridContainer onClick={select} permissions={permissions}>
      <TallIcon className={color} icon={icon} permissions={permissions} />

      <ItemName
        polarity={tEvent.Event?.polarity}
        permissions={permissions}
        onClick={edit}
      >
        {tEvent?.Event?.name}
      </ItemName>
      {showDescription && (
        <ItemDescription dangerouslySetInnerHTML={itemDescription(tEvent)} />
      )}
      {showDescription && permissions === "Author" && (
        <DeleteItemIcon
          className="delete"
          onItemClick={remove}
          permissions={permissions}
          data={tEvent.id}
        />
      )}
    </ItemGridContainer>
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
