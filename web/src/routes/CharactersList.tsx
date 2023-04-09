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
import { Paths, insertId } from "routes";
import { listCharacters } from "graphql/requests/characters.graphql";
import { listWorlds } from "graphql/requests/worlds.graphql";
import CreateCharacterModal from "components/Modals/ManageCharacterModal";
import ListView from "components/Common/ListView";
import CharacterItem from "components/CharacterItem";
import { APIData, Character } from "utils/types";

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
  const { id, role } = useGlobalUser(["id", "role"]);
  const authenticated = (id || 0) > -1;
  const navigate = useNavigate();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const { setGlobalWorlds } = useGlobalWorld();
  const {
    characters = [],
    selectedCharacter,
    setGlobalCharacter,
    setGlobalCharacters
  } = useGlobalCharacter(["selectedCharacter", "characters"]);
  const loadCharacters = async () => {
    const [chars, worlds] = await Promise.all([
      listCharacters({ authorId: id }),
      listWorlds()
    ]);
    setGlobalWorlds(worlds);
    setGlobalCharacters(chars);
  };
  const clearComponentData = () => {
    setGlobalCharacter(null);
    clearGlobalModal();
  };
  const onEditCharacter = (world: APIData<Character>) => {
    setGlobalCharacter(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };

  useEffect(() => {
    loadCharacters();
    return () => clearComponentData();
  }, []);

  return (
    <PageContainer id="world-list">
      <header>
        <Breadcrumbs data={[CharacterPaths.Index]} />
        <PageTitle>{CharacterPaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Characters</b> and realms here.
        </PageDescription>
      </header>

      <Card>
        <h3 className="h4">{authenticated ? "Your" : "Public"} Characters</h3>
        {/* Empty List message */}
        {!characters.length && (
          <EmptyText>
            No <b>Characters</b> walked the lands, in those days. The formless
            sea was tense with anticipation.
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {characters.length > 5 && (
          <AddCharacterButton
            size="lg"
            icon="public"
            text="Create New Character"
            variant="outlined"
            onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
          />
        )}

        {/* List */}
        <List
          data={characters}
          itemText={(character: APIData<Character>) => (
            <CharacterItem
              character={character}
              onEdit={onEditCharacter}
              onSelect={onEditCharacter}
              permissions={role}
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && (
          <AddCharacterButton
            size="lg"
            icon="public"
            text="Create New Character"
            variant={characters.length > 5 ? "transparent" : "outlined"}
            onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
          />
        )}
      </Card>

      {/* Modal */}
      <CreateCharacterModal
        data={selectedCharacter}
        open={active === MODAL.MANAGE_WORLD}
        onClose={clearComponentData}
      />
    </PageContainer>
  );
};

export default CharactersList;
