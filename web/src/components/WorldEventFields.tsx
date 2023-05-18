import { ChangeEvent, useMemo, useState } from "react";
import {
  FormRow,
  Hint,
  Input,
  Label,
  RadioInput,
  RadioLabel,
  Select,
  Textarea,
  TinyMCE
} from "components/Forms/Form";
import { Fieldset } from "components/Forms/Form";
import { CreateEventData } from "graphql/requests/timelines.graphql";
import {
  APIData,
  EventPolarity,
  EventPolarityText,
  EventTarget,
  World
} from "utils/types";
import styled from "styled-components";
import { MatIcon } from "./Common/MatIcon";
import { GlobalUser } from "state";

export type WorldEventFieldProps = {
  data: Partial<CreateEventData>;
  index?: number;
  worlds?: APIData<World>[];
  onChanged: (d: Partial<CreateEventData>, i: number) => void;
};

const Fields = styled(Fieldset)`
  .collapse--vertical {
    display: none;
  }
`;
const FieldRow = styled(FormRow)`
  align-items: start;

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const targets = [EventTarget.World, EventTarget.Local, EventTarget.Person];
const polarity = [
  EventPolarity.Neutral,
  EventPolarity.NegativeExpected,
  EventPolarity.NegativeUnexpected,
  EventPolarity.PositiveExpected,
  EventPolarity.PositiveUnexpected
];

export function WorldEventFormFields(props: WorldEventFieldProps) {
  const { data, onChanged, worlds = [], index: i = 0 } = props;
  const world = useMemo(
    () => worlds.find((w) => w.id === data.worldId) || null,
    [data.worldId, worlds]
  );
  const { id: userId } = GlobalUser.getState();
  const owner = !data.id || data.authorId === userId;
  const [showDesc, setShowDesc] = useState(false);
  const updateName = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    onChanged({ ...data, name: e.target.value }, i);
  };
  const updateTarget = (target: EventTarget, i: number) => {
    onChanged({ ...data, target }, i);
  };
  const updatePolarity = (polarity: EventPolarity, i: number) => {
    onChanged({ ...data, polarity }, i);
  };
  const updateDescription = (e: string, i: number) => {
    onChanged({ ...data, description: e }, i);
  };

  return (
    <Fields>
      <FieldRow columns="3fr repeat(2, 1fr)">
        {/* Event Name */}
        <Label direction="column">
          <span className="label required">Event Name</span>
          <Input
            disabled={!owner}
            placeholder={`e.g. Creation of ${world?.name || "this Universe"}`}
            type="text"
            value={data.name || ""}
            onChange={(x) => updateName(x, i)}
          />
          <Hint>A descriptive name for the event.</Hint>
        </Label>

        {/* Event Target */}
        <Label direction="column">
          <span className="label required">Target</span>
          <Select
            data={targets}
            disabled={!owner}
            value={data.target || EventTarget.World}
            itemText={(d: EventTarget) => d.valueOf()}
            itemValue={(d) => d}
            emptyMessage="No other characters in current world."
            placeholder="Select target:"
            onChange={(ch) => updateTarget(ch, i)}
          />
          <Hint>The Event's target.</Hint>
        </Label>

        {/* Event Polarity/Alignment */}
        <Label direction="column">
          <span className="label required">Alignment</span>
          <Select
            data={polarity}
            disabled={!owner}
            value={data.polarity}
            itemText={EventPolarityText}
            itemValue={(d) => d}
            emptyMessage="No other characters in current world."
            placeholder="Select alignment:"
            onChange={(ch) => updatePolarity(ch, i)}
          />
          <Hint>The type of event, if relevant.</Hint>
        </Label>
      </FieldRow>

      <hr />

      {/* Description */}
      <Label direction="column">
        <span className="label flex" onClick={() => setShowDesc(!showDesc)}>
          Description (optional)
          <MatIcon icon={`visibility${showDesc ? "" : "_off"}`} />
        </span>
        <div className={showDesc ? "expand--vertical" : "collapse--vertical"}>
          <Textarea
            disabled={!owner}
            rows={300}
            style={{ width: "100%" }}
            value={data?.description || ""}
            onChange={({ target }) => updateDescription(target.value, i)}
          />
        </div>
        <Hint>Describe the event in detail, or with prompts.</Hint>
      </Label>
    </Fields>
  );
}
