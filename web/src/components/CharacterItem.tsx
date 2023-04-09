import styled from "styled-components";
import { APIData, UserRole, Character, World, Richness } from "utils/types";
import { noOp } from "utils";
import { lineclamp } from "theme/theme.shared";
import { GridContainer, MatIcon } from "components/Common/Containers";
import { Hint } from "components/Forms/Form";
import { useMemo } from "react";

type WICProps = { permissions: UserRole };
const Container = styled(GridContainer)<WICProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  grid-template-areas:
    "icon name"
    "icon description";
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;
`;
const Icon = styled(MatIcon).attrs({ icon: "face" })<WICProps>`
  align-self: center;
  animation: bounce 400ms linear;
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
`;
const Description = styled(Hint)`
  ${lineclamp(1)};
  grid-area: description;
  width: 100%;
`;
const Name = styled.b.attrs({ role: "button", tabIndex: -1 })<WICProps>`
  grid-area: name;
  cursor: pointer;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  .icon {
    display: inline-block;
    padding: ${({ theme }) => theme.sizes.xs};
    font-size: smaller;
  }
`;

type CharacterItemProps = {
  character: APIData<Character>;
  onEdit?: (w: APIData<Character>) => void;
  onSelect?: (w: APIData<Character>) => void;
  permissions?: UserRole;
};

const CharacterItem = ({
  character,
  onSelect = noOp,
  onEdit = noOp,
  permissions = "Reader"
}: CharacterItemProps) => {
  const iconClass = "icon grey--text";
  const edit: React.MouseEventHandler = (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    onEdit(character);
  };
  const select: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onSelect(character);
  };

  return (
    <Container onClick={select} permissions={permissions}>
      <Icon permissions={permissions} className={iconClass} />

      <Name permissions={permissions} onClick={edit}>
        {character.name}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </Name>
      <Description>{characterDescription(character)}</Description>
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
