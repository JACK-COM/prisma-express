import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import CharactersListRoute from "./CharactersList";
// import CharacterRelationships from "./CharacterRelationshipsList";

const { Characters: CharacterPaths } = Paths;
const trim = (str: string) => trimParent(str, "worlds");

const CharactersRoute = () => {
  return (
    <Routes>
      <Route index element={<CharactersListRoute />} />

      {/* <Route
        path={trim(CharacterPaths.Relationships.path)}
        element={<CharacterRelationships />}
      /> */}
    </Routes>
  );
};

export default CharactersRoute;
