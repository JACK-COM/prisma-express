import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import BooksList from "./BooksList";

const { Library } = Paths;

/** Concerns for all books and series (purchased or user-created) */
const LibraryRoute = () => {
  return (
    <Routes>
      <Route index element={<BooksList />} />

      <Route
        // Books list
        path={trimParent(Library.Book.path, "library")}
        element={<BooksList />}
      />

      <Route
        // Series
        path={trimParent(Library.Series.path, "library")}
        element={<BooksList />}
      />
    </Routes>
  );
};

export default LibraryRoute;
