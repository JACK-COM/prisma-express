import { useEffect } from "react";
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
import ManageBookModal from "components/Modals/ManageBookModal";
import ListView from "components/Common/ListView";
import BookItem from "components/BookItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Book } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import { GlobalLibrary } from "state";
import PageLayout from "components/Common/PageLayout";

const { Library } = Paths;
const AddWorldButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

/** ROUTE: List of worlds */
const BooksList = () => {
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
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
  const onEditBook = (book: APIData<Book>) => {
    GlobalLibrary.focusedBook(book);
    setGlobalModal(MODAL.MANAGE_BOOK);
  };
  const controls = (variant: SharedButtonProps["variant"] = "outlined") =>
    authenticated ? (
      <AddWorldButton
        icon="book"
        size="lg"
        text="Create New Book"
        variant={variant}
        onClick={() => setGlobalModal(MODAL.MANAGE_BOOK)}
      />
    ) : (
      <></>
    );

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
      <h3 className="h4">{authenticated ? "Your" : "Public"} Books</h3>
      <Card>
        {/* Empty List message */}
        {!books.length && (
          <EmptyText>
            The first <b>words</b> were not yet written, in those times.
            <br />
            As a matter of fact, writing had not even been invented.
          </EmptyText>
        )}

        {/* Add new (button - top) */}
        {authenticated && books.length > 5 && controls("transparent")}

        {/* List */}
        <List
          data={books}
          itemText={(book: APIData<Book>) => (
            <BookItem
              book={book}
              onEdit={onEditBook}
              permissions={book.authorId === userId ? "Author" : "Reader"}
            />
          )}
        />

        {/* Add new (button - bottom) */}
        {authenticated && controls()}
      </Card>

      {/* Modal */}
      {active === MODAL.MANAGE_BOOK && (
        <ManageBookModal
          data={focusedBook}
          open={active === MODAL.MANAGE_BOOK}
          onClose={clearComponentData}
        />
      )}
    </PageLayout>
  );
};

export default BooksList;
