import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { noOp } from "../utils";
import { UserRole } from "../utils/types";
import {
  Form,
  Hint,
  Input,
  Label,
  Legend,
  Select,
  Textarea
} from "components/Forms/Form";
import { CreateCharacterData } from "graphql/requests/characters.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { GlobalCharacter, GlobalWorld } from "state";
import SelectParentWorld from "./SelectParentWorld";

export type CreateCharacterProps = {
  data?: Partial<CreateCharacterData>;
  onChange?: (data: Partial<CreateCharacterData>) => void;
};

const initialFormData = () => {
  const { focusedWorld, focusedLocation } = GlobalWorld.getState();
  const { focusedCharacter } = GlobalCharacter.getState();
  const { worldId: owid } = focusedCharacter || focusedLocation || {};
  const worldId = owid || focusedWorld?.id;
  const formData: Partial<CreateCharacterData> = { worldId };
  if (focusedCharacter) {
    formData.id = focusedCharacter.id;
    formData.authorId = focusedCharacter.authorId;
    formData.description = focusedCharacter.description;
    formData.name = focusedCharacter.name;
    formData.locationId = focusedCharacter.locationId;
  }
  if (!formData.locationId && focusedLocation) {
    formData.locationId = focusedLocation.id;
  }
  return formData;
};

/** Create or edit a `Character` */
const CreateCharacterForm = (props: CreateCharacterProps) => {
  const { onChange = noOp } = props;
  const { id: userId } = useGlobalUser(["id"]);
  const { worlds = [] } = useGlobalWorld(["worlds"]);
  const data = initialFormData();
  const { authorId, id: charId } = data;
  const [formData, setFormData] = useState<Partial<CreateCharacterData>>(data);
  const role = useMemo<UserRole>(() => {
    return !charId || (authorId && userId === authorId) ? "Author" : "Reader";
  }, [userId, data]);
  const hasLocation = useMemo(
    () => Boolean(data.id && (data.locationId || data.worldId)),
    [data]
  );
  const update = (updates: Partial<CreateCharacterData>) => {
    setFormData(updates);
    onChange(updates);
  };
  const onDescription = (d: string) => update({ ...formData, description: d });
  const onOrigin = (worldId?: number | null) =>
    update({ ...formData, worldId: worldId || undefined });
  const onName = (e: ChangeEvent<HTMLInputElement>) => {
    update({ ...formData, name: e.target.value });
  };

  useEffect(() => {
    update(data);
  }, []);

  return (
    <Form>
      <Legend>
        {formData.id ? (
          <>
            Edit <span className="accent--text">{formData.name}</span>
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
          value={formData.name || ""}
          onChange={onName}
        />
      </Label>
      <Hint>Enter a name for your character</Hint>

      {/* Origin Universe/Realm */}
      <Label direction="column">
        <span className="label required">
          Where is{" "}
          <span className="accent--text">
            {formData.name || "your character"}
          </span>{" "}
          from?
        </span>
        <SelectParentWorld
          onChange={onOrigin}
          placeholder="Select a universe/realm:"
          value={formData.worldId || ""}
        />
      </Label>

      {hasLocation ? (
        <Hint className="error--text">
          This character is linked to the current world or location.
        </Hint>
      ) : (
        <Hint>
          Select the <b>Universe</b> or <b>Realm</b> of this character's origin.
        </Hint>
      )}

      {/* Description */}
      <Label direction="column">
        <span className="label">Short Description</span>
        <Textarea
          disabled={role === "Reader"}
          rows={300}
          value={formData.description || ""}
          onChange={(e) => onDescription(e.target.value)}
        />
      </Label>
      <Hint>Describe your character as a series of short writing-prompts.</Hint>
    </Form>
  );
};

export default CreateCharacterForm;
