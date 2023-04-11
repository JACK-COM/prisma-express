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
import {
  CreateRelationshipData,
  deleteRelationship
} from "graphql/requests/characters.graphql";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import { ButtonWithIcon, WideButton } from "./Forms/Button";
import { DeleteItemIcon } from "./ComponentIcons";
import styled from "styled-components";

export type CreateRelationshipsProps = {
  /** Character to link to relationships */
  character: APIData<Character>;
  /** Pre-existing relationship data (if any) */
  data?: Partial<CreateRelationshipData>[];
  /** Data change handler */
  onChange?: (data: Partial<CreateRelationshipData>[]) => void;
};

const RelationshipItem = styled(FormRow)`
  margin-bottom: 0.6rem;
  padding-bottom: 0.6rem;

  &.other {
    background-color: ${({ theme }) => theme.colors.semitransparent};
    border-radius: 4px;
    padding: 0.6rem;
  }
`;

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
  const removeRelationship = async (i: number) => {
    const old = data[i];
    if (old.id) await deleteRelationship(old.id);
    const next = data.filter((v, x) => x !== i);
    onChange(next);
  };
  const addRelationshipStub = () => {
    onChange([...data, { characterId: character.id }]);
  };
  const matchRel = (rel: Partial<CreateRelationshipData>) => {
    return rel.characterId === character.id;
  };
  const required = (rel: Partial<CreateRelationshipData>) => {
    return matchRel(rel) ? "label required" : "label";
  };

  return (
    <Form>
      {/* Name */}
      <Legend>
        <span className="accent--text">{character.name}'s</span> Relationships
      </Legend>
      <Hint>
        Here, you can define a link between {character.name} and{" "}
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
        <RelationshipItem
          key={i}
          columns={matchRel(relt) ? "1fr 1fr 32px" : "repeat(2, 1fr)"}
          className={matchRel(relt) ? undefined : "other"}
        >
          {/* Target Character (id) */}
          <Label direction="column">
            <span className={required(relt)}>
              {matchRel(relt) ? "Target" : "Other Character"}
            </span>
            <Select
              disabled={relt.characterId !== character.id}
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
            <span className={required(relt)}>Relationship(s)</span>
            <Input
              disabled={relt.characterId !== character.id}
              placeholder={`How do they relate to ${character.name}?`}
              value={relt?.relationship || ""}
              onChange={(e) => updateRelationship(e, i)}
            />
          </Label>

          {matchRel(relt) && (
            <DeleteItemIcon
              style={{ gridColumn: 3 }}
              permissions="Author"
              data={i}
              onItemClick={removeRelationship}
            />
          )}
        </RelationshipItem>
      ))}

      <Hint>
        You can list multiple relationships in a field, or add one relationship
        per target.
      </Hint>

      <hr />

      <ButtonWithIcon
        type="button"
        onClick={addRelationshipStub}
        icon="add"
        text={data.length ? "Add another relationship" : "Add a relationship"}
        size="lg"
        variant="outlined"
      />
    </Form>
  );
};

export default CreateRelationshipsForm;
