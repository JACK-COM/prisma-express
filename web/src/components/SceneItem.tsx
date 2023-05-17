import { APIData, Scene, UserRole } from "utils/types";
import { noOp } from "utils";
import { ItemName, ItemGridContainer } from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { requireAuthor } from "utils";
import { deleteScene } from "graphql/requests/books.graphql";
import {
  GlobalLibrary,
  GlobalUser,
  updateAsError,
  updateChaptersState
} from "state";
import { loadChapter } from "api/loadUserData";
import styled from "styled-components";

type SceneItemProps = {
  scene: APIData<Scene>;
  active?: boolean;
  permissions?: UserRole;
  onSelectScene?: (w: APIData<Scene>) => void;
  onEdit?: (w: APIData<Scene>) => void;
};

const ItemContainer = styled(ItemGridContainer)`
  &.active {
    background-color: ${({ theme }) => theme.colors.accent}12;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/** @component Single `Chapter Scene` in a list */
export function SceneItem(props: SceneItemProps) {
  const { id: userId } = GlobalUser.getState();
  const {
    active = false,
    scene,
    onEdit = noOp,
    permissions = "Reader"
  } = props;
  const activeClass = `list-item ${active ? "active" : ""}`.trim();
  const owner = scene.authorId === userId;
  const edit = requireAuthor(() => onEdit(scene), permissions, true);
  const onDeleteScene = async () => {
    const sceneId: number = scene.id;
    const resp = await deleteScene(sceneId, scene.chapterId);
    if (typeof resp === "string") updateAsError(resp);
    else if (resp) updateChaptersState([resp]);
  };

  return (
    <ItemContainer className={activeClass} permissions={permissions}>
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
    </ItemContainer>
  );
}
