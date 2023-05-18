import {
  ExplorationSceneLayer,
  GlobalExploration,
  clearGlobalModal,
  setGlobalLayer
} from "state";
import ModalDrawer from "./ModalDrawer";
import Button, { TransparentButton } from "components/Forms/Button";
import { Fragment, useState } from "react";
import fetchRaw from "graphql/fetch-raw";
import ListView from "components/Common/ListView";
import ImageLoader from "components/Common/ImageLoader";

/** Modal props */
type SelectSceneLayerProps = {
  open: boolean;
  onClose?: () => void;
};

/** Specialized Modal for creating/editing a `Scene` */
export default function SelectSceneLayerModal(props: SelectSceneLayerProps) {
  const { open, onClose = clearGlobalModal } = props;
  const { activeLayer, explorationScene } = GlobalExploration.getState();
  const btnClass = (layer: ExplorationSceneLayer) =>
    activeLayer === layer ? "accent--text" : "";
  const layers: ExplorationSceneLayer[] = [
    "background",
    "characters",
    "foreground",
    "all"
  ];
  const selectLayer = (layer: ExplorationSceneLayer) => {
    setGlobalLayer(layer === activeLayer ? "all" : layer);
    onClose();
  };

  const title = explorationScene?.title
    ? `<b class="accent--text">${explorationScene?.title}</b> - Layers`
    : "Select a Layer";
  const [files, setFiles] = useState<string[]>([]);
  const listFiles = async () => {
    await fetchRaw<{ files: string[] }>({
      url: "http://localhost:4001/files/books/list",
      onResolve(x, errors) {
        if (!errors) setFiles(x.files);
      }
    });
  };

  return (
    <ModalDrawer open={open} onClose={onClose} openTowards="left" title={title}>
      {layers.map((layer) => (
        <Fragment key={layer}>
          <Button
            className={btnClass(layer)}
            variant="outlined"
            onClick={() => selectLayer(layer)}
          >
            {layer.toUpperCase()}
          </Button>
          <hr className="transparent" />
        </Fragment>
      ))}

      <TransparentButton onClick={listFiles}>Refresh Files</TransparentButton>

      <ListView
        data={files}
        itemText={(d) => <ImageLoader src={d} height={100} />}
        grid
      />
    </ModalDrawer>
  );
}
