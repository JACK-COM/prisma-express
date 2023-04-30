import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardTitle,
  GridContainer,
  MatIcon
} from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths, insertId } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Chapter, Scene, UserRole } from "utils/types";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import {
  GlobalLibrary,
  MODAL,
  addNotification,
  clearGlobalBooksState,
  setGlobalModal,
  setGlobalScene,
  updateAsError,
  updateNotification
} from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import {
  downloadBookURL,
  getWritingPrompt,
  loadBook,
  loadChapter
} from "hooks/loadUserData";
import ModalDrawer from "components/Modals/ModalDrawer";
import TinyMCE from "components/Forms/TinyMCE";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { upsertScene } from "graphql/requests/books.graphql";
import { ChaptersIcon } from "components/ComponentIcons";
import { useGlobalUser } from "hooks/GlobalUser";

const { Library } = Paths;
const Ellipsis = styled.span`
  ${({ theme }) => theme.mixins.ellipsis};
  font-style: italic;
  opacity: 0.6;
`;
const Clickable = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-weight: bold;
`;
const EditorToolbar = styled(GridContainer)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.semitransparent};
  border-top: 1px solid ${({ theme }) => theme.colors.semitransparent};
  gap: ${({ theme }) => theme.sizes.xs};
  > button {
    padding: ${({ theme }) => theme.sizes.sm} 0;
    width: 32px;
  }
  > .spacer {
    display: inline-block;
    width: 1px;
    height: 32px;
    background-color: ${({ theme }) => theme.colors.semitransparent};
    right: 0;
  }
  .material-icons {
    font-size: ${({ theme }) => theme.sizes.md};
  }
`;
const SpanGrid = styled.span`
  align-items: center;
  display: grid;
  grid-column-gap: ${({ theme }) => theme.sizes.xs};
  grid-template-columns: 32px max-content 32px;
`;

const getAndShowPrompt = async () => {
  const notificationId = addNotification("Generating writing prompt...", true);
  const prompt = await getWritingPrompt();
  updateNotification(prompt, notificationId, true);
};

// Instance of Editor Toolbar
const TOOLBAR_BUTTONS = (dlUrl: string) => [
  { icon: "segment", onClick: () => setGlobalModal(MODAL.SELECT_CHAPTER) },
  { icon: "download", onClick: () => window.open(dlUrl, "_self") },
  { icon: "tips_and_updates", onClick: getAndShowPrompt },
  { icon: "add_link", onClick: () => setGlobalModal(MODAL.LINK_SCENE) }
];

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
  const { id: userId, authenticated } = useGlobalUser(["id", "authenticated"]);
  const { bookId } = useParams<{ bookId: string }>();
  const [draft, updateDraft] = useState(focusedScene?.text || "");
  const [previewUrl, downloadUrl] = useMemo(() => {
    if (!bookId) return ["#", "#"];
    return [
      insertId(Paths.Library.BookPreview.path, bookId),
      downloadBookURL(Number(bookId))
    ];
  }, [bookId]);
  const [pageTitle, chapterTitle, sceneName, role] = useMemo(() => {
    const { title: chTitle, order: chOrder } = focusedChapter || {};
    return [
      focusedBook?.title || Library.BookEditor.text,
      focusedChapter ? `${chOrder}. ${chTitle}` : "No chapter selected",
      focusedScene?.title || "",
      (focusedBook?.authorId === userId ? "Author" : "Reader") as UserRole
    ];
  }, [focusedBook, focusedChapter, focusedScene, active]);
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
    const { focusedScene } = await loadChapter(ch.id);
    updateDraft(focusedScene?.text || "");
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
  const editorToolbarBtns = TOOLBAR_BUTTONS(downloadUrl);

  useEffect(() => {
    updateDraft(focusedScene?.text || "");
    loadComponentData();
    return () => clearComponentData();
  }, []);

  return (
    <PageLayout
      title={
        <SpanGrid>
          <MatIcon className="success--text" icon="edit_document" />
          <span>{pageTitle}</span>
        </SpanGrid>
      }
      breadcrumbs={[Library.Index, Library.BookEditor]}
      id="books-list"
      description={
        focusedChapter
          ? `<b class="accent--text">${chapterTitle}</b> ${
              sceneName ? `<em class="accent--text">- ${sceneName}</em>` : ""
            } - <a href="${previewUrl}"><b>Preview</b></a>`
          : `Manage your <b>book contents</b> here.`
      }
    >
      <EditorToolbar
        columns={`repeat(${editorToolbarBtns.length * 2 + 2}, max-content)`}
      >
        {editorToolbarBtns.map(({ icon, onClick }, i) => (
          <Fragment key={i}>
            <ButtonWithIcon
              disabled={!authenticated || role !== "Author"}
              type="button"
              icon={icon}
              text=""
              variant="transparent"
              onClick={onClick}
            />
            {i < editorToolbarBtns.length - 1 && <hr className="spacer" />}
          </Fragment>
        ))}
        <hr className="spacer" />
        <Ellipsis>More toolbar buttons here</Ellipsis>
      </EditorToolbar>

      {focusedScene ? (
        <TinyMCE
          height={height * 0.78}
          value={draft}
          inline
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
