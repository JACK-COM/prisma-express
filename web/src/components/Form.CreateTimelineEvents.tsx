import { useMemo } from "react";
import { noOp } from "../utils";
import { Form, Hint, Legend, Select } from "components/Forms/Form";
import { CreateTimelineEventData } from "graphql/requests/timelines.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { ButtonWithIcon } from "./Forms/Button";
import { GridContainer, WarningMessage } from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import styled from "styled-components";
import { DeleteItemIcon } from "./ComponentIcons";

export type CreateTimelineEventProps = {
  data?: Partial<CreateTimelineEventData>[];
  onChange?: (data: Partial<CreateTimelineEventData>[]) => void;
  onRemoveItem?: (itemId: number) => void;
};

const EventItem = styled(GridContainer)`
  align-items: center;
  grid-template-columns: 1fr 24px;
  margin-bottom: ${({ theme }) => theme.sizes.sm};

  > .icon {
    align-self: center;
  }
`;

const Warning = styled(WarningMessage)`
  display: grid;
  gap: 0.6rem;
  grid-template-columns: 24px 1fr;
  margin: 1rem 0;
`;

/** Create or edit a `TimelineEvent` */
const CreateTimelineEventsForm = (props: CreateTimelineEventProps) => {
  const { data = [], onChange = noOp, onRemoveItem = noOp } = props;
  const { events = [], focusedTimeline } = useGlobalWorld([
    "events",
    "focusedTimeline"
  ]);
  const worldEvents = useMemo(
    () => events.filter((e) => e.worldId === focusedTimeline?.worldId),
    [events, focusedTimeline]
  );
  const duplicates = useMemo(() => {
    const selected: Set<number> = new Set();
    return data.reduce((acc, item, i) => {
      if (!item.eventId) return acc;
      if (!selected.has(item.eventId)) selected.add(item.eventId);
      else acc.add(i);
      return acc;
    }, new Set<number>());
  }, [data]);
  const removeAtIndex = (i: number) => {
    const target = data[i];
    if (target.id) onRemoveItem(target.id);
    else onChange(data.filter((_, j) => j !== i));
  };
  const updateAtIndex = (d: Partial<CreateTimelineEventData>, i: number) => {
    const next = [...data];
    next[i] = d;
    onChange(next);
  };
  const addEventStub = () => {
    updateAtIndex(
      { order: data.length + 1, timelineId: focusedTimeline?.id },
      data.length
    );
  };

  return (
    <Form>
      <Legend>
        New <span className="accent--text">Timeline Events</span>
      </Legend>
      <Hint>
        Specify what <b>Global</b> (world) <b>Events</b> occur in what order in
        this timeline.
      </Hint>

      {/* List */}
      {data.map((d, i) => (
        <EventItem key={i}>
          <Select
            wide
            aria-invalid={Boolean(d.eventId && duplicates.has(i))}
            data={worldEvents}
            emptyMessage="No Global events found in this world"
            itemText={(e) => e.name}
            itemValue={(e) => e.id}
            value={d.eventId}
            onChange={(e) =>
              e
                ? updateAtIndex({ ...d, eventId: Number(e) }, i)
                : removeAtIndex(i)
            }
          />

          <DeleteItemIcon
            className="icon"
            data={d}
            permissions="Author"
            onItemClick={() => removeAtIndex(i)}
          />
        </EventItem>
      ))}

      {duplicates.size > 0 && (
        <Warning>
          <MatIcon icon="warning" />
          Duplicate or recurring event detected.
        </Warning>
      )}

      <ButtonWithIcon
        type="button"
        icon="add"
        onClick={addEventStub}
        size="lg"
        text={data.length ? "Add another Event" : "Add an Event"}
        variant="outlined"
      />
    </Form>
  );
};

export default CreateTimelineEventsForm;
