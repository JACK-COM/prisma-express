import { ChangeEvent, useMemo, useState } from "react";
import {
  FormRow,
  Hint,
  Input,
  Label,
  RadioInput,
  RadioLabel,
  Select,
  Textarea
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
import { MatIcon } from "./Common/Containers";

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
  const updateDescription = (
    e: ChangeEvent<HTMLTextAreaElement>,
    i: number
  ) => {
    onChanged({ ...data, description: e.target.value }, i);
  };

  return (
    <Fields>
      <FieldRow columns="repeat(2, 1fr)">
        {/* Event Name */}
        <Label direction="column">
          <span className="label required">Event Name</span>
          <Input
            placeholder={`e.g. Creation of ${world?.name || "this Universe"}`}
            type="text"
            value={data.name || ""}
            onChange={(x) => updateName(x, i)}
          />
          <Hint>Enter a short, recognizable name for this event.</Hint>
        </Label>

        {/* Event Target */}
        <Label direction="column">
          <span className="label required">Event Target</span>
          <Select
            data={targets}
            value={data.target || EventTarget.World}
            itemText={(d: EventTarget) => d.valueOf()}
            itemValue={(d) => d}
            emptyMessage="No other characters in current world."
            placeholder="Select a target:"
            onChange={(ch) => updateTarget(ch, i)}
          />
          <Hint>Who (or where) is mainly affected by the Event.</Hint>
        </Label>
      </FieldRow>

      <hr />

      {/* Event Polarity */}
      <Label direction="column">
        <span className="label required">Event Polarity</span>
        <Hint>Choose the type of event, if relevant.</Hint>
      </Label>

      <FormRow columns="repeat(3, 1fr)">
        {polarity.map((p) => (
          <RadioLabel key={p}>
            <span>{EventPolarityText(p)}</span>
            <RadioInput
              checked={data.polarity === p}
              name={`polarity-${i}`}
              onChange={() => updatePolarity(p, i)}
            />
          </RadioLabel>
        ))}
      </FormRow>

      <hr />

      {/* Description */}
      <Label direction="column">
        <span className="label flex" onClick={() => setShowDesc(!showDesc)}>
          Description (optional)
          <MatIcon icon={`visibility${showDesc ? "" : "_off"}`} />
        </span>
        <Textarea
          className={showDesc ? "expand--vertical" : "collapse--vertical"}
          placeholder="e.g. The universe was created by the Great Old Ones."
          value={data.description || ""}
          onChange={(x) => updateDescription(x, i)}
        />
        <Hint>Describe the event in detail, or with prompts.</Hint>
      </Label>
    </Fields>
  );
}
