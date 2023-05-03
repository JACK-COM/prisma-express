import { APIData, Book, UserRole } from "utils/types";
import { noOp, suppressEvent } from "utils";
import { MatIcon, GridContainer } from "./Common/Containers";
import { TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import { deleteBook } from "graphql/requests/books.graphql";
import {
  GlobalLibrary,
  GlobalUser,
  GlobalModal,
  removeBookFromState,
  updateAsError,
  MODAL
} from "state";
import styled from "styled-components";
import { useNavigate } from "react-router";
import Tooltip from "./Tooltip";
import defaultBookCover from "assets/mystic-books.png";
import { Link } from "react-router-dom";
import ImageLoader from "./Common/ImageLoader";
import { RoundButton } from "./Forms/Button";

type WorldItemProps = {
  book: APIData<Book>;
  onEdit?: (w: APIData<Book>) => void;
  onSelect?: (w: APIData<Book>) => void;
  permissions?: UserRole;
};

const Container = styled(Link)<{ permissions: UserRole }>`
  align-items: center;
  background-size: cover;
  background-position: center;
  border: ${({ theme }) =>
    `${theme.sizes.xs} solid ${theme.colors.semitransparent}`};
  border-radius: ${({ theme }) => theme.sizes.sm};
  color: inherit;
  justify-content: space-between;
  height: 25vh;
  padding: 0;
  transition: all 0.2s ease-in-out;
  width: 200px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }

  @media (max-width: 768px) {
    height: 30vh;
  }
`;
const Title = styled.h6`
  background: linear-gradient(0deg, #00000000, #000717ce);
  border-radius: ${({ theme }) => `${theme.sizes.xs} ${theme.sizes.xs} 0 0}`};
  color: white;
  display: grid;
  text-shadow: 0 0 0.05rem #000717ce;
  font-weight: normal;
  grid-template-columns: 32px auto;
  overflow: visible;
  padding: ${({ theme }) => theme.sizes.xs};
  white-space: normal;
  width: 100%;
`;
const Controls = styled(GridContainer)`
  background: linear-gradient(180deg, #00000000, #000717ce);
  border-radius: ${({ theme }) => `0 0 ${theme.sizes.xs} ${theme.sizes.xs}`};
  color: white;
  grid-column-gap: ${({ theme }) => theme.sizes.xs};
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.sizes.xs} ${theme.sizes.sm}`};
  width: 100%;
`;
const Bwoop = styled(RoundButton).attrs({ size: "lg" })`
  &:hover {
    color: inherit;
    animation: scale-up 1s ease-in-out infinite;
  }
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
      <Title className="title">
        <TallIcon icon={icon} className={iconColor} permissions={permissions} />
        <Tooltip text={bookDescription}>{book.title}</Tooltip>
      </Title>

      <Controls columns="max-content auto">
        {permissions === "Author" && (
          <>
            <GridContainer
              columns="repeat(3, 1fr)"
              className="controls"
              gap="0.2rem"
            >
              <Bwoop variant="transparent" onClick={editBook}>
                <MatIcon className="icon" icon="edit" />
              </Bwoop>
              <Bwoop variant="transparent" onClick={editBookSettings}>
                <MatIcon className="icon" icon="settings" />
              </Bwoop>
            </GridContainer>

            <Bwoop variant="outlined" onClick={removeBook}>
              <MatIcon className="icon" icon="delete" />
            </Bwoop>
          </>
        )}
      </Controls>
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
