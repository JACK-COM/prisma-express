import { ChangeEvent } from "react";
import { noOp } from "../utils";
import { Character } from "../utils/types";
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
import { CreateCharacterData } from "graphql/requests/characters.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";

export type CreateCharacterProps = {
  data?: Partial<CreateCharacterData>;
  onChange?: (data: Partial<CreateCharacterData>) => void;
};

/** Create or edit a `Character` */
const CreateCharacterForm = (props: CreateCharacterProps) => {
  const { data, onChange = noOp } = props;
  const { worlds = [] } = useGlobalWorld();
  const updateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, description: e.target.value });
  };
  const updateOrigin = (id: string) => {
    const worldId = Number(id);
    onChange({ ...data, worldId: isNaN(worldId) ? -1 : worldId });
  };
  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  return (
    <Form>
      <Legend>New Character</Legend>
      <Hint>
        A <b>Character</b> is <b>a significant, recurring actor</b> in your
        story.
      </Hint>

      {/* Name */}
      <Label direction="column">
        <span className="label required">Character Name</span>
        <Input
          placeholder="Tog Omarai"
          type="text"
          value={data?.name || ""}
          onChange={updateName}
        />
      </Label>
      <Hint>Enter a name for your character</Hint>

      {/* Origin Universe/Realm */}
      <Label direction="column">
        <span className="label required">
          Where is {data?.name || "your character"} from?
        </span>
        <Select
          data={worlds}
          value={data?.worldId || ""}
          itemText={(w) => w.name}
          itemValue={(w) => w.id}
          placeholder="Select a universe/realm:"
          onChange={updateOrigin}
        />
      </Label>
      <Hint>
        Select the <b>Universe</b> or <b>Realm</b> of this character's origin.
      </Hint>

      {/* Description */}
      <Label direction="column">
        <span className="label">Short Description</span>
        <Textarea
          placeholder="Enter characterdescription"
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>Describe your characteras a series of short writing-prompts.</Hint>
    </Form>
  );
};

export default CreateCharacterForm;
