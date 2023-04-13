import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { Timeline } from "../utils/types";
import {
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  RadioInput,
  RadioLabel,
  Select,
  Textarea
} from "components/Forms/Form";
import { CreateTimelineData } from "graphql/requests/timelines.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";

export type CreateTimelineProps = {
  data?: Partial<CreateTimelineData>;
  onChange?: (data: Partial<CreateTimelineData>) => void;
};

/** Create or edit a `Timeline` */
const CreateTimelineForm = (props: CreateTimelineProps) => {
  const { data, onChange = noOp } = props;
  const { events = [], worlds = [] } = useGlobalWorld();
  const updateOrigin = (id: string) => {
    const worldId = Number(id);
    onChange({ ...data, worldId: isNaN(worldId) ? -1 : worldId });
  };
  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  return (
    <Form>
      <Legend>New Timeline</Legend>
      <Hint>
        A <b>Timeline</b> is <b>a collection of unique events</b>. Use them to
        experiment with different historical backgrounds and outcomes for your
        characters.
      </Hint>

      {/* Name */}
      <Label direction="column">
        <span className="label required">Name</span>
        <Input
          placeholder="e.g. Utopian timeline"
          type="text"
          value={data?.name || ""}
          onChange={updateName}
        />
      </Label>
      <Hint>Enter a name for your timeline (e.g. "The Utopian one")</Hint>

      {/* Origin Universe/Realm */}
      <Label direction="column">
        <span className="label required">Timeline occurs in:</span>
        <Select
          data={worlds}
          value={data?.worldId || ""}
          itemText={(w) => w.name}
          itemValue={(w) => w.id}
          placeholder="Select Timeline Target:"
          onChange={updateOrigin}
        />
      </Label>
      <Hint>
        Where will this happen? Select the <b>Universe</b> or <b>Realm</b> that
        will be the event-source for this timeline.
      </Hint>
    </Form>
  );
};

export default CreateTimelineForm;
