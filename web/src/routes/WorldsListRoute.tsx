import { useEffect } from "react";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { clearGlobalWorld } from "state";
import PageLayout from "components/Common/PageLayout";
import WorldsList from "components/List.Worlds";

/** ROUTE: List of worlds */
const WorldsListRoute = () => {
  const { clearGlobalModal } = useGlobalModal();
  const { focusedWorld, worlds = [] } = useGlobalWorld([
    "focusedWorld",
    "worlds",
    "worldLocations"
  ]);
  const clearComponentData = () => {
    clearGlobalModal();
    clearGlobalWorld();
  };

  useEffect(() => {
    return () => clearComponentData();
  }, []);

  return (
    <PageLayout
      id="world-list"
      title={Paths.Worlds.Index.text}
      breadcrumbs={[Paths.Worlds.Index]}
      description="Create or manage your <b>Worlds</b> and realms here."
    >
      <WorldsList
        className="fill"
        showControls
        worlds={worlds}
        focusedWorld={focusedWorld}
      />
    </PageLayout>
  );
};

export default WorldsListRoute;
