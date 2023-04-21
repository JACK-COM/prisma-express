import { ChangeEvent, useEffect, useMemo } from "react";
import { noOp } from "../utils";
import { Character, UserRole } from "../utils/types";
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
  Textarea,
  TinyMCE
} from "components/Forms/Form";
import { CreateCharacterData } from "graphql/requests/characters.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";

export type CreateCharacterProps = {
  data?: Partial<CreateCharacterData>;
  onChange?: (data: Partial<CreateCharacterData>) => void;
};

/** Create or edit a `Character` */
const CreateCharacterForm = (props: CreateCharacterProps) => {
  const { id: userId } = useGlobalUser(["id"]);
  const { data = {}, onChange = noOp } = props;
  const { worlds = [], focusedWorld } = useGlobalWorld();
  const role: UserRole = useMemo(() => {
    return !data.id || (data.authorId && userId === data.authorId)
      ? "Author"
      : "Reader";
  }, [userId, data]);
  const updateDescription = (description: string) => {
    onChange({ ...data, description });
  };
  const updateOrigin = (id: string) => {
    const worldId = Number(id);
    onChange({ ...data, worldId: isNaN(worldId) ? -1 : worldId });
  };
  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value });
  };

  useEffect(() => {
    if (focusedWorld && !data.worldId) {
      updateOrigin(focusedWorld.id.toString());
    }
  }, []);

  return (
    <Form>
      <Legend>
        {data.id ? (
          <>
            Edit <span className="accent--text">{data.name}</span>
          </>
        ) : (
          <>
            New <span className="accent--text">Character</span>
          </>
        )}
      </Legend>
      {role === "Reader" ? (
        <Hint>
          <b className="error--text">
            Editing disabled: you don't own this character.
          </b>
          <br />
          You can link any of your own characters to it, if they are in the same
          world.
          <hr />
        </Hint>
      ) : (
        <Hint>
          A <b>Character</b> is <b>a significant, recurring actor</b> in your
          story.{" "}
        </Hint>
      )}

      {/* Name */}
      <Label direction="column">
        <span className="label required">Character Name</span>
        <Input
          disabled={role === "Reader"}
          placeholder="Tog Omarai"
          type="text"
          value={data.name || ""}
          onChange={updateName}
        />
      </Label>
      <Hint>Enter a name for your character</Hint>

      {/* Origin Universe/Realm */}
      <Label direction="column">
        <span className="label required">
          Where is{" "}
          <span className="accent--text">{data.name || "your character"}</span>{" "}
          from?
        </span>
        <Select
          disabled={role === "Reader"}
          data={worlds}
          value={data.worldId || ""}
          itemText={(w) => w.name}
          itemValue={(w) => w.id}
          placeholder={"Select a universe/realm:"}
          onChange={updateOrigin}
        />
      </Label>
      <Hint>
        Select the <b>Universe</b> or <b>Realm</b> of this character's origin.
      </Hint>

      {/* Description */}
      <Label direction="column">
        <span className="label">Short Description</span>
        <TinyMCE
          disabled={role === "Reader"}
          height={300}
          value={data.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>Describe your character as a series of short writing-prompts.</Hint>
    </Form>
  );
};

export default CreateCharacterForm;
