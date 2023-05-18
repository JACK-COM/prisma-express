import styled from "styled-components";
import { APIData, UserRole, Character } from "utils/types";
import { requireAuthor, noOp } from "utils";
import {
  ItemDescription,
  ItemGridContainer,
  ItemName,
  ItemWorldName} from "components/Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { TallIcon } from "./ComponentIcons";
import Tooltip from "./Tooltip";

const Relationships = styled(TallIcon).attrs({ icon: "groups" })`
  animation-delay: 200ms;
  grid-column: initial;
  grid-row: initial;
`;
const DeleteIcon = styled(TallIcon).attrs({ icon: "delete" })`
  animation-delay: 400ms;
  grid-column: initial;
  grid-row: initial;
  order: 99;
`;

type CharacterItemProps = {
  character: APIData<Character>;
  onEdit?: (w: APIData<Character>) => void;
  onSelect?: (w: APIData<Character>) => void;
  onRelationships?: (w: APIData<Character>) => void;
  onRemove?: (w: number) => void;
  permissions?: UserRole;
};

/** @component A single `Character` created by a user */
const CharacterItem = ({
  character,
  onSelect = noOp,
  onEdit = noOp,
  onRemove = noOp,
  onRelationships = noOp,
  permissions = "Reader"
}: CharacterItemProps) => {
  const { id } = useGlobalUser(["id"]);
  const { getWorld } = useGlobalWorld();
  const world = character.worldId ? getWorld(character.worldId) : null;
  const isOwner = character.authorId === id;
  const isPub = world?.public;
  const pubClass = !world ? "gray" : isPub ? "success--text" : "error--text";
  const deleteCharacter = requireAuthor(
    () => onRemove(character.id),
    permissions
  );
  const select = () => onSelect(character);
  const editCharacter = requireAuthor(() => onEdit(character), permissions);
  const editRelationships = requireAuthor(
    () => onRelationships(character),
    permissions
  );

  return (
    <ItemGridContainer
      columns="24px 10fr 1fr repeat(2, max-content)"
      onClick={select}
      permissions={permissions}
    >
      <TallIcon
        icon={isOwner ? "face" : "lock"}
        className={pubClass}
        permissions={permissions}
        onClick={editCharacter}
      />

      <Tooltip text={characterDescription(character)}>
        <ItemName permissions={permissions} onClick={editCharacter}>
          {character.name}
          {isOwner && <MatIcon className="icon" icon="edit" />}
        </ItemName>
      </Tooltip>

      {character.worldId && (
        <ItemWorldName public={world?.public} children={world?.name || ""} />
      )}

      {isOwner && (
        <>
          <Relationships
            onClick={editRelationships}
            permissions={permissions}
          />
          <DeleteIcon onClick={deleteCharacter} permissions={permissions} />
        </>
      )}
    </ItemGridContainer>
  );
};

export default CharacterItem;

/* HELPER */

/** Describe a character by its qualities */
function characterDescription(character: Character) {
  const d =
    character.description !== "No description."
      ? character.description
      : "A mysterious character";
  // return { __html: d };
  return d;
}
