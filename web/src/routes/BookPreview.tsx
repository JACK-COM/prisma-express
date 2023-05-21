import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardSubitle,
  CardTitle,
  Description,
  GridContainer,
  ItemGridContainer
} from "components/Common/Containers";
import { Paths, insertId } from "routes";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import { GlobalLibrary, setGlobalScene, updateAsError } from "state";
import PageLayout from "components/Common/PageLayout";
import ChaptersList from "components/List.Chapters";
import { useParams } from "react-router";
import { loadBook, loadChapter } from "api/loadUserData";
import { APIData, ContentLink } from "utils/types";
import { TallIcon } from "components/ComponentIcons";
import { noOp } from "utils";
import {
  ButtonWithIcon,
  LinkWithIcon,
  RoundButton
} from "components/Forms/Button";
import { useGlobalUser } from "hooks/GlobalUser";

const { Library } = Paths;
const PreviewGrid = styled(GridContainer)`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const Content = styled.section`
  /* Content links in book content */
  #book-content .content-link {
    display: inline-block;
    padding: 0.1rem 0.2rem;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.presets.round.sm};
  }
`;
const PreviewTitle = styled(CardTitle)`
  align-items: center;
  display: grid;
  grid-template-columns: auto max-content;
`;

/** Route parameters that enable linking to scenes/chapters */
type RouteParams = {
  bookId: string;
  chapterOrder: string;
  sceneOrder: string;
};

/** @route Preview a `Book` */
const BookPreviewRoute = () => {
  const { id: userId } = useGlobalUser(["id"]);
  const {
    focusedBook,
    focusedChapter,
    focusedScene,
    chapters = []
  } = useGlobalLibrary([
    "focusedBook",
    "focusedChapter",
    "focusedScene",
    "chapters"
  ]);
  const { bookId = "" } = useParams<RouteParams>();
  const PreviewPath = {
    ...Library.BookPreview,
    path: insertId(Library.BookPreview.path, bookId)
  };
  const editUrl = insertId(Library.BookEditor.path, bookId);
  const [pageTitle, sectionTitle, sectionText] = useMemo(() => {
    const title = focusedBook?.title || PreviewPath.text;
    if (focusedChapter && focusedScene) {
      const txt = focusedScene
        ? focusedScene.text || "No text in scene"
        : "No scene selected";
      const { order, title: cTitle } = focusedChapter;
      return [title, `${order}. ${cTitle}`, txt];
    }

    return [title, "Overview", focusedBook?.description || "No book selected"];
  }, [focusedBook, focusedChapter, focusedScene]);
  const isAuthor = useMemo(
    () => focusedBook?.authorId === userId,
    [focusedBook]
  );
  const [error, setError] = useState("");
  const clearComponentData = () => {
    GlobalLibrary.focusedBook(null);
  };
  const loadComponentData = async () => {
    if (!bookId || isNaN(Number(bookId))) return;
    const result = await loadBook(Number(bookId));
    if (result.focusedBook === null) setError(`Book not found!`);
  };
  type InternalLink = Pick<
    APIData<ContentLink>,
    "chapterId" | "sceneId" | "bookId"
  >;
  const goToLink = async (
    link: Pick<InternalLink, "chapterId" | "sceneId">
  ) => {
    if (!link.chapterId) return updateAsError("No chapter ID in link");
    const updates = await loadChapter(link.chapterId, true);
    const { focusedChapter } = updates;
    if (link.sceneId) {
      const scene = focusedChapter?.Scenes.find((s) => s.id === link.sceneId);
      if (scene) updates.focusedScene = scene;
    }
    GlobalLibrary.multiple(updates);
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const handleContentLink = async (href: string) => {
    const data = href.split("/link/").pop()?.split("/");
    const [chapter, scene] = (data || []).map(Number);
    const nextChapter = chapters.find((c) => c.order === chapter);
    if (!nextChapter) return updateAsError(`Chapter ${chapter} not found`);
    const scenes = nextChapter.Scenes || [];
    if (!scenes.length) return updateAsError(`No Scenes in chapter ${chapter}`);

    const nextScene = scenes.find((s) => s.order === scene) || scenes[0];
    if (!nextScene) return updateAsError(`Scene ${scene} not found`);

    return goToLink({ chapterId: nextChapter.id, sceneId: nextScene.id });
  };

  // Handle content links: this will attach event listeners to every `<a>` tag in the rendered content
  // with that contains `/link/` in the `href` attribute. When clicked, the link will be parsed and the
  // attach event listener will call `goToLink` with the parsed data.
  useEffect(() => {
    if (!contentRef.current) return noOp;
    const links = contentRef.current.querySelectorAll("a");
    const linkArr = Array.from(links).filter((l) => l.href.includes("/link/"));
    if (!linkArr.length) return noOp;

    const cleanup: (() => void)[] = [];
    linkArr.forEach((link) => {
      const onContentLinkClick = (e: MouseEvent): void => {
        e.preventDefault();
        handleContentLink(link.href);
      };
      link.addEventListener("click", onContentLinkClick);
      link.classList.add("content-link");
      cleanup.push(() => link.removeEventListener("click", onContentLinkClick));
    });

    return () => cleanup.forEach((c) => c());
  }, [contentRef.current, focusedScene]);

  useEffect(() => {
    loadComponentData();
    return () => clearComponentData();
  }, []);

  if (!focusedBook)
    return (
      <PageLayout
        title={pageTitle}
        breadcrumbs={[Library.Index, PreviewPath]}
        id="books-list"
        description="Book Preview"
      >
        <Card>
          <PreviewTitle>
            {error ? "Error loading book" : "Fetching book"}
          </PreviewTitle>
          <Description>
            {error || `If this takes too long, please refresh the page.`}
          </Description>
        </Card>
      </PageLayout>
    );

  return (
    <PageLayout
      title={pageTitle}
      breadcrumbs={[Library.Index, PreviewPath]}
      id="books-list"
      description="Book Preview"
    >
      <PreviewGrid className="fill" columns="4fr 1.5fr" gap="0.6rem">
        {/* Overview/Summary */}
        <Content>
          <Card>
            <PreviewTitle>
              <span>{sectionTitle}</span>
              {isAuthor && (
                <LinkWithIcon
                  icon="edit"
                  variant="transparent"
                  href={editUrl}
                  text="Edit"
                />
              )}
            </PreviewTitle>
            {/* Content */}
            {focusedScene && <CardSubitle>{focusedScene.title}</CardSubitle>}
            <section
              ref={contentRef}
              id="book-content"
              dangerouslySetInnerHTML={{ __html: sectionText }}
            />
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
        </Content>

        {/* Chapters */}
        <ChaptersList
          title="Chapters"
          emptyText="There are no chapters in this book."
          chapters={chapters}
          onSelectChapter={(ch) => goToLink({ chapterId: ch.id })}
          onSelectScene={setGlobalScene}
        />
      </PreviewGrid>
    </PageLayout>
  );
};

export default BookPreviewRoute;
