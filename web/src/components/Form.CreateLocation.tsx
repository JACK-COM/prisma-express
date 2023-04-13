import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { Climate, Richness, World, WorldType } from "../utils/types";
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
import { CreateLocationData } from "graphql/requests/worlds.graphql";

export type CreateLocationProps = {
  data?: Partial<CreateLocationData>;
  onChange?: (data: Partial<CreateLocationData>) => void;
};

/** `WorldTypes` list */
const climates = [Climate.Warm, Climate.Temperate, Climate.Polar];
const abundance = [Richness.Sparse, Richness.Adequate, Richness.Abundant];

/** Create or edit a `World` */
const CreateLocationForm = (props: CreateLocationProps) => {
  const { data, onChange = noOp } = props;
  const updateClimate = (e: Climate) => onChange({ ...data, climate: e });
  const updateFlora = (e: Richness) => onChange({ ...data, flora: e });
  const updateFauna = (e: Richness) => onChange({ ...data, fauna: e });
  const updateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, description: e.target.value });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  return (
    <Form>
      <Legend>New Location</Legend>
      <Hint>
        A <b>Location</b> is <b>a unique setting</b> in a <b>world</b>. It can
        be anywhere that a story scene takes place.
      </Hint>

      {/* Name */}
      <Label direction="column">
        <span className="label required">Location Name</span>
        <Input
          placeholder="North Omarai"
          type="text"
          value={data?.name || ""}
          onChange={updateTitle}
        />
      </Label>
      <Hint>
        Enter a name for your <b>location</b>.
      </Hint>

      {/* Public/Private */}
      <Label direction="column">
        <span className="label">How's the climate?</span>
        <Hint>
          <b>(Optional)</b> Set the general climate of the region.
        </Hint>

        <FormRow columns="repeat(3, 1fr)">
          {climates.map((clim) => (
            <RadioLabel key={clim.valueOf()}>
              <span>{clim.valueOf()}</span>
              <RadioInput
                checked={data?.climate === clim}
                name="local-climate"
                onChange={() => updateClimate(clim)}
              />
            </RadioLabel>
          ))}
        </FormRow>
      </Label>

      {/* Plant-life */}
      <Label direction="column">
        <span className="label">What about the plant life?</span>

        <FormRow columns="repeat(3, 1fr)">
          {abundance.map((c) => (
            <RadioLabel key={c.valueOf()}>
              <span>{c.valueOf()}</span>
              <RadioInput
                checked={data?.flora === c}
                name="local-flora"
                onChange={() => updateFlora(c)}
              />
            </RadioLabel>
          ))}
        </FormRow>
      </Label>
      <Hint>
        Optional field. Select <b>adequate</b> if you don't really care.
      </Hint>

      {/* Animal-life */}
      <Label direction="column">
        <span className="label">What about the animal life?</span>

        <FormRow columns="repeat(3, 1fr)">
          {abundance.map((r) => (
            <RadioLabel key={r.valueOf()}>
              <span>{r.valueOf()}</span>
              <RadioInput
                checked={data?.fauna === r}
                name="local-fauna"
                onChange={() => updateFauna(r)}
              />
            </RadioLabel>
          ))}
        </FormRow>
      </Label>
      <Hint>
        Optional field. Select <b>sparse</b> if this place is a desert.
      </Hint>

      {/* Description */}
      <Label direction="column">
        <span className="label">Short Description</span>
        <Textarea
          placeholder="Enter location description"
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>Give yourself some inspiration!</Hint>
    </Form>
  );
};

export default CreateLocationForm;
