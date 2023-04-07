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
  const onChange = props.onChange || noOp;
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...props.data, name: e.target.value });
  };
  const updateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...props.data, description: e.target.value });
  };
  const updateType = (type: WorldType) => {
    onChange({ ...props.data, type });
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
        <span className="label">World Name</span>
        <Input
          placeholder="The Plains of Omarai"
          type="text"
          onChange={updateTitle}
        />
      </Label>
      <Hint>Enter a name for your world.</Hint>

      {/* Type */}
      <Label direction="column">
        <span className="label">Select Label</span>
        <Select
          data={worldTypes}
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
        <span className="label">Short Description</span>
        <Textarea
          placeholder="Enter world description"
          onChange={updateDescription}
        />
      </Label>
      <Hint>Describe your world as a series of short writing-prompts.</Hint>
    </Form>
  );
};

export default CreateWorldForm;
