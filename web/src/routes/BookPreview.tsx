import { useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  Card,
  CardTitle,
  Description,
  GridContainer
} from "components/Common/Containers";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import { GlobalLibrary, setGlobalChapter } from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import { loadBook } from "hooks/loadUserData";
import { APIData, Chapter } from "utils/types";

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
    if (focusedChapter) {
      const txt = focusedScene
        ? focusedScene.text || "No text in scene"
        : "No scene selected";
      const { order, title: cTitle } = focusedChapter as Chapter;
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
            <CardTitle>{sectionTitle}</CardTitle>
            <section dangerouslySetInnerHTML={{ __html: sectionText }} />
          </Card>
        </section>

        {/* Chapters */}
        <ChaptersList
          title="Chapters"
          emptyText="There are no chapters in this book."
          chapters={chapters}
          onSelectChapter={setGlobalChapter}
        />
      </PreviewGrid>
    </PageLayout>
  );
};

export default BookPreviewRoute;
