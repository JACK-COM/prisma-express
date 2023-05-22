import { useEffect } from "react";
import { Paths } from "routes";
import PageLayout from "components/Common/PageLayout";
import {
  GlobalCharacter,
  clearGlobalCharacter,
  clearGlobalModal,
  clearGlobalWorld,
  setGlobalLocation
} from "state";
import ExplorationsList from "components/List.Explorations";
import useGlobalExploration from "hooks/GlobalExploration";

type Params = { worldId: string; locationId: string };
/** @route A single World `Location` */
const ExplorationsListRoute = () => {
  const { explorations } = useGlobalExploration(["explorations"]);
  const clearModalData = () => {
    clearGlobalModal();
    setGlobalLocation(null);
  };
  const clearComponentData = () => {
    clearModalData();
    clearGlobalWorld();
    clearGlobalCharacter();
    GlobalCharacter.characters([]);
  };

  useEffect(() => clearComponentData, []);

  return (
    <PageLayout
      id="world-locations"
      breadcrumbs={[Paths.Explorations.Index]}
      title={Paths.Explorations.Index.text}
      description={`Create or Mange <b>Explorations</b> here`}
    >
      <ExplorationsList
        className="fill"
        showControls
        explorations={explorations}
      />
    </PageLayout>
  );
};

export default ExplorationsListRoute;
