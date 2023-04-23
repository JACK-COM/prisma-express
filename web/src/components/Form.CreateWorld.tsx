import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { WorldType } from "../utils/types";
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
  TinyMCE
} from "components/Forms/Form";
import { CreateWorldData } from "graphql/requests/worlds.graphql";
import { Accent } from "./Common/Containers";
import { GlobalWorld } from "state";

export type CreateWorldProps = {
  data?: Partial<CreateWorldData>;
  onChange?: (data: Partial<CreateWorldData>) => void;
};

/** `WorldTypes` list */
const worldTypes = [WorldType.Universe, WorldType.Realm, WorldType.Other];

/** Create or edit a `World` */
const CreateWorldForm = (props: CreateWorldProps) => {
  const { data, onChange = noOp } = props;
  const { worlds } = GlobalWorld.getState();
  const updatePublic = (e: boolean) => onChange({ ...data, public: e });
  const updateType = (type: WorldType) => onChange({ ...data, type });
  const updateDescription = (description: string) => {
    onChange({ ...data, description });
  };
  const updateParent = (pwid: string) => {
    onChange({ ...data, parentWorldId: Number(pwid) });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  return (
    <Form>
      <Legend>
        {data?.id ? `Manage ${data.type}` : "New World or Universe"}
      </Legend>
      <Hint>
        A <b>World</b> is <b>a collection of unique settings</b> in a story. It
        can be anything from a planet or galaxy to a dimension with neither
        space nor time -- as long as it contains two or more related settings.
      </Hint>

      {/* Name */}
      <FormRow>
        <Label direction="column">
          <span className="label required">
            World <span className="accent--text">Name</span>
          </span>
          <Input
            placeholder="The Plains of Omarai"
            type="text"
            value={data?.name || ""}
            onChange={updateTitle}
          />
        </Label>

        {/* Parent World */}
        <Label direction="column">
          <span className="label">
            Is it in another <Accent>World</Accent>?
          </span>
          <Select
            data={worlds}
            value={data?.parentWorldId || ""}
            itemText={(d) => d.name}
            itemValue={(d) => d.id}
            placeholder="Select Parent World (optional):"
            onChange={updateParent}
          />
        </Label>
      </FormRow>
      <Hint>Enter a name for your world.</Hint>

      <FormRow>
        {/* World Type */}
        <Label direction="column">
          <span className="label required">
            What <Accent>type</Accent> of World is it?
          </span>
          <Select
            data={worldTypes}
            value={data?.type || ""}
            itemText={(d) => d.valueOf()}
            itemValue={(d) => d}
            placeholder="Select a World Type:"
            onChange={updateType}
          />
        </Label>

        {/* Public/Private */}
        <Label direction="column">
          <span className="label">
            Is this world <Accent>public</Accent>?
          </span>

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
      </FormRow>
      <Hint>
        Select <b>Realm</b> if you are creating a mystical or transdimensional
        space. You can set the world <b>Public</b> if you would like other users
        to add locations and characters to it.
      </Hint>
      <hr />

      {/* Description */}
      <Label direction="column">
        <span className="label required">Short Description</span>
        <TinyMCE
          height={300}
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>Describe your world as a series of short writing-prompts.</Hint>
    </Form>
  );
};

export default CreateWorldForm;
