import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import BooksListRoute from "./BooksList";
import BookEditorRoute from "./BookEditor";

const { Library } = Paths;

/** Concerns for all books and series (purchased or user-created) */
const LibraryRoute = () => {
  return (
    <Routes>
      {/* Books list */}
      <Route index element={<BooksListRoute />} />

      <Route
        // Book Editor
        path={trimParent(Library.BookEditor.path, "library")}
        element={<BookEditorRoute />}
      />

      <Route
        // Series
        path={trimParent(Library.Series.path, "library")}
        element={<BooksListRoute />}
      />
    </Routes>
  );
};

export default LibraryRoute;
