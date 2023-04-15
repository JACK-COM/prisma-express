import styled from "styled-components";
import { APIData, Book, PermissionProps, UserRole, World } from "utils/types";
import { noOp, suppressEvent } from "utils";
import { MatIcon, ItemDescription, ItemName } from "./Common/Containers";
import {
  DeleteItemIcon,
  DeleteWorldIcon,
  WorldPublicIcon
} from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { Link } from "react-router-dom";
import { requireAuthor } from "utils";
import { PermissionedIcon } from "./ComponentIcons";
import { deleteBook } from "graphql/requests/books.graphql";
import { removeBookFromState, updateAsError } from "state";

const Container = styled(Link)<PermissionProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  color: inherit;
  cursor: pointer;
  display: grid;
  column-gap: ${({ theme }) => theme.sizes.sm};
  grid-template-columns: min-content ${({ permissions }) =>
      permissions === "Author" ? "3fr 24px" : "4fr"};
  justify-content: left;
  padding: ${({ theme }) => theme.sizes.xs};
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }
`;
const BookIcon = styled(PermissionedIcon)`
  grid-column: 1;
  grid-row: 1/3;
`;

type WorldItemProps = {
  book: APIData<Book>;
  onEdit?: (w: APIData<Book>) => void;
  onSelect?: (w: APIData<Book>) => void;
  permissions?: UserRole;
};

const BookItem = ({
  book,
  onSelect,
  onEdit = noOp,
  permissions = "Reader"
}: WorldItemProps) => {
  const url = insertId(Paths.Library.Book.path, book.id);
  const edit = requireAuthor(() => onEdit(book), permissions);
  const remove = requireAuthor(async () => {
    const res = await deleteBook(book.id);
    if (typeof res === "string") {
      updateAsError(res);
    } else if (res) removeBookFromState(book.id);
  }, permissions);
  const select: React.MouseEventHandler = (e) => {
    if (!onSelect) return;
    suppressEvent(e);
    onSelect(book);
  };

  return (
    <Container to={url} onClick={select} permissions={permissions}>
      <BookIcon icon="menu_book" permissions={permissions} />

      <ItemName permissions={permissions} onClick={edit}>
        {book.title}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>
      <ItemDescription dangerouslySetInnerHTML={{ __html: book.description }} />
      <DeleteItemIcon
        onItemClick={remove}
        permissions={permissions}
        data={book}
      />
    </Container>
  );
};

export default BookItem;
