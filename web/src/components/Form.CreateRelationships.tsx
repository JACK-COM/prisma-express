import { ChangeEvent, useMemo } from "react";
import { noOp } from "../utils";
import { APIData, Character, CharacterRelationship } from "../utils/types";
import {
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  Select
} from "components/Forms/Form";
import { CreateRelationshipData } from "graphql/requests/characters.graphql";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import { ButtonWithIcon, WideButton } from "./Forms/Button";

export type CreateRelationshipsProps = {
  /** Character to link to relationships */
  character: APIData<Character>;
  /** Pre-existing relationship data (if any) */
  data?: Partial<CreateRelationshipData>[];
  /** Data change handler */
  onChange?: (data: Partial<CreateRelationshipData>[]) => void;
};

/** Create or edit a list of `Character Relationships` */
type ItemKey = keyof APIData<CharacterRelationship>;
const CreateRelationshipsForm = (props: CreateRelationshipsProps) => {
  const { character, data = [], onChange = noOp } = props;
  const { characters = [] } = useGlobalCharacter(["characters"]);
  const targets = useMemo(() => {
    return characters.filter(
      (c) => c.id !== character.id && c.worldId === character.worldId
    );
  }, [characters, character]);
  const upData = (
    k: ItemKey,
    v: APIData<CharacterRelationship>[typeof k],
    i = 0
  ) => {
    const next = [...data];
    const target = { ...data[i], [k]: v };
    next[i] = target;
    onChange(next);
  };
  const updateTarget = (targetId: string, i = 0) => {
    upData("targetId", Number(targetId), i);
  };
  const updateRelationship = (e: ChangeEvent<HTMLInputElement>, i = 0) => {
    upData("relationship", e.target.value, i);
  };
  const addRelationshipStub = () => {
    onChange([...data, { characterId: character.id }]);
  };

  return (
    <Form>
      {/* Name */}
      <Legend>{character.name}'s Relationships</Legend>
      <Hint>
        Here, you can define a link between {character.name} and
        <b>one or more characters</b> in their world. It is a simple way to keep
        track of who knows or is related to whom.
      </Hint>

      <hr />

      <Label direction="column">
        <span className="label">Add relationships</span>
        <Hint>
          Select another <b>Character</b> in the <b>world</b> and define their
          relationship (e.g. "nemesis", "sister").
        </Hint>
      </Label>

      {/* Relationships List */}
      {data.map((relt, i) => (
        <FormRow key={i}>
          {/* Target Character (id) */}
          <Label direction="column">
            <span className="label required">Target Character</span>
            <Select
              data={targets}
              value={relt.targetId || ""}
              itemText={(d: APIData<Character>) => d.name}
              itemValue={(d) => d.id}
              emptyMessage="No other characters in current world."
              placeholder="Select a target:"
              onChange={(ch) => updateTarget(ch, i)}
            />
          </Label>

          {/* Relationship description */}
          <Label direction="column">
            <span className="label required">Relationship</span>
            <Input
              placeholder={`Who is ${character.name} to them?`}
              value={relt?.relationship || ""}
              onChange={(e) => updateRelationship(e, i)}
            />
          </Label>
        </FormRow>
      ))}

      <Hint>
        Describe {character.name}'s relationship to the <b>target</b> in the{" "}
        <b>relationship</b> field.
      </Hint>

      <hr />

      <ButtonWithIcon
        type="button"
        onClick={addRelationshipStub}
        icon="add"
        text={"Add another relationship"}
        size="lg"
        variant="outlined"
      />
    </Form>
  );
};

export default CreateRelationshipsForm;
