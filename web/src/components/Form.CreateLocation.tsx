import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { APIData, Climate, Location, Richness } from "../utils/types";
import {
  Fieldset,
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  RadioInput,
  RadioLabel,
  Select,
  TinyMCE
} from "components/Forms/Form";
import { CreateLocationData } from "graphql/requests/worlds.graphql";
import { GlobalWorld } from "state";
import { Accent } from "./Common/Containers";

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
  const { worldLocations } = GlobalWorld.getState();
  const updateClimate = (e: Climate) => onChange({ ...data, climate: e });
  const updateFlora = (e: Richness) => onChange({ ...data, flora: e });
  const updateFauna = (e: Richness) => onChange({ ...data, fauna: e });
  const updateDescription = (description: string) => {
    onChange({ ...data, description });
  };
  const updateParent = (pi?: string) => {
    if (!pi) return onChange({ ...data, parentLocationId: undefined });
    const plid = Number(pi);
    const pl = worldLocations.find((w) => w.id === plid);
    if (!pl) return onChange({ ...data, parentLocationId: undefined });

    const { climate, flora, fauna, id } = pl;
    return onChange({ ...data, parentLocationId: id, climate, flora, fauna });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  return (
    <Form>
      <Legend>
        New <Accent>Location</Accent>
      </Legend>
      <Hint>
        A <b>Location</b> is <b>a unique setting</b> in a <b>world</b>. It can
        be anywhere that a story scene takes place.
      </Hint>

      <FormRow>
        {/* Name */}
        <Label direction="column">
          <span className="label required">
            Location <Accent>Name</Accent>
          </span>
          <Input
            placeholder="North Omarai"
            type="text"
            value={data?.name || ""}
            onChange={updateTitle}
          />
        </Label>

        {/* Parent Location */}
        <Label direction="column">
          <span className="label">
            Is it in another <Accent>Location</Accent>?
          </span>
          <Select
            data={worldLocations}
            value={data?.parentLocationId || ""}
            itemText={(d) => d.name}
            itemValue={(d) => d.id}
            placeholder="Select Parent Location (optional):"
            onChange={updateParent}
          />
        </Label>
      </FormRow>
      <Hint>
        Enter a name for your <b>location</b>.
      </Hint>

      <hr />

      {/* Description */}
      <Label direction="column">
        <span className="label">
          Short <Accent>description</Accent>
        </span>
        <TinyMCE
          height={300}
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>Give yourself some inspiration!</Hint>

      <hr />

      {/* Plant-life */}
      <Fieldset disabled={Boolean(data?.parentLocationId)}>
        <Legend>
          Other <Accent>attributes</Accent>
        </Legend>
        <Hint>
          <b>(Optional)</b> You can use these to auto-generate a description.
          The fields will be disabled and inherit from a parent location, if you
          select one.
        </Hint>

        {/* Climate */}
        <Label direction="column">
          <span className="label">
            How's the <Accent>climate</Accent>?
          </span>

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
          <Hint>
            <b>(Optional)</b> Set the general climate of the region.
          </Hint>
        </Label>

        <hr />
        <Label direction="column">
          <span className="label">
            What about the <Accent>plant life</Accent>?
          </span>

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
          <Hint>
            <b>(Optional)</b> Select <b>adequate</b> if you don't really care.
          </Hint>
        </Label>

        <hr />

        {/* Animal-life */}
        <Label direction="column">
          <span className="label">
            How abundant is the <Accent>animal life</Accent>?
          </span>

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
          <Hint>
            <b>(Optional)</b> Select <b>sparse</b> if animals are rare or
            nonexistent.
          </Hint>
        </Label>
      </Fieldset>
    </Form>
  );
};

export default CreateLocationForm;
