import { useEffect } from "react";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Books";
import { clearGlobalBooksState } from "state";
import { Form, FormRow, Input } from "components/Forms/Form";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";

const { BookStore } = Paths;

/** ROUTE: Find and add books to library */
const BookStoreRoute = () => {
  const { clearGlobalModal } = useGlobalModal();
  const {
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
      title={BookStore.Index.text}
      breadcrumbs={[BookStore.Index]}
      id="books-list"
      description={`Add <b class="accent--text">Books and Series</b> to your Library.`}
    >
      {/* Search Form */}
      <Card>
        <CardTitle>Search titles</CardTitle>
        <Form>
          <FormRow columns="6fr 2fr; align-items:stretch">
            <Input
              style={{ height: "100%" }}
              placeholder="Search Books and Series"
            />
            <ButtonWithIcon text="Find Titles" icon="search" />
          </FormRow>
        </Form>
      </Card>

      <hr className="transparent" />

      {/* Search Results */}
      <ChaptersList
        className="fill"
        title="Search Results"
        books={books}
        focusedBook={focusedBook}
        series={series}
      />
    </PageLayout>
  );
};

export default BookStoreRoute;
