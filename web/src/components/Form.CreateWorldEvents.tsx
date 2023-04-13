import { noOp } from "../utils";
import { EventPolarity, EventTarget } from "../utils/types";
import { Form, Hint, Legend } from "components/Forms/Form";
import { CreateEventData } from "graphql/requests/timelines.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { ButtonWithIcon } from "./Forms/Button";
import { WorldEventFormFields } from "./WorldEventFields";

export type CreateWorldEventProps = {
  data?: Partial<CreateEventData>[];
  onChange?: (data: Partial<CreateEventData>[]) => void;
};

/** Create or edit a `WorldEvent` */
const CreateWorldEventsForm = (props: CreateWorldEventProps) => {
  const { data = [], onChange = noOp } = props;
  const { worlds = [], focusedWorld } = useGlobalWorld([
    "worlds",
    "focusedWorld"
  ]);
  const updateAtIndex = (d: Partial<CreateEventData>, i: number) => {
    const next = [...data];
    next[i] = d;
    onChange(next);
  };
  const addEventStub = () => {
    updateAtIndex(
      {
        name: "",
        worldId: focusedWorld?.id || -1,
        polarity: EventPolarity.Neutral,
        target: EventTarget.World
      },
      data.length
    );
  };

  return (
    <Form>
      <Legend>
        New <span className="accent--text">World Event</span>
      </Legend>
      <Hint>
        A <b>World Event</b> is <b>a fixed historical point in your world</b>,
        like a world-creation event, that occurs in multiple timelines.
      </Hint>

      {/* Name */}
      {data.map((d, i) => (
        <WorldEventFormFields
          key={i}
          data={d}
          onChanged={updateAtIndex}
          worlds={worlds}
          index={i}
        />
      ))}

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

export default CreateWorldEventsForm;
