import { Suspense, lazy } from "react";
import { MODAL as M } from "state";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalWorld } from "hooks/GlobalWorld";
import FullScreenLoader from "components/Common/FullscreenLoader";

// All delete-confirmation modals
const BookModal = lazy(() => import("./ManageBookModal"));
const ExplorationModal = lazy(() => import("./ManageExplorationModal"));
const ExplorationSceneModal = lazy(
  () => import("components/Modals/ManageExplorationSceneModal")
);
const ChapterModal = lazy(() => import("./ManageChapterModal"));
const ConfirmDeleteModal = lazy(() => import("./ConfirmDeleteModal"));
const ContentLinksModal = lazy(() => import("./ManageLinksModal"));
const InteractiveSlotModal = lazy(() => import("./ManageInteractiveSlotModal"));
const LocationModal = lazy(() => import("./ManageLocationModal"));
const SceneModal = lazy(() => import("./ManageSceneModal"));
const TimelineModal = lazy(() => import("./ManageTimelineModal"));
const WorldEventsModal = lazy(() => import("./ManageWorldEventsModal"));
const WorldModal = lazy(() => import("components/Modals/ManageWorldModal"));

// All delete-confirmation modal states
const deleteState = [
  M.CONFIRM_DELETE_BOOK,
  M.CONFIRM_DELETE_CHARACTER,
  M.CONFIRM_DELETE_EXPLORATION,
  M.CONFIRM_DELETE_EXPLORATION_SCENE,
  M.CONFIRM_DELETE_LOCATION,
  M.CONFIRM_DELETE_WORLD
];

/**
 * Application Modals group: add all modals here for maximum efficiency, if
 * their data can live in some global state instance. */
export default function GlobalModalGroup() {
  const { active } = useGlobalModal();
  const WH = useGlobalWorld(["focusedWorld", "focusedLocation"]);

  return (
    <Suspense fallback={<FullScreenLoader msg="Loading Modal" />}>
      {deleteState.includes(active) && <ConfirmDeleteModal open />}

      {active === M.LINK_SCENE && <ContentLinksModal open />}
      {[M.MANAGE_BOOK, M.CREATE_BOOK].includes(active) && <BookModal open />}

      {[M.CREATE_EXPLORATION, M.MANAGE_EXPLORATION].includes(active) && (
        <ExplorationModal open />
      )}

      {[M.CREATE_EXPLORATION_SCENE, M.MANAGE_EXPLORATION_SCENE].includes(
        active
      ) && <ExplorationSceneModal open />}

      {[M.MANAGE_INTERACTIVE_SLOT, M.CREATE_INTERACTIVE_SLOT].includes(
        active
      ) && <InteractiveSlotModal open />}

      {active === M.MANAGE_CHAPTER && <ChapterModal open />}
      {active === M.MANAGE_SCENE && <SceneModal open />}
      {active === M.MANAGE_TIMELINE && <TimelineModal open />}
      {[M.CREATE_WORLD, M.MANAGE_WORLD].includes(active) && <WorldModal open />}

      {WH.focusedWorld && (
        <>
          {active === M.MANAGE_LOCATION && (
            <LocationModal
              open
              data={WH.focusedLocation}
              worldId={WH.focusedWorld.id}
            />
          )}

          {/* World Events */}
          {active === M.MANAGE_WORLD_EVENTS && <WorldEventsModal open />}
        </>
      )}
    </Suspense>
  );
}
