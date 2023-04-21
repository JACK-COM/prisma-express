import { useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  Card,
  CardSubitle,
  CardTitle,
  Description,
  GridContainer,
  ItemGridContainer
} from "components/Common/Containers";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import {
  GlobalLibrary,
  setGlobalChapter,
  setGlobalScene,
  updateAsError
} from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import { loadBook, loadChapter } from "hooks/loadUserData";
import { APIData, Chapter, ContentLink } from "utils/types";
import { TallIcon } from "components/ComponentIcons";

const { Library } = Paths;
const PreviewGrid = styled(GridContainer)`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/** @route Preview a `Book` */
const BookPreviewRoute = () => {
  const { focusedBook, focusedChapter, focusedScene, chapters } =
    useGlobalLibrary([
      "focusedBook",
      "focusedChapter",
      "focusedScene",
      "chapters"
    ]);
  const { bookId } = useParams<{ bookId: string }>();
  const [pageTitle, sectionTitle, sectionText] = useMemo(() => {
    const title = focusedBook?.title || Library.BookPreview.text;
    if (focusedChapter && focusedScene) {
      const txt = focusedScene
        ? focusedScene.text || "No text in scene"
        : "No scene selected";
      const { order, title: cTitle } = focusedChapter;
      return [title, `${order}. ${cTitle}`, txt];
    }

    return [title, "Overview", focusedBook?.description || "No book selected"];
  }, [focusedBook, focusedChapter, focusedScene]);
  const clearComponentData = () => {
    GlobalLibrary.focusedBook(null);
  };
  const loadComponentData = async () => {
    if (bookId) await loadBook(Number(bookId));
  };
  const goToLink = async (link: APIData<ContentLink>) => {
    if (!link.chapterId) return updateAsError("No chapter ID in link");
    if (link.bookId !== focusedBook?.id) {
      return updateAsError("Book ID mismatch");
    }

    const updates = await loadChapter(link.chapterId, true);
    const { focusedChapter } = updates;
    if (link.sceneId) {
      const scene = focusedChapter?.Scenes.find((s) => s.id === link.sceneId);
      if (scene) updates.focusedScene = scene;
    }
    GlobalLibrary.multiple(updates);
  };

  useEffect(() => {
    loadComponentData();
    return () => clearComponentData();
  }, []);

  if (!focusedBook)
    return (
      <PageLayout
        title={pageTitle}
        breadcrumbs={[Library.Index, Library.BookPreview]}
        id="books-list"
        description="Book Preview"
      >
        <Card>
          <Description>
            Loading Book Preview... If this takes too long, please refresh the
            page.
          </Description>
        </Card>
      </PageLayout>
    );

  return (
    <PageLayout
      title={pageTitle}
      breadcrumbs={[Library.Index, Library.BookPreview]}
      id="books-list"
      description="Book Preview"
    >
      <PreviewGrid columns="4fr 1.5fr" gap="0.6rem">
        {/* Overview/Summary */}
        <section>
          <Card>
            <CardTitle style={{ display: "grid", gridTemplateColumns: "auto" }}>
              <span>{sectionTitle}</span>
            </CardTitle>
            {focusedScene && <CardSubitle>{focusedScene.title}</CardSubitle>}
            <section dangerouslySetInnerHTML={{ __html: sectionText }} />
          </Card>

          <hr />

          {/* Scene ContentLinks */}
          {focusedScene?.Links &&
            focusedScene?.Links.map((link) => (
              <ItemGridContainer
                className="accent--text"
                onClick={() => goToLink(link)}
                permissions="Reader"
                key={link.id}
              >
                <TallIcon permissions="Reader" icon="link" />
                <b>{link.text}</b>
              </ItemGridContainer>
            ))}
        </section>

        {/* Chapters */}
        <ChaptersList
          title="Chapters"
          emptyText="There are no chapters in this book."
          chapters={chapters}
          onSelectChapter={(ch) => loadChapter(ch.id)}
          onSelectScene={setGlobalScene}
        />
      </PreviewGrid>
    </PageLayout>
  );
};

export default BookPreviewRoute;
