import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import { useGlobalWorld } from "hooks/GlobalWorld";
import styled from "styled-components";
import Breadcrumbs from "components/Common/Breadcrumbs";
import {
  Card,
  PageContainer,
  PageDescription,
  PageTitle
} from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import {
  listCharacters,
  listRelationships
} from "graphql/requests/characters.graphql";
import { listWorlds } from "graphql/requests/worlds.graphql";
import CreateCharacterModal from "components/Modals/ManageCharacterModal";
import ListView from "components/Common/ListView";
import CharacterItem from "components/CharacterItem";
import { APIData, Character } from "utils/types";
import CreateRelationshipsModal from "components/Modals/CreateRelationshipsModal";
import { GlobalCharacter } from "state";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import PageLayout from "components/Common/PageLayout";

const { Characters: CharacterPaths } = Paths;
const AddCharacterButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

/** ROUTE: List of characters */
const CharactersList = () => {
  const { id: userId, role } = useGlobalUser(["id", "role"]);
  const authenticated = (userId || 0) > -1;
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    characters = [],
    relationships = [],
    focusedCharacter,
    loadCharacters,
    clearGlobalCharacter
  } = useGlobalCharacter(["focusedCharacter", "characters", "relationships"]);
  const loadComponentData = async () => loadCharacters(userId);
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

  useEffect(() => {
    loadComponentData();
    return () => clearComponentData();
  }, []);

  return (
    <PageLayout
      id="world-list"
      title={CharacterPaths.Index.text}
      breadcrumbs={[CharacterPaths.Index]}
      description="Create or manage your <b>Characters</b> and realms here."
    >
      <h3 className="h4">{authenticated ? "Your" : "Public"} Characters</h3>
      <Card>
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
              permissions={role}
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
    </PageLayout>
  );
};

export default CharactersList;
