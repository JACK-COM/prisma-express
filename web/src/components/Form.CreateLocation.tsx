import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { Richness, World, WorldType } from "../utils/types";
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
const worldTypes = [WorldType.Universe, WorldType.Realm, WorldType.Other];

/** Create or edit a `World` */
const CreateLocationForm = (props: CreateLocationProps) => {
  const { data, onChange = noOp } = props;
  const updateFlora = (e: Richness) => onChange({ ...data, flora: e });
  const updateFauna = (e: Richness) => onChange({ ...data, fauna: e });
  const updateType = (type: WorldType) => onChange({ ...data, type });
  const updateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, description: e.target.value });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  return (
    <Form>
      <Legend>New World or Universe</Legend>
      <Hint>
        A <b>Location</b> is <b>a unique setting</b> in a <b>world</b>. It
        can be anything from a planet or galaxy to a dimension with neither
        space nor time -- as long as it contains two or more related settings.
      </Hint>

      {/* Name */}
      <Label direction="column">
        <span className="label required">World Name</span>
        <Input
          placeholder="The Plains of Omarai"
          type="text"
          value={data?.name || ""}
          onChange={updateTitle}
        />
      </Label>
      <Hint>Enter a name for your world.</Hint>

      {/* Public/Private */}
      <Label direction="column">
        <span className="label">Is this world public?</span>
        <Hint>
          Select <b>Public</b> if you would like other users to see and build on
          this idea.
        </Hint>

        <FormRow>
          <RadioLabel>
            <span>Public</span>
            <RadioInput
              checked={data?.public || false}
              name="isPublic"
              onChange={() => updatePublic(true)}
            />
          </RadioLabel>
          <RadioLabel>
            <span>Private</span>
            <RadioInput
              checked={!data?.public}
              name="isPublic"
              onChange={() => updatePublic(false)}
            />
          </RadioLabel>
        </FormRow>
      </Label>

      {/* Type */}
      <Label direction="column">
        <span className="label required">What type of World is it?</span>
        <Select
          data={worldTypes}
          value={data?.type || ""}
          itemText={(d) => d.valueOf()}
          itemValue={(d) => d}
          placeholder="Select a World Type:"
          onChange={updateType}
        />
      </Label>
      <Hint>
        Select <b>Realm</b> if e.g. you've got a mystical or transdimensional
        space.
      </Hint>

      {/* Description */}
      <Label direction="column">
        <span className="label required">Short Description</span>
        <Textarea
          placeholder="Enter world description"
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>Describe your world as a series of short writing-prompts.</Hint>
    </Form>
  );
};

export default CreateLocationForm;
