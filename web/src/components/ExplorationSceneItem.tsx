import { useState } from "react";
import styled from "styled-components";
import {
  ExplorationSceneLayer,
  GlobalExploration,
  GlobalLibrary,
  GlobalUser,
  MODAL,
  clearGlobalModal,
  convertAPISceneToTemplate,
  setGlobalExploration,
  setGlobalExplorationScene,
  setGlobalLayer,
  setGlobalModal
} from "state";
import {
  ItemDescription,
  ItemName,
  ItemGridContainer,
  GridContainer
} from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { DeleteItemIcon, TallIcon } from "./ComponentIcons";
import { requireAuthor, suppressEvent } from "utils";
import { APIData, ExplorationScene, UserRole } from "utils/types";
import ListView from "./Common/ListView";
import useGlobalExploration from "hooks/GlobalExploration";

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
const ExplorationSceneIcon = styled(TallIcon)`
  align-self: stretch;
  padding: 1rem 0;
`;

type ExplorationSceneItemProps = {
  active?: boolean;
  scene: APIData<ExplorationScene>;
  permissions?: UserRole;
};

const ExplorationSceneItem = ({
  active = false,
  scene,
  permissions = "Reader"
}: ExplorationSceneItemProps) => {
  const { id: userId } = GlobalUser.getState();
  const [showScenes, setShowScenes] = useState(false);
  const { activeLayer } = useGlobalExploration(["activeLayer"]);
  const edit = requireAuthor(() => {
    setGlobalExplorationScene(convertAPISceneToTemplate(scene));
    setGlobalModal(MODAL.MANAGE_EXPLORATION_SCENE);
  }, permissions);
  const remove = () => {
    setGlobalExplorationScene(convertAPISceneToTemplate(scene));
    setGlobalModal(MODAL.CONFIRM_DELETE_EXPLORATION_SCENE);
  };
  const select: React.MouseEventHandler = (e) => {
    suppressEvent(e);
    setGlobalExplorationScene(convertAPISceneToTemplate(scene));
    clearGlobalModal();
  };
  const toggleScenes = (e: React.MouseEvent) => {
    suppressEvent(e);
    setShowScenes(!showScenes);
  };
  const newScene = () => {
    GlobalLibrary.focusedScene(null);
    setGlobalModal(MODAL.MANAGE_SCENE);
  };

  const owner = scene.authorId === userId;
  const icon = showScenes ? "expand_more" : "movie_filter";
  const iconColor = `slide-in-${showScenes ? "down accent--text" : "right"}`;
  const activeClass = active ? "active" : "";

  return (
    <ItemContainer
      className={activeClass}
      onClick={select}
      permissions={permissions}
    >
      <ExplorationSceneIcon
        icon={icon}
        key={icon}
        className={iconColor}
        permissions={permissions}
        onClick={toggleScenes}
      />

      <ItemName permissions={permissions} onClick={edit}>
        {scene.title}
        {permissions === "Author" && <MatIcon className="icon" icon="edit" />}
      </ItemName>

      {!showScenes && (
        <ItemDescription
          dangerouslySetInnerHTML={{ __html: scene.description }}
        />
      )}

      {permissions === "Author" && (
        <ItemControls columns="repeat(2,1fr)">
          <TallIcon
            icon="movie_filter"
            onClick={requireAuthor(newScene, permissions, true)}
            permissions={permissions}
          />

          <DeleteItemIcon
            disabled={!owner}
            onItemClick={requireAuthor(remove, permissions, false)}
            permissions={permissions}
            data={scene}
          />
        </ItemControls>
      )}

      {/* Scenes List */}
      {showScenes && (
        <ItemDescription className="slide-in-down">
          <SceneReadiness activeLayer={activeLayer || "all"} scene={scene} />
        </ItemDescription>
      )}
    </ItemContainer>
  );
};

export default ExplorationSceneItem;

/** Dummy Scene Item */
export const AddExplorationSceneItem = () => {
  const select: React.MouseEventHandler = (e) => {
    suppressEvent(e);
    setGlobalModal(MODAL.CREATE_EXPLORATION_SCENE);
  };

  return (
    <ItemContainer className="flex" permissions="Author" onClick={select}>
      <ExplorationSceneIcon permissions="Author" icon="add" />
      <ItemName style={{ flexGrow: 1 }} permissions="Author">
        Add Scene
      </ItemName>
    </ItemContainer>
  );
};

function SceneReadiness(props: SceneReadinessProps) {
  const { scene, activeLayer } = props;
  const { explorationScene } = GlobalExploration.getState();
  const { background, characters, foreground, description } = scene;
  const bgIcon = JSON.parse(background).url ? "check_circle" : "error";
  const charIcon = JSON.parse(characters).length ? "check_circle" : "error";
  const fgIcon = JSON.parse(foreground).length ? "check_circle" : "error";
  const descIcon = description ? "check_circle" : "error";
  const isActiveLayer = (t: string) =>
    explorationScene?.id === scene.id && activeLayer === t.toLowerCase();
  const changeGlobalLayer = (layer: ExplorationSceneLayer) => {
    setGlobalExplorationScene(convertAPISceneToTemplate(scene));
    setGlobalLayer(layer);
    clearGlobalModal();
  };
  const listItems = [
    {
      icon: bgIcon,
      text: "Background",
      click: () => changeGlobalLayer("background")
    },
    {
      icon: charIcon,
      text: "Characters",
      click: () => changeGlobalLayer("characters")
    },
    {
      icon: fgIcon,
      text: "Foreground",
      click: () => changeGlobalLayer("foreground")
    },
    { icon: descIcon, text: "Description" }
  ];
  const errorClass = (d: { icon: string }) =>
    d.icon === "error" ? "error--text" : "success--text";

  return (
    <ListView
      data={listItems}
      onItemClick={(d) => d.click && d.click()}
      itemText={(d) => (
        <span className="flex">
          <MatIcon icon={d.icon} className={errorClass(d)} />
          <span className={isActiveLayer(d.text) ? "success--text" : undefined}>
            &nbsp;{d.text}
          </span>
        </span>
      )}
    />
  );
}

type SceneReadinessProps = {
  scene: APIData<ExplorationScene>;
  activeLayer: ExplorationSceneLayer;
};
