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
import { GlobalLibrary } from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import { loadBook } from "hooks/loadUserData";

const { Library } = Paths;
const PreviewGrid = styled(GridContainer)`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/** @route Preview a `Book` */
const BookPreviewRoute = () => {
  const { active } = useGlobalModal();
  const { focusedBook } = useGlobalLibrary(["focusedBook"]);
  const { bookId } = useParams<{ bookId: string }>();
  const [pageTitle] = useMemo(
    () => [focusedBook?.title || Library.BookPreview.text],
    [focusedBook, active]
  );
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

  return (
    <PageLayout
      title={pageTitle}
      breadcrumbs={[Library.Index, Library.BookPreview]}
      id="books-list"
      description="Book Preview"
    >
      {focusedBook ? (
        <>
          <PreviewGrid columns="4fr 1.5fr" gap="0.6rem">
            {/* Overview/Summary */}
            <Card>
              <CardTitle>Description</CardTitle>
              <section
                dangerouslySetInnerHTML={{ __html: focusedBook?.description }}
              />
            </Card>

            {/* Chapters */}
            <ChaptersList
              title="Chapters"
              emptyText="There are no chapters in this book."
              chapters={focusedBook?.Chapters}
            />
          </PreviewGrid>
        </>
      ) : (
        <Card>
          <Description>
            Loading Book Preview... If this takes too long, please refresh the
            page.
          </Description>
        </Card>
      )}
    </PageLayout>
  );
};

export default BookPreviewRoute;
