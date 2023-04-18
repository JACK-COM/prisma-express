import { useEffect } from "react";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Books";

const { Library } = Paths;

/** ROUTE: List of worlds */
const BooksListRoute = () => {
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

  return (
    <PageLayout
      title={Library.Index.text}
      breadcrumbs={[Library.Index]}
      id="books-list"
      description="Create or manage your <b>Books</b> and <b>Series</b> here."
    >
      <ChaptersList books={books} focusedBook={focusedBook} series={series} />
    </PageLayout>
  );
};

export default BooksListRoute;
