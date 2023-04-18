import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { listRelationships } from "graphql/requests/characters.graphql";
import CreateCharacterModal from "components/Modals/ManageCharacterModal";
import ListView from "components/Common/ListView";
import CharacterItem from "components/CharacterItem";
import { APIData, Character, CharacterRelationship } from "utils/types";
import CreateRelationshipsModal from "components/Modals/ManageRelationshipsModal";
import { GlobalCharacter } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";

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
};

/** @Component  List of characters */
const CharactersList = (props: CharactersListProps) => {
  const { characters = [], relationships = [], focusedCharacter } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { clearGlobalCharacter } = useGlobalCharacter([]);
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalCharacter();
  };
  const onCharacterRelationships = async (char: APIData<Character>) => {
    const relationships = await listRelationships({ characterId: char.id });
    GlobalCharacter.multiple({ relationships, focusedCharacter: char });
    setGlobalModal(MODAL.MANAGE_RELATIONSHIPS);
  };
  const onEditCharacter = (char: APIData<Character>) => {
    GlobalCharacter.focusedCharacter(char);
    setGlobalModal(MODAL.MANAGE_CHARACTER);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") => (
    <AddCharacterButton
      size="lg"
      icon="face_2"
      text="Create New Character"
      variant={variant}
      onClick={() => setGlobalModal(MODAL.MANAGE_CHARACTER)}
    />
  );

  return (
    <>
      <Card>
        <CardTitle className="h4">
          {authenticated ? "Your" : "Public"} Characters
        </CardTitle>

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
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && controls()}
      </Card>

      {/* Modals */}
      {focusedCharacter && (
        <>
          <CreateCharacterModal
            data={focusedCharacter}
            open={active === MODAL.MANAGE_CHARACTER}
            onClose={clearComponentData}
          />

          <CreateRelationshipsModal
            data={relationships}
            open={active === MODAL.MANAGE_RELATIONSHIPS}
            onClose={clearComponentData}
          />
        </>
      )}
    </>
  );
};

export default CharactersList;
