import styled from "styled-components";
import { APIData, UserRole, Character } from "utils/types";
import { requireAuthor, noOp } from "utils";
import {
  ItemDescription,
  ItemGridContainer,
  ItemName,
  MatIcon
} from "components/Common/Containers";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { TallIcon } from "./ComponentIcons";

const Location = styled.span`
  ${({ theme }) => theme.mixins.ellipsis};
  align-self: center;
  font-size: small;
  grid-row: 1 / span 2;
  padding-right: 0.5rem;
  text-transform: uppercase;

  @media screen and (max-width: 424px) {
    display: none;
  }
`;
const Relationships = styled(TallIcon).attrs({ icon: "groups" })`
  animation-delay: 200ms;
`;
const DeleteIcon = styled(TallIcon).attrs({ icon: "delete" })`
  animation-delay: 400ms;
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
  const { id, role } = useGlobalUser(["id", "role"]);
  const { getWorld } = useGlobalWorld();
  const world = character.worldId ? getWorld(character.worldId) : null;
  const isOwner = character.authorId === id;
  const isPub = world?.public;
  const pubClass = !world ? "gray" : isPub ? "success--text" : "error--text";
  const deleteCharacter = requireAuthor(() => onRemove(character.id), role);
  const select = requireAuthor(() => onSelect(character), role);
  const editCharacter = requireAuthor(() => onEdit(character), role);
  const editRelationships = requireAuthor(
    () => onRelationships(character),
    role
  );

  return (
    <ItemGridContainer onClick={select} permissions={permissions}>
      <TallIcon
        icon={isOwner ? "face" : "lock"}
        className={pubClass}
        permissions={permissions}
        onClick={editCharacter}
      />

      <ItemName permissions={permissions} onClick={editCharacter}>
        {character.name}
        {isOwner && <MatIcon className="icon" icon="edit" />}
      </ItemName>

      <ItemDescription
        dangerouslySetInnerHTML={characterDescription(character)}
      />

      {character.worldId && (
        <Location className={pubClass} children={world?.name || ""} />
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
  return { __html: d };
}
