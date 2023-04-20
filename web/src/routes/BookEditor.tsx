import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Chapter, Scene } from "utils/types";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import {
  GlobalLibrary,
  addNotification,
  clearGlobalBooksState,
  setGlobalChapter,
  setGlobalScene,
  updateAsError
} from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import { loadBook, loadChapter } from "hooks/loadUserData";
import ModalDrawer from "components/Modals/ModalDrawer";
import TinyMCE from "components/Forms/TinyMCE";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { upsertScene } from "graphql/requests/books.graphql";

const { Library } = Paths;
const Ellipsis = styled.span`
  ${({ theme }) => theme.mixins.ellipsis};
`;
const Clickable = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-weight: bold;
`;
const EditorTitle = styled(CardTitle)`
  display: grid;
  grid-template-columns: max-content auto;
  gap: ${({ theme }) => theme.sizes.sm};
`;

/** ROUTE: List of worlds */
const BooksEditorRoute = () => {
  const { height } = useGlobalWindow();
  const { active, clearGlobalModal, setGlobalModal, MODAL } = useGlobalModal();
  const {
    chapters = [],
    focusedBook,
    focusedChapter,
    focusedScene
  } = useGlobalLibrary([
    "chapters",
    "focusedChapter",
    "focusedScene",
    "focusedBook"
  ]);
  const { bookId } = useParams<{ bookId: string }>();
  const previewUrl = useMemo(
    () => (bookId ? insertId(Paths.Library.BookPreview.path, bookId) : "#"),
    [bookId]
  );
  const [draft, updateDraft] = useState(focusedScene?.text || "");
  const [pageTitle, chapterTitle, sceneName] = useMemo(
    () => [
      focusedBook?.title || Library.BookEditor.text,
      focusedChapter
        ? `${focusedChapter.order}. ${focusedChapter.title}`
        : "No chapter selected",
      focusedScene?.title || ""
    ],
    [focusedBook, focusedChapter, focusedScene, active]
  );
  const pageSubtitle = useMemo(
    () => `${chapterTitle}${sceneName ? ` - ${sceneName}` : ""}`,
    [chapterTitle, sceneName]
  );
  const loadComponentData = async () => {
    if (bookId) {
      const { focusedScene: scene } = await loadBook(Number(bookId));
      if (scene) updateDraft(scene.text);
    } else if (!focusedChapter) setGlobalModal(MODAL.SELECT_CHAPTER);
  };
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalBooksState();
  };
  const focusChapter = async (chapter: APIData<Chapter>) => {
    if (!chapter.Scenes?.length) {
      const { focusedScene: scene } = await loadChapter(chapter.id);
      if (scene) updateDraft(scene.text);
    } else {
      const scenes = chapter.Scenes;
      setGlobalChapter(chapter);
      updateDraft(scenes[0].text);
    }
    clearGlobalModal();
  };
  const focusScene = async (scene: APIData<Scene>) => {
    setGlobalScene(scene);
    updateDraft(scene.text);
    clearGlobalModal();
  };
  const updateText = (content: string) => {
    if (!focusedScene) return;
    updateDraft(content);
  };
  const saveScene = async () => {
    if (!draft || !focusedScene) return;
    const notificationId = addNotification("Saving Chapter ...", true);
    const resp = await upsertScene({ ...focusedScene, text: draft });
    if (typeof resp === "string") updateAsError(resp, notificationId);
    else if (resp && focusedChapter) {
      const newScene = resp.Scenes.find(({ id }) => id === focusedScene.id);
      GlobalLibrary.multiple({ focusedChapter: resp, focusedScene: newScene });
    }
  };

  useEffect(() => {
    updateDraft(focusedScene?.text || "");
    loadComponentData();
    return () => clearComponentData();
  }, []);

  return (
    <PageLayout
      title={pageTitle}
      breadcrumbs={[Library.Index, Library.BookEditor]}
      id="books-list"
      description={
        focusedChapter
          ? `Editing: <b class="secondary--text">${chapterTitle}</b> - <a href="${previewUrl}"><b>Preview</b></a>`
          : `Create or edit your <b>work</b> here.`
      }
    >
      <EditorTitle>
        <ButtonWithIcon
          type="button"
          icon="segment"
          text=""
          variant="transparent"
          onClick={() => setGlobalModal(MODAL.SELECT_CHAPTER)}
        />
        <Ellipsis>{pageSubtitle}</Ellipsis>
      </EditorTitle>

      {focusedScene ? (
        <TinyMCE
          height={height * 0.78}
          value={draft}
          onChange={updateText}
          triggerSave={saveScene}
        />
      ) : (
        <Card>
          <Clickable onClick={() => setGlobalModal(MODAL.SELECT_CHAPTER)}>
            {chapters.length ? "Select" : "Create"}
          </Clickable>
          &nbsp; a <b>chapter</b> to start writing!
        </Card>
      )}

      <ModalDrawer
        title={`${pageTitle} - Chapters`}
        openTowards="right"
        open={active === MODAL.SELECT_CHAPTER}
        onClose={clearGlobalModal}
      >
        <ChaptersList
          chapters={chapters}
          focusedChapter={focusedChapter}
          focusedScene={focusedScene}
          onSelectChapter={focusChapter}
          onSelectScene={focusScene}
        />
      </ModalDrawer>
    </PageLayout>
  );
};

export default BooksEditorRoute;
