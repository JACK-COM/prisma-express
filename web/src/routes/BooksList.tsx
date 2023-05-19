import { useEffect } from "react";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Books";
import { useGlobalUser } from "hooks/GlobalUser";
import NotAuthorized from "./NotAuthorized";

const { Library } = Paths;

/** ROUTE: List of worlds */
const BooksListRoute = () => {
  const { id: userId } = useGlobalUser(["id"]);
  const { clearGlobalModal } = useGlobalModal();
  const {
    clearGlobalBooksState,
    focusedBook,
    books = [],
    series = []
  } = useGlobalLibrary(["books", "focusedBook", "series"]);

  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalBooksState();
  };

  useEffect(() => {
    return () => clearComponentData();
  }, []);

  return !userId || userId === -1 ? (
    <NotAuthorized />
  ) : (
    <PageLayout
      title={Library.Index.text}
      breadcrumbs={[Library.Index]}
      id="books-list"
      description="Create or manage your <b>Books</b> and <b>Series</b> here."
    >
      <ChaptersList
        className="fill"
        books={books}
        focusedBook={focusedBook}
        series={series}
      />
    </PageLayout>
  );
};

export default BooksListRoute;
