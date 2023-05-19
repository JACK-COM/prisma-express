import {
  APIData,
  TimelineEvent,
  EventPolarityColors,
  EventTargetSymbols
} from "utils/types";
import { MatIcon } from "./Common/MatIcon";
import styled from "styled-components";

/** A tiny icon that shows an event in a timeline */
type EventItemProps = { data: APIData<TimelineEvent>; last?: boolean };

const Container = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  > * {
    font-size: 0.9rem;
  }
`;

export const TimelineItemEventIcon = (props: EventItemProps) => {
  const { Event } = props.data;
  if (!Event) return null;
  const { polarity, target } = Event;
  const color = EventPolarityColors(polarity);
  const eventTarget = EventTargetSymbols(target);
  return (
    <Container color={color} className="inline-flex" title={polarity}>
      <MatIcon icon={eventTarget} />
      {!props.last && <MatIcon icon="arrow_right_alt" />}
    </Container>
  );
};
