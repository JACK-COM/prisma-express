import { Link } from "react-router-dom";
import styled from "styled-components";
import { APIData, Book, UserRole } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  sharedGridItemStyles,
  GridContainer,
  GridItemName,
  GridItemControls,
  GridItemControl
} from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import { GlobalLibrary, GlobalUser, GlobalModal, MODAL } from "state";
import { useNavigate } from "react-router";
import Tooltip from "./Tooltip";
import defaultBookCover from "assets/mystic-books.png";

type BookItemProps = {
  book: APIData<Book>;
  onEdit?: (w: APIData<Book>) => void;
  onSelect?: (w: APIData<Book>) => void;
  permissions?: UserRole;
};

const Container = styled(Link)<{ permissions: UserRole }>`
  ${sharedGridItemStyles}
`;

/** @component Book Item in a list */
const BookItem = ({
  book,
  onSelect,
  onEdit = noOp,
  permissions = "Reader"
}: BookItemProps) => {
  const { id: userId } = GlobalUser.getState();
  const previewUrl = insertId(Paths.Library.BookPreview.path, book.id);
  const editUrl = insertId(Paths.Library.BookEditor.path, book.id);
  const navigate = useNavigate();
  const editBook = requireAuthor(() => navigate(editUrl), permissions);
  const editBookSettings = requireAuthor(() => onEdit(book), permissions, true);
  const owner = book.authorId === userId;
  const icon = owner ? "menu_book" : "lock";
  const iconColor = book.public ? "success--text" : "error--text";
  const removeBook = requireAuthor(async () => {
    GlobalLibrary.focusedBook(book);
    GlobalModal.active(MODAL.CONFIRM_DELETE_BOOK);
  }, permissions);
  const select: React.MouseEventHandler = (e) => {
    if (!onSelect) return;
    suppressEvent(e);
    onSelect(book);
  };
  const bookDescription = `(${book.genre}) ${book.description}`;

  return (
    <Container
      className="flex--column"
      to={previewUrl}
      onClick={select}
      permissions={permissions}
      style={{ backgroundImage: `url(${book.image || defaultBookCover})` }}
    >
      <GridItemName className="title">
        <TallIcon icon={icon} className={iconColor} permissions={permissions} />
        <Tooltip text={bookDescription}>{book.title}</Tooltip>
      </GridItemName>

      <GridItemControls columns="max-content auto">
        {permissions === "Author" && (
          <>
            <GridContainer
              columns="repeat(3, 1fr)"
              className="controls"
              gap="0.2rem"
            >
              <GridItemControl variant="transparent" onClick={editBook}>
                <MatIcon className="icon" icon="edit" />
              </GridItemControl>
              <GridItemControl variant="transparent" onClick={editBookSettings}>
                <MatIcon className="icon" icon="settings" />
              </GridItemControl>
            </GridContainer>

            <GridItemControl variant="outlined" onClick={removeBook}>
              <MatIcon className="icon delete" icon="delete" />
            </GridItemControl>
          </>
        )}
      </GridItemControls>
    </Container>
  );
};

export default BookItem;

export const CreateBookItem = ({ onClick }: { onClick?: any }) => (
  <Container
    className="flex--column"
    style={{ placeContent: "center" }}
    onClick={onClick}
    to="#"
    permissions="Reader"
  >
    <MatIcon style={{ fontSize: "4.8rem" }} icon="add_circle" />
    <span className="h6">Create a new Book</span>
  </Container>
);
