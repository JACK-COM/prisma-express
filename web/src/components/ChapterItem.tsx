import { APIData, Chapter, Scene, UserRole } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  MatIcon,
  ItemDescription,
  ItemName,
  ItemGridContainer,
  GridContainer
} from "./Common/Containers";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import { deleteChapter, deleteScene } from "graphql/requests/books.graphql";
import {
  GlobalLibrary,
  GlobalUser,
  removeBookFromState,
  removeChapterFromState,
  removeSceneFromState,
  updateAsError
} from "state";
import styled from "styled-components";
import { useState } from "react";
import ListView from "./Common/ListView";
import { loadChapter } from "hooks/loadUserData";

type ChapterItemProps = {
  active?: boolean;
  chapter: APIData<Chapter>;
  onEdit?: (w: APIData<Chapter>) => void;
  onSelectChapter?: (w: APIData<Chapter>) => void;
  onSelectScene?: (w: APIData<Scene>) => void;
  permissions?: UserRole;
};

const ItemContainer = styled(ItemGridContainer)`
  &.active {
    border: 1px solid ${({ theme }) => theme.colors.accent};
    border-radius: ${({ theme }) => theme.sizes.sm};
    color: ${({ theme }) => theme.colors.text};
    &:hover {
      box-shadow: 0 0 0.5rem 0.1rem #0009;
    }
  }
`;
const ChapterIcon = styled(TallIcon)`
  padding: 0.6rem 0;
`;

const ChapterItem = ({
  active = false,
  chapter,
  onSelectChapter: onSelect = noOp,
  onSelectScene = noOp,
  onEdit = noOp,
  permissions = "Reader"
}: ChapterItemProps) => {
  const { id: userId } = GlobalUser.getState();
  const [showScenes, setShowScenes] = useState(false);
  const edit = requireAuthor(() => onEdit(chapter), permissions);
  const remove = requireAuthor(async () => {
    const res = await deleteChapter(chapter.id);
    if (typeof res === "string") {
      updateAsError(res);
    } else if (res) removeBookFromState(chapter.id);
  }, permissions);
  const select: React.MouseEventHandler = (e) => {
    suppressEvent(e);
    onSelect(chapter);
  };
  const toggleScenes = (e: React.MouseEvent) => {
    suppressEvent(e);
    setShowScenes(!showScenes);
  };
  const owner = chapter.authorId === userId;
  const icon = showScenes ? "expand_more" : "segment";
  const iconColor = `slide-in-${showScenes ? "down accent--text" : "right"}`;
  const activeClass = active ? "active" : "";

  return (
    <ItemContainer
      className={activeClass}
      onClick={select}
      permissions={permissions}
    >
      <ChapterIcon
        icon={icon}
        key={icon}
        className={iconColor}
        permissions={permissions}
        onClick={toggleScenes}
      />

      <ItemName permissions={permissions} onClick={edit}>
        {chapter.title}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>

      {!showScenes && (
        <ItemDescription
          dangerouslySetInnerHTML={{ __html: chapter.description }}
        />
      )}

      {permissions === "Author" && (
        <DeleteItemIcon
          disabled={!owner}
          onItemClick={remove}
          permissions={permissions}
          data={chapter}
        />
      )}

      {/* Scenes List */}
      {showScenes && (
        <ItemDescription className="slide-in-down">
          <b className="accent--text">Scenes</b>

          <ListView
            data={chapter.Scenes || []}
            itemText={(s) => <SceneItem scene={s} permissions={permissions} />}
            onItemClick={onSelectScene}
          />
        </ItemDescription>
      )}
    </ItemContainer>
  );
};

export default ChapterItem;

type SceneItemProps = Omit<
  ChapterItemProps,
  "chapter" | "onEdit" | "onSelectChapter"
> & {
  scene: APIData<Scene>;
  onEdit?: (w: APIData<Scene>) => void;
};
export function SceneItem(props: SceneItemProps) {
  const { id: userId } = GlobalUser.getState();
  const { scene, onEdit = noOp, permissions = "Reader" } = props;
  const owner = scene.authorId === userId;
  const edit = requireAuthor(() => onEdit(scene), permissions, true);
  const onDeleteScene = async () => {
    const sceneId: number = scene.id;
    const resp = await deleteScene(sceneId);
    if (typeof resp === "string") updateAsError(resp);
    else if (resp) {
      const chapterUpdates = await loadChapter(scene.chapterId, true);
      removeSceneFromState(sceneId);
      GlobalLibrary.multiple({ ...chapterUpdates, focusedScene: resp });
    }
  };

  return (
    <ItemGridContainer className="list-item" permissions={permissions}>
      <TallIcon icon="movie_filter" permissions={permissions} />

      <ItemName permissions={permissions} onClick={edit}>
        {scene.title}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>

      {permissions === "Author" && (
        <DeleteItemIcon
          disabled={!owner}
          onItemClick={onDeleteScene}
          permissions={permissions}
          data={scene.id}
        />
      )}
    </ItemGridContainer>
  );
}
