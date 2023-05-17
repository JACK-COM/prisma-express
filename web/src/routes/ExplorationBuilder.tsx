import { FocusEventHandler, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Accent, Card, CardTitle } from "components/Common/Containers";
import { MatIcon } from "components/Common/MatIcon";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { APIData, Chapter, Scene, UserRole } from "utils/types";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import {
  GlobalExploration,
  GlobalLibrary,
  MODAL,
  addNotification,
  clearGlobalBooksState,
  clearGlobalModal,
  setGlobalChapter,
  setGlobalExploration,
  setGlobalModal,
  setGlobalScene,
  updateAsError,
  updateNotification
} from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import {
  loadBook,
  loadChapter,
  loadExploration,
  saveAndUpdateExploration
} from "api/loadUserData";
import ModalDrawer from "components/Modals/ModalDrawer";
import TinyMCE from "components/Forms/TinyMCE";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { upsertBook, upsertScene } from "graphql/requests/books.graphql";
import { useGlobalUser } from "hooks/GlobalUser";
import EditorToolbar from "components/EditorToolbar";
import useGlobalExploration from "hooks/GlobalExploration";
import {
  UpsertExplorationInput,
  upsertExplorationScene
} from "graphql/requests/explorations.graphql";
import { RoundButton } from "components/Forms/Button";
import ExplorationScenesList from "components/List.ExplorationScenes";
import BuilderToolbar from "components/BuilderToolbar";
import SceneBuilderHelp from "components/SceneBuilderHelp";
import BuilderCanvas from "components/BuilderCanvas";

const { Library } = Paths;
const SpanGrid = styled.span`
  align-items: center;
  display: grid;
  grid-column-gap: ${({ theme }) => theme.sizes.xs};
  grid-template-columns: 32px max-content 32px;
`;

/** ROUTE: List of worlds */
const ExplorationBuilderRoute = () => {
  const { active } = useGlobalModal();
  const { id: userId } = useGlobalUser(["id", "authenticated"]);
  const { exploration, explorationScene } = useGlobalExploration([
    "exploration",
    "explorationScene"
  ]);
  const { explorationId: urlId } = useParams<{ explorationId: string }>();
  const explorationId = urlId ? Number(urlId) : undefined;
  const [draft, updateDraft] = useState("");
  const [pageTitle, role, pageDescription] = useMemo(() => {
    const { title: scTitle, order: scOrder } = explorationScene || {};
    const desc = !explorationScene
      ? exploration?.description ||
        "Manage your <b>Exploration contents</b> here."
      : `${scOrder}. <b class="accent--text">${scTitle}</b>`.trim();
    return [
      exploration?.title || Paths.Explorations.Build.text,
      (exploration?.authorId === userId ? "Author" : "Reader") as UserRole,
      desc
    ];
  }, [exploration, explorationScene]);
  const loadComponentData = async () => {
    if (explorationId) {
      const res = await loadExploration({ explorationId });
      const { explorationScene: nsc } = res;
      if (!nsc) setGlobalModal(MODAL.SELECT_EXPLORATION_SCENE);
    } else setGlobalModal(MODAL.SELECT_EXPLORATION_SCENE);
  };
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalBooksState();
  };
  const focusScene = async (scene: APIData<Scene>) => {
    setGlobalScene(scene);
    updateDraft(scene.text);
    clearGlobalModal();
  };
  const updateText = (content: string) => {
    if (!explorationScene) return;
    updateDraft(content);
  };
  const saveExplorationScene = async () => {
    console.log("Saving scene ...");
    /* if (!draft || !focusedScene) return;
    const notificationId = addNotification("Saving Chapter ...", true);
    const resp = await upsertExplorationScene({ ...focusedScene, text: draft });
    if (typeof resp === "string") updateAsError(resp, notificationId);
    else if (resp && focusedChapter) {
      setGlobalChapter(resp);
      updateNotification("Chapter saved!", notificationId, false);
    } */
  };
  const onEditTitle: FocusEventHandler<HTMLSpanElement> = async (e) => {
    if (!exploration) return;
    const newTitle = e.target.innerText;
    if (newTitle === exploration.title) return;
    const update = { ...exploration, title: newTitle };
    await saveAndUpdateExploration(update);
  };

  const [editorAutosave, setEditorAutosave] = useState(true);
  const toggleAutoSave = () => setEditorAutosave(!editorAutosave);
  const modalOpen = useMemo(() => {
    const localModals = [
      MODAL.SELECT_EXPLORATION_SCENE,
      MODAL.MANAGE_EXPLORATION_SCENE_LAYERS
    ];
    return localModals.includes(active);
  }, [active]);

  useEffect(() => {
    loadComponentData();
    return clearComponentData;
  }, []);

  // useEffect(() => {
  // updateDraft(exploration?.text || "");
  // }, [focusedScene, focusedChapter]);

  return (
    <PageLayout
      title={
        <SpanGrid>
          <RoundButton
            variant="transparent"
            size="md"
            onClick={() => setGlobalModal(MODAL.MANAGE_EXPLORATION)}
          >
            <MatIcon className="success--text" icon="settings" />
          </RoundButton>

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
      <section className="fill">
        <BuilderToolbar
          explorationId={explorationId}
          role={role}
          handleSave={saveExplorationScene}
          saveOnBlur={editorAutosave}
          toggleAutoSave={toggleAutoSave}
        />

        <BuilderCanvas />
      </section>

      <ModalDrawer
        title={`Build Exploration`}
        openTowards="right"
        open={active === MODAL.SELECT_EXPLORATION_SCENE}
        onClose={clearGlobalModal}
      >
        <ExplorationScenesList
          exploration={exploration}
          explorationScene={explorationScene}
        />
      </ModalDrawer>
    </PageLayout>
  );
};

export default ExplorationBuilderRoute;
