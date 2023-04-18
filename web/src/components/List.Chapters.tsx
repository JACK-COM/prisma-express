import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import ListView from "components/Common/ListView";
import ChapterItem from "components/ChapterItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Chapter, Scene } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { GlobalLibrary } from "state";
import { noOp } from "utils";

const { Library } = Paths;
const AddButtons = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

type BooksListProps = {
  focusedChapter?: APIData<Chapter> | null;
  chapters?: APIData<Chapter>[];
  showTitle?: boolean;
  onSelectChapter?: (d: APIData<Chapter>) => any;
  onSelectScene?: (d: APIData<Scene>) => any;
};
/** @component List of worlds */
const ChaptersList = (props: BooksListProps) => {
  const {
    focusedChapter,
    chapters = [],
    showTitle = false,
    onSelectChapter = noOp,
    onSelectScene = noOp
  } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { setGlobalModal, MODAL } = useGlobalModal();
  const onEditChapter = (chapter: APIData<Chapter>) => {
    GlobalLibrary.focusedChapter(chapter);
    setGlobalModal(MODAL.MANAGE_CHAPTER);
  };
  const onNewChapter = () => {
    GlobalLibrary.focusedChapter(null);
    setGlobalModal(MODAL.MANAGE_CHAPTER);
  };

  const controls = (variant: SharedButtonProps["variant"] = "outlined") =>
    authenticated ? (
      <AddButtons
        icon="segment"
        size="lg"
        text="Create New Chapter"
        variant={variant}
        onClick={onNewChapter}
      />
    ) : (
      <></>
    );

  return (
    <Card>
      {showTitle && <CardTitle>Select Chapter</CardTitle>}

      {/* Empty List message */}
      {!chapters.length && (
        <EmptyText>
          The Creator paused in final thought. The first <b>words</b> were about
          to be spoken.
        </EmptyText>
      )}

      {/* Add new (button - top) */}
      {authenticated && chapters.length > 5 && controls("transparent")}

      {/* List */}
      <List
        data={chapters}
        itemText={(chapter: APIData<Chapter>) => (
          <ChapterItem
            chapter={chapter}
            active={focusedChapter?.id === chapter.id}
            onEdit={onEditChapter}
            onSelectChapter={onSelectChapter}
            onSelectScene={onSelectScene}
            permissions={chapter.authorId === userId ? "Author" : "Reader"}
          />
        )}
      />

      {/* Add new (button - bottom) */}
      {authenticated && controls()}
    </Card>
  );
};

export default ChaptersList;
