import { APIData, Book, UserRole } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  MatIcon,
  ItemDescription,
  ItemName,
  ItemLinkContainer
} from "./Common/Containers";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import { deleteBook } from "graphql/requests/books.graphql";
import { GlobalUser, removeBookFromState, updateAsError } from "state";
import styled from "styled-components";
import { useNavigate } from "react-router";

type WorldItemProps = {
  book: APIData<Book>;
  onEdit?: (w: APIData<Book>) => void;
  onSelect?: (w: APIData<Book>) => void;
  permissions?: UserRole;
};

const Genre = styled.span`
  align-self: center;
  border-radius: ${({ theme }) => theme.sizes.xs};
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  display: inline-block;
  color: inherit;
  font-size: 0.75rem;
  grid-row: 1 / span 2;
  padding: ${({ theme }) => theme.sizes.xs};
  text-transform: uppercase;
`;

/** @component Book Item in a list */
const BookItem = ({
  book,
  onSelect,
  onEdit = noOp,
  permissions = "Reader"
}: WorldItemProps) => {
  const { id: userId } = GlobalUser.getState();
  const previewUrl = insertId(Paths.Library.BookPreview.path, book.id);
  const editUrl = insertId(Paths.Library.BookEditor.path, book.id);
  const url = permissions === "Author" ? editUrl : previewUrl;
  const edit = requireAuthor(() => onEdit(book), permissions);
  const navigate = useNavigate();
  const goToPreview = requireAuthor(
    () => navigate(previewUrl),
    permissions,
    true
  );
  const remove = requireAuthor(async () => {
    const res = await deleteBook(book.id);
    if (typeof res === "string") updateAsError(res);
    else if (res) removeBookFromState(book.id);
  }, permissions);
  const select: React.MouseEventHandler = (e) => {
    if (!onSelect) return;
    suppressEvent(e);
    onSelect(book);
  };
  const owner = book.authorId === userId;
  const icon = owner ? "menu_book" : "lock";
  const iconColor = book.public ? "success--text" : "error--text";

  return (
    <ItemLinkContainer to={url} onClick={select} permissions={permissions}>
      <TallIcon
        icon={icon}
        className={iconColor}
        permissions={permissions}
        onClick={goToPreview}
      />

      <ItemName permissions={permissions} onClick={edit}>
        {book.title}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>
      <ItemDescription dangerouslySetInnerHTML={{ __html: book.description }} />
      <Genre>{book.genre}</Genre>
      {permissions === "Author" && (
        <DeleteItemIcon
          disabled={!owner}
          onItemClick={remove}
          permissions={permissions}
          data={book}
        />
      )}
    </ItemLinkContainer>
  );
};

export default BookItem;
