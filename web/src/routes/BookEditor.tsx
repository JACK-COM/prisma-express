import { FocusEventHandler, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Card } from "components/Common/Containers";
import { MatIcon } from "components/Common/MatIcon";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Chapter, Scene, UserRole } from "utils/types";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import {
  GlobalLibrary,
  MODAL,
  addNotification,
  clearGlobalBooksState,
  setGlobalChapter,
  setGlobalModal,
  setGlobalScene,
  updateAsError,
  updateNotification
} from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import { loadBook, loadChapter } from "api/loadUserData";
import ModalDrawer from "components/Modals/ModalDrawer";
import TinyMCE from "components/Forms/TinyMCE";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { upsertBook, upsertScene } from "graphql/requests/books.graphql";
import { useGlobalUser } from "hooks/GlobalUser";
import EditorToolbar from "components/EditorToolbar";

const { Library } = Paths;
const Clickable = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-weight: bold;
`;
const SpanGrid = styled.span`
  align-items: center;
  display: grid;
  grid-column-gap: ${({ theme }) => theme.sizes.xs};
  grid-template-columns: 32px max-content 32px;
`;

/** ROUTE: List of worlds */
const BooksEditorRoute = () => {
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
  const { height } = useGlobalWindow();
  const { active, clearGlobalModal } = useGlobalModal();
  const { id: userId } = useGlobalUser(["id", "authenticated"]);
  const { bookId } = useParams<{ bookId: string }>();
  const [draft, updateDraft] = useState(focusedScene?.text || "");
  const [pageTitle, chapterTitle, sceneName, role] = useMemo(() => {
    const { title: chTitle, order: chOrder } = focusedChapter || {};
    return [
      focusedBook?.title || Library.BookEditor.text,
      focusedChapter ? `${chOrder}. ${chTitle}` : "No chapter selected",
      focusedScene?.title || "",
      (focusedBook?.authorId === userId ? "Author" : "Reader") as UserRole
    ];
  }, [focusedBook, focusedChapter, focusedScene, active]);
  const pageDescription = useMemo(() => {
    if (!focusedChapter) return "Manage your <b>book contents</b> here.";
    const sceneTitle = sceneName
      ? `<em class="accent--text">- ${sceneName}</em>`
      : "";
    return `<b class="accent--text">${chapterTitle}</b> ${sceneTitle}`.trim();
  }, [focusedChapter, chapterTitle, sceneName]);
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
  const focusChapter = async (ch: APIData<Chapter>) => {
    const updates = await loadChapter(ch.id, true);
    const { focusedScene: nsc, focusedChapter: nch } = updates;
    if (!nch) return;
    updateDraft(nsc?.text || "");
    setGlobalChapter(nch);
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
      setGlobalChapter(resp);
      updateNotification("Chapter saved!", notificationId, false);
    }
  };
  const onEditTitle: FocusEventHandler<HTMLSpanElement> = async (e) => {
    const newTitle = e.target.innerText;
    if (!focusedBook || newTitle === focusedBook?.title) return;
    const notificationId = addNotification("Updating book title ...", true);
    const resp = await upsertBook({ ...focusedBook, title: newTitle });
    if (typeof resp === "string") updateAsError(resp, notificationId);
    else if (resp) {
      const { books } = GlobalLibrary.getState();
      const newBooks = books.map((b) => (b.id === resp.id ? resp : b));
      GlobalLibrary.multiple({ focusedBook: resp, books: newBooks });
      updateNotification("Book title updated!", notificationId);
    }
  };

  const [editorAutosave, setEditorAutosave] = useState(true);
  const toggleAutoSave = () => setEditorAutosave(!editorAutosave);

  useEffect(() => {
    loadComponentData();
    return () => clearComponentData();
  }, []);

  useEffect(() => {
    updateDraft(focusedScene?.text || "");
  }, [focusedScene, focusedChapter]);

  return (
    <PageLayout
      title={
        <SpanGrid>
          <MatIcon className="success--text" icon="edit_document" />
          <span
            // Editable title
            onBlur={onEditTitle}
            contentEditable
            suppressContentEditableWarning
          >
            {pageTitle}
          </span>
        </SpanGrid>
      }
      breadcrumbs={[Library.Index, Library.BookEditor]}
      id="books-list"
      description={pageDescription}
    >
      <EditorToolbar
        bookId={Number(bookId)}
        role={role}
        handleSave={saveScene}
        saveOnBlur={editorAutosave}
        toggleAutoSave={toggleAutoSave}
      />

      {focusedScene ? (
        <TinyMCE
          height={height * 0.78}
          value={draft}
          inline
          autosave={editorAutosave}
          onChange={updateText}
          triggerSave={saveScene}
        />
      ) : (
        <Card className="fill">
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
