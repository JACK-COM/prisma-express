import {
  APIData,
  TimelineEvent,
  EventPolarityColors,
  EventTargetSymbols
} from "utils/types";
import { MatIcon } from "components/Common/Containers";

/** A tiny icon that shows an event in a timeline */
type EventItemProps = { data: APIData<TimelineEvent>; last?: boolean };

export const TimelineItemEventIcon = (props: EventItemProps) => {
  const { Event } = props.data;
  if (!Event) return null;
  const { polarity, target } = Event;
  const color = EventPolarityColors(polarity);
  const eventTarget = EventTargetSymbols(target);
  return (
    <span className="inline-flex" style={{ color }} title={polarity}>
      <MatIcon icon={eventTarget} />
      {!props.last && <MatIcon icon="arrow_right_alt" />}
    </span>
  );
};
