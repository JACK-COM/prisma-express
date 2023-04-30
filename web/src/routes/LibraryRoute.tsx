import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import BooksListRoute from "./BooksList";
import BookEditorRoute from "./BookEditor";
import BookPreviewRoute from "./BookPreview";

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
        // Book Preview
        path={trimParent(Library.BookPreview.path, "library")}
        element={<BookPreviewRoute />}
      />

      <Route
        // Book deep-link (to chapter/scene)
        path={trimParent(Library.BookDeepLink.path, "library")}
        element={<BookPreviewRoute />}
      />
    </Routes>
  );
};

export default LibraryRoute;
