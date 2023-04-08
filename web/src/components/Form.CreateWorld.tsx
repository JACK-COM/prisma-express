import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { World, WorldType } from "../utils/types";
import {
  Form,
  Hint,
  Input,
  Label,
  Legend,
  Select,
  Textarea
} from "components/Forms/Form";
import { CreateWorldData } from "graphql/requests/worlds.graphql";

export type CreateWorldProps = {
  data?: Partial<CreateWorldData>;
  onChange?: (data: Partial<CreateWorldData>) => void;
};

/** `WorldTypes` list */
const worldTypes = [WorldType.Universe, WorldType.Realm, WorldType.Other];

/** Create or edit a `World` */
const CreateWorldForm = (props: CreateWorldProps) => {
  const { data, onChange = noOp } = props;
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };
  const updateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, description: e.target.value });
  };
  const updateType = (type: WorldType) => {
    onChange({ ...data, type });
  };

  return (
    <Form>
      <Legend>New World or Universe</Legend>
      <Hint>
        A <b>World</b> is <b>a collection of unique settings</b> in a story. It
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

export default CreateWorldForm;
