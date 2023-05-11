import { useGlobalModal } from "hooks/GlobalModal";
import { MODAL as M } from "state";
import ManageBookModal from "./ManageBookModal";
import ManageChapterModal from "./ManageChapterModal";
import ManageSceneModal from "./ManageSceneModal";
import ManageContentLinksModal from "./ManageLinksModal";
import ManageWorldModal from "components/Modals/ManageWorldModal";
import ConfirmDeleteBookModal from "./ConfirmDeleteBookModal";
import ConfirmDeleteWorldModal from "./ConfirmDeleteWorldModal";
import ManageLocationModal from "./ManageLocationModal";
import { useGlobalWorld } from "hooks/GlobalWorld";
import ManageWorldEventsModal from "./ManageWorldEventsModal";
import ManageTimelineModal from "./ManageTimelineModal";

/** Application Modals group: add all modals here for maximum efficiency */
export default function GlobalModalGroup() {
  const { active } = useGlobalModal();
  const WH = useGlobalWorld(["focusedWorld", "focusedLocation"]);

  return (
    <>
      {active === M.CONFIRM_DELETE_BOOK && <ConfirmDeleteBookModal open />}
      {active === M.CONFIRM_DELETE_WORLD && <ConfirmDeleteWorldModal open />}
      {active === M.LINK_SCENE && <ManageContentLinksModal open />}
      {active === M.MANAGE_BOOK && <ManageBookModal open />}
      {active === M.MANAGE_CHAPTER && <ManageChapterModal open />}
      {active === M.MANAGE_SCENE && <ManageSceneModal open />}
      {active === M.MANAGE_TIMELINE && <ManageTimelineModal open />}
      {[M.MANAGE_WORLD, M.CREATE_WORLD].includes(active) && (
        <ManageWorldModal open />
      )}

      {WH.focusedWorld && (
        <>
          {active === M.MANAGE_LOCATION && (
            <ManageLocationModal
              open
              data={WH.focusedLocation}
              worldId={WH.focusedWorld.id}
            />
          )}

          {/* World Events */}
          {active === M.MANAGE_WORLD_EVENTS && <ManageWorldEventsModal open />}
        </>
      )}
    </>
  );
}
