import styled, { css } from "styled-components";
import { APIData, UserRole, Character, World, Richness } from "utils/types";
import { requireAuthor, noOp } from "utils";
import { ellipsis, lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";
import { useMemo } from "react";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { useGlobalUser } from "hooks/GlobalUser";
import { PermissionedIcon, editableStyles } from "./ComponentIcons";

type WICProps = { permissions: UserRole };
const Container = styled(GridContainer)<WICProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  grid-template-columns: 24px 1fr max-content 24px 24px;
  grid-column-gap: ${({ theme }) => theme.sizes.sm};
  justify-content: start;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;

  @media screen and (max-width: 424px) {
    /* Drop to 4 columns */
    grid-template-columns: 24px 1fr 24px 24px;
  }
`;

const Description = styled(Hint)`
  ${lineclamp(1)};
  grid-column: 2/-1;
  grid-row: 2;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<WICProps>`
  cursor: pointer;
  grid-column: 2/-1;
  grid-row: 1;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  ${editableStyles};

  .icon {
    display: inline-block;
    padding: ${({ theme }) => theme.sizes.xs};
    font-size: smaller;
  }
`;
const Location = styled.span`
  ${ellipsis()};
  align-self: center;
  font-size: smaller;
  grid-row: 1 / span 2;
  padding-right: 0.5rem;
  text-transform: uppercase;

  @media screen and (max-width: 424px) {
    display: none;
  }
`;
const TallIcon = styled(PermissionedIcon)`
  align-self: center;
  animation-fill-mode: backwards;
  grid-row: 1 / span 2;
`;
const Face = styled(TallIcon).attrs({ icon: "face" })``;
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
  permissions?: UserRole;
};

const CharacterItem = ({
  character,
  onSelect = noOp,
  onEdit = noOp,
  onRelationships = noOp,
  permissions = "Reader"
}: CharacterItemProps) => {
  const iconClass = "icon grey--text";
  const { id, role } = useGlobalUser(["id", "role"]);
  const { getWorld } = useGlobalWorld();
  const world = character.worldId ? getWorld(character.worldId) : null;
  const isOwner = character.authorId === id;
  const editCharacter = requireAuthor(() => {
    onEdit(character);
  }, role);
  const editRelationships = requireAuthor(
    () => onRelationships(character),
    role
  );
  const deleteCharacter = requireAuthor(() => {
    /* onDelete(character) */
  }, role);
  const select = requireAuthor(() => onSelect(character), role);

  return (
    <Container onClick={select} permissions={permissions}>
      <Face
        permissions={permissions}
        onClick={editCharacter}
        className={iconClass}
      />

      <Name permissions={permissions} onClick={editCharacter}>
        {character.name}
        {isOwner && <MatIcon className="icon" icon="edit" />}
      </Name>

      <Description>{characterDescription(character)}</Description>

      {character.worldId && <Location children={world?.name || ""} />}

      {isOwner && (
        <>
          <Relationships
            onClick={editRelationships}
            permissions={permissions}
          />
          <DeleteIcon onClick={deleteCharacter} permissions={permissions} />
        </>
      )}
    </Container>
  );
};

export default CharacterItem;

/* HELPER */

/** Describe a character by its qualities */
function characterDescription(character: Character) {
  if (character.description !== "No description.") return character.description;
  return "A mysterious character";

  /* const abundance = (lbl: string, rch: Richness) => {
    switch (rch) {
      case "Abundant":
        return `abundant ${lbl}`;
      case "Sparse":
        return `no ${lbl}`;
      case "Adequate":
      default:
        return `normal ${lbl}`;
    }
  };

  const { climate, flora, fauna } = character;
  const sameFloraFauna = flora === fauna;
  const floraDescription = abundance("vegetation", flora);
  const climateDescription = `${climate} climate`;
  const floraFauna = sameFloraFauna
    ? `${floraDescription} and animals`
    : `${floraDescription} and ${fauna.toLowerCase()} wildlife`;

  return `${climateDescription} with ${floraFauna}`; */
}
