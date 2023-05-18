import { APIData, Chapter, Scene, UserRole } from "utils/types";
import { noOp, suppressEvent } from "utils";
import {
  ItemDescription,
  ItemName,
  ItemGridContainer,
  GridContainer
} from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { Paths, insertId } from "routes";
import { requireAuthor } from "utils";
import { deleteChapter } from "graphql/requests/books.graphql";
import {
  GlobalLibrary,
  GlobalUser,
  MODAL,
  removeBookFromState,
  removeChapterFromState,
  setGlobalModal,
  updateAsError
} from "state";
import styled from "styled-components";
import { useState } from "react";
import ListView from "./Common/ListView";
import { SceneItem } from "./SceneItem";

type ChapterItemProps = {
  active?: boolean;
  activeSceneId?: number;
  chapter: APIData<Chapter>;
  onEditChapter?: (w: APIData<Chapter>) => void;
  onEditScene?: (w: APIData<Scene>) => void;
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
const ItemControls = styled(GridContainer)`
  align-items: center;
  font-size: 1rem;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5rem;

  .material-icons {
    grid-row: unset;
    grid-column: unset;
  }
`;
const ChapterIcon = styled(TallIcon)`
  align-self: stretch;
  padding: 1rem 0;
`;

const ChapterItem = ({
  active = false,
  activeSceneId,
  chapter,
  onSelectChapter: onSelect = noOp,
  onSelectScene = noOp,
  onEditChapter = noOp,
  onEditScene = noOp,
  permissions = "Reader"
}: ChapterItemProps) => {
  const { id: userId } = GlobalUser.getState();
  const [showScenes, setShowScenes] = useState(false);
  const edit = requireAuthor(() => onEditChapter(chapter), permissions);
  const remove = requireAuthor(
    async () => {
      const res = await deleteChapter(chapter.id, chapter.bookId as number);
      if (typeof res === "string") {
        updateAsError(res);
      } else if (res) removeBookFromState(chapter.id);
    },
    permissions,
    false
  );
  const select: React.MouseEventHandler = (e) => {
    suppressEvent(e);
    onSelect(chapter);
  };
  const toggleScenes = (e: React.MouseEvent) => {
    suppressEvent(e);
    setShowScenes(!showScenes);
  };
  const newScene = requireAuthor(
    () => {
      GlobalLibrary.focusedScene(null);
      setGlobalModal(MODAL.MANAGE_SCENE);
    },
    permissions,
    true
  );

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
        <ItemControls columns="repeat(2,1fr)">
          <TallIcon
            icon="movie_filter"
            onClick={newScene}
            permissions={permissions}
          />

          <DeleteItemIcon
            disabled={!owner}
            onItemClick={remove}
            permissions={permissions}
            data={chapter}
          />
        </ItemControls>
      )}

      {/* Scenes List */}
      {showScenes && (
        <ItemDescription className="slide-in-down">
          <b className="accent--text">Scenes</b>

          <ListView
            data={chapter.Scenes || []}
            itemText={(s) => (
              <SceneItem
                active={active && s.id === activeSceneId}
                scene={s}
                onEdit={onEditScene}
                permissions={permissions}
              />
            )}
            onItemClick={onSelectScene}
          />
        </ItemDescription>
      )}
    </ItemContainer>
  );
};

export default ChapterItem;
