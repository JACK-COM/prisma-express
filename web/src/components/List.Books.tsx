import { useEffect } from "react";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import ListView from "components/Common/ListView";
import BookItem from "components/BookItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Book, Series } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { GlobalLibrary, clearGlobalBooksState } from "state";

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

type BooksListProps = {
  focusedBook?: APIData<Book> | null;
  books?: APIData<Book>[];
  series?: APIData<Series>[];
};
/** @component List of worlds */
const BooksList = (props: BooksListProps) => {
  const { focusedBook, books = [], series = [] } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { setGlobalModal, MODAL } = useGlobalModal();
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

  return (
    <Card>
      <CardTitle>{authenticated ? "Your" : "Public"} Books</CardTitle>

      {/* Empty List message */}
      {!books.length && (
        <EmptyText>
          The first <b>words</b> were not yet written.
          <br />
          In fact, in those times, writing had not been invented.
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
  );
};

export default BooksList;
