import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { noOp } from "../utils";
import { Climate, LocationType, Richness } from "../utils/types";
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
  Textarea
} from "components/Forms/Form";
import { CreateLocationData } from "graphql/requests/worlds.graphql";
import { GlobalWorld } from "state";
import { Accent } from "./Common/Containers";
import { getAndShowPrompt } from "api/loadUserData";
import { buildDescriptionPrompt } from "utils/prompt-builder";
import { ButtonWithIcon } from "./Forms/Button";
import { useGlobalWorld } from "hooks/GlobalWorld";
import SelectParentLocation from "./SelectParentLocation";
import SelectParentWorld from "./SelectParentWorld";

export type CreateLocationProps = {
  onChange?: (data: Partial<CreateLocationData>) => void;
};

/** `Climates` list */
const climates = [Climate.Warm, Climate.Temperate, Climate.Polar];
const abundance = [Richness.Sparse, Richness.Adequate, Richness.Abundant];

/* Location types */
const locationTypes = [
  LocationType.Other,
  LocationType.Continent,
  LocationType.Country,
  LocationType.Region,
  LocationType.City,
  LocationType.Town,
  LocationType.Ruins,
  LocationType.Village,
  LocationType.Settlement,
  LocationType.Building
];

const initialFormData = () => {
  const { focusedLocation, focusedWorld } = GlobalWorld.getState();
  const formData: Partial<CreateLocationData> = {};
  if (focusedLocation) {
    formData.id = focusedLocation.id;
    formData.authorId = focusedLocation.authorId;
    formData.description = focusedLocation.description;
    formData.name = focusedLocation.name;
    formData.parentLocationId = focusedLocation.parentLocationId;
    formData.type = focusedLocation.type;
    formData.climate = focusedLocation.climate;
    formData.flora = focusedLocation.flora;
    formData.fauna = focusedLocation.fauna;
  }
  if (focusedWorld && !formData.worldId) {
    formData.worldId = focusedWorld.id;
  }
  return formData;
};

/** Create or edit a `World` */
const CreateLocationForm = (props: CreateLocationProps) => {
  const { onChange = noOp } = props;
  const { worldLocations = [] } = useGlobalWorld(["worldLocations"]);
  const [data, setFormData] = useState(initialFormData());
  const update = (updates: Partial<CreateLocationData>) => {
    setFormData(updates);
    onChange(updates);
  };
  const onClimate = (e: Climate) => update({ ...data, climate: e });
  const onFlora = (e: Richness) => update({ ...data, flora: e });
  const onFauna = (e: Richness) => update({ ...data, fauna: e });
  const onDescription = (d: string) => update({ ...data, description: d });
  const onLocationType = (e: LocationType) => update({ ...data, type: e });
  const onTitle = ({ target }: ChangeEvent<HTMLInputElement>) =>
    update({ ...data, name: target.value });

  const onParent = (plid?: number | null) => {
    const pl = worldLocations.find((w) => w.id === plid);
    if (!pl) return update({ ...data, parentLocationId: undefined });
    const { climate, flora, fauna, id } = pl;
    return update({ ...data, parentLocationId: id, climate, flora, fauna });
  };

  const getDescriptionIdea = async () => {
    const dt = data.type || "place";
    const ideaPrompt = buildDescriptionPrompt({ ...data, type: dt });
    if (!ideaPrompt) return;
    const idea = await getAndShowPrompt(ideaPrompt);
    if (idea) onDescription(idea);
  };

  useEffect(() => {
    if (!data.type) update({ ...data, type: LocationType.Building });
  }, []);

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
            onChange={onTitle}
          />
        </Label>

        {/* Location type */}
        <Label direction="column">
          <span className="label required">
            Select <Accent>type</Accent>:
          </span>
          <Select
            data={locationTypes}
            value={data?.type}
            itemText={(d) => d}
            itemValue={(d) => d.id}
            placeholder="Select location type:"
            onChange={onLocationType}
          />
        </Label>
      </FormRow>

      <hr className="transparent" />

      <FormRow>
        {/* Parent World */}
        <Label direction="column">
          <span className="label required">
            Parent <Accent>World</Accent>?
          </span>
          <SelectParentWorld
            excludeWorld={data?.worldId}
            value={data?.worldId || ""}
            onChange={onParent}
            placeholder="Select Parent World:"
          />
        </Label>

        {/* Parent Location */}
        <Label direction="column">
          <span className="label">
            Is it in another <Accent>Location</Accent>?
          </span>
          <SelectParentLocation
            excludeLocation={data?.id}
            value={data?.parentLocationId || ""}
            worldId={data?.worldId}
            targetType={data?.type}
            onChange={onParent}
            placeholder="Select Parent Location (optional):"
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
        <Textarea
          rows={300}
          value={data?.description || ""}
          onChange={(e) => onDescription(e.target.value)}
        />
      </Label>

      <Hint>Give yourself some inspiration!</Hint>

      {!data?.description && (
        <ButtonWithIcon
          type="button"
          onClick={getDescriptionIdea}
          icon="tips_and_updates"
          size="lg"
          text="Get description ideas"
        />
      )}

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
                  onChange={() => onClimate(clim)}
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
                  onChange={() => onFlora(c)}
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
                  onChange={() => onFauna(r)}
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
