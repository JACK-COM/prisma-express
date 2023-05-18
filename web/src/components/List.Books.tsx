import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import ListView from "components/Common/ListView";
import BookItem, { CreateBookItem } from "components/BookItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Book, Series } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { GlobalLibrary } from "state";

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
  title?: string;
  className?: string;
};
/** @component List of books */
const BooksList = (props: BooksListProps) => {
  const { books = [], className, title = "Books and Series" } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { setGlobalModal, MODAL } = useGlobalModal();
  const onEditBook = (book: APIData<Book>) => {
    GlobalLibrary.focusedBook(book);
    setGlobalModal(MODAL.MANAGE_BOOK);
  };
  const controls = () =>
    authenticated ? (
      <CreateBookItem onClick={() => setGlobalModal(MODAL.CREATE_BOOK)} />
    ) : (
      <></>
    );

  return (
    <Card className={className}>
      <CardTitle>{title}</CardTitle>

      {/* Empty List message */}
      {!books.length && (
        <EmptyText>
          The first <b>words</b> were not yet written.
          <br />
          In fact, in those times, writing had not been invented.
        </EmptyText>
      )}

      {/* List */}
      <List
        grid
        data={books}
        // Add new (button - top)
        dummyFirstItem={controls()}
        itemText={(book: APIData<Book>) => (
          <BookItem
            book={book}
            onEdit={onEditBook}
            permissions={book.authorId === userId ? "Author" : "Reader"}
          />
        )}
        // Add new (button - bottom)
        dummyLastItem={books.length > 5 && controls()}
      />
    </Card>
  );
};

export default BooksList;
