import styled from "styled-components";
import {
  GlobalCharacter,
  addNotification,
  clearGlobalCharacter,
  removeCharacterFromState,
  updateAsError,
  updateNotification
} from "state";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import ManageCharacterModal from "components/Modals/ManageCharacterModal";
import ListView from "components/Common/ListView";
import CharacterItem from "components/CharacterItem";
import CreateRelationshipsModal from "components/Modals/ManageRelationshipsModal";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import {
  deleteCharacter,
  listRelationships
} from "graphql/requests/characters.graphql";
import { APIData, Character, CharacterRelationship } from "utils/types";

const AddCharacterButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

type CharactersListProps = {
  characters?: APIData<Character>[];
  focusedCharacter?: APIData<Character> | null;
  relationships?: APIData<CharacterRelationship>[];
  className?: string;
};

/** @Component  List of characters */
const CharactersList = ({ className }: CharactersListProps) => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    focusedCharacter,
    characters = [],
    relationships = []
  } = useGlobalCharacter(["focusedCharacter", "characters", "relationships"]);
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalCharacter();
  };
  const onCharacterRelationships = async (char: APIData<Character>) => {
    const relationships = await listRelationships({ characterId: char.id });
    GlobalCharacter.multiple({ relationships, focusedCharacter: char });
    setGlobalModal(MODAL.MANAGE_RELATIONSHIPS);
  };
  const onDeleteCharacter = async (id: APIData<Character>["id"]) => {
    const char = characters.find((c) => c.id === id);
    if (!char) return;
    GlobalCharacter.focusedCharacter(char);
    setGlobalModal(MODAL.CONFIRM_DELETE_CHARACTER);
  };
  const onEditCharacter = (char: APIData<Character> | null) => {
    setGlobalModal(MODAL.MANAGE_CHARACTER);
    GlobalCharacter.focusedCharacter(char);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") => (
    <AddCharacterButton
      size="lg"
      icon="face_2"
      text="Add New Character"
      variant={variant}
      onClick={() => onEditCharacter(null)}
    />
  );

  return (
    <>
      <Card className={className}>
        <CardTitle className="h4">Characters</CardTitle>

        {/* Empty List message */}
        {!characters.length && (
          <EmptyText>
            No <b>Characters</b> walked the lands, in those days. The formless
            sea was tense with anticipation.
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {authenticated && characters.length > 5 && controls("transparent")}

        {/* List */}
        <List
          data={characters}
          itemText={(character: APIData<Character>) => (
            <CharacterItem
              character={character}
              permissions={userId === character.authorId ? "Author" : "Reader"}
              onEdit={onEditCharacter}
              onRelationships={onCharacterRelationships}
              onSelect={onCharacterRelationships}
              onRemove={onDeleteCharacter}
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && controls()}
      </Card>

      {/* Modals */}
      <ManageCharacterModal
        open={active === MODAL.MANAGE_CHARACTER}
        onClose={clearComponentData}
      />

      {focusedCharacter && (
        <CreateRelationshipsModal
          data={relationships}
          open={active === MODAL.MANAGE_RELATIONSHIPS}
          onClose={clearComponentData}
        />
      )}
    </>
  );
};

export default CharactersList;
