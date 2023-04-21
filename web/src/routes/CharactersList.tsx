import { useEffect } from "react";
import { useGlobalUser } from "hooks/GlobalUser";
import { useGlobalCharacter } from "hooks/GlobalCharacter";
import { Paths } from "routes";
import PageLayout from "components/Common/PageLayout";
import { loadCharacters } from "hooks/loadUserData";
import CharactersList from "components/List.Characters";

/** @Route All characters */
const CharactersListRoute = () => {
  const { id: userId } = useGlobalUser(["id", "role"]);
  const {
    characters = [],
    relationships = [],
    focusedCharacter,
    clearGlobalCharacter
  } = useGlobalCharacter(["focusedCharacter", "characters", "relationships"]);

  useEffect(() => {
    loadCharacters({ userId });
    return () => clearGlobalCharacter();
  }, []);

  return (
    <PageLayout
      id="world-list"
      title={Paths.Characters.Index.text}
      breadcrumbs={[Paths.Characters.Index]}
      description="Create or manage your <b>Characters</b> and realms here."
    >
      {/* List */}
      <CharactersList
        characters={characters}
        relationships={relationships}
        focusedCharacter={focusedCharacter}
      />
    </PageLayout>
  );
};

export default CharactersListRoute;
