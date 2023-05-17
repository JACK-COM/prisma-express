import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import ListView from "components/Common/ListView";
import ChapterItem from "components/ChapterItem";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Chapter, Scene } from "utils/types";
import { useGlobalUser } from "hooks/GlobalUser";
import { SharedButtonProps } from "components/Forms/Button.Helpers";
import { GlobalLibrary } from "state";
import { noOp } from "utils";

const AddButtons = styled(ButtonWithIcon)`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

type ChaptersListProps = {
  focusedChapter?: APIData<Chapter> | null;
  focusedScene?: APIData<Scene> | null;
  chapters?: APIData<Chapter>[];
  hideTitle?: boolean;
  title?: string;
  emptyText?: string;
  onSelectChapter?: (d: APIData<Chapter>) => any;
  onSelectScene?: (d: APIData<Scene>) => any;
};
/** @component List of chapters */
const ChaptersList = (props: ChaptersListProps) => {
  const {
    emptyText,
    focusedChapter,
    focusedScene,
    chapters = [],
    title = "Select Chapter",
    hideTitle = false,
    onSelectChapter = noOp,
    onSelectScene = noOp
  } = props;
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { focusedBook } = GlobalLibrary.getState();
  const { setGlobalModal, MODAL } = useGlobalModal();
  const onEditChapter = (chapter: APIData<Chapter>) => {
    GlobalLibrary.focusedChapter(chapter);
    setGlobalModal(MODAL.MANAGE_CHAPTER);
  };
  const onEditScene = (scene: APIData<Scene>) => {
    GlobalLibrary.focusedScene(scene);
    setGlobalModal(MODAL.MANAGE_SCENE);
  };
  const onNewChapter = () => {
    GlobalLibrary.focusedChapter(null);
    setGlobalModal(MODAL.MANAGE_CHAPTER);
  };

  const owner = focusedBook?.authorId === userId;
  const controls = (variant: SharedButtonProps["variant"] = "outlined") =>
    owner ? (
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
    <Card style={{ paddingTop: 0 }}>
      {!hideTitle && <CardTitle className="h5">{title}</CardTitle>}

      {/* Empty List message */}
      {!chapters.length && (
        <EmptyText>
          {emptyText || (
            <>
              The Creator paused in final thought. The first <b>words</b> were
              about to be spoken.
            </>
          )}
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
            activeSceneId={focusedScene?.id}
            onEditChapter={onEditChapter}
            onEditScene={onEditScene}
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
