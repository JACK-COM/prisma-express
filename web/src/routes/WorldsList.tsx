import { useEffect, useState } from "react";
import styled from "styled-components";
import Breadcrumbs from "components/Common/Breadcrumbs";
import {
  PageContainer,
  PageDescription,
  PageTitle
} from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Paths } from "routes";
import { listWorlds } from "graphql/requests/worlds.graphql";
import CreateWorldModal from "components/Modals/CreateWorldModal";
import { useGlobalModal } from "hooks/GlobalModal";
import { MODAL, setGlobalWorlds } from "state";
import { APIData, World } from "utils/types";
import ListView from "components/Common/ListView";
import { Hint } from "components/Forms/Form";
import { lineclamp } from "theme/theme.shared";
import { useGlobalWorld } from "hooks/GlobalWorld";

const { Worlds: WorldPaths } = Paths;
const AddWorldButton = styled(ButtonWithIcon).attrs({ variant: "outlined" })`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;
const List = styled(ListView)`
  margin: ${({ theme }) => theme.sizes.md} 0;
`;

const WorldItemContainer = styled.div`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  cursor: pointer;
  padding: ${({ theme }) => theme.sizes.xs} 0;
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.colors.semitransparent};
  }
`;
const WorldItemHint = styled(Hint)`
  ${lineclamp(1)};
  width: 100%;
`;
type WorldItemProps = { world: World };
const WorldItem = ({ world }: WorldItemProps) => {
  return (
    <WorldItemContainer>
      <b>{world.name}</b>
      <WorldItemHint>{world.description}</WorldItemHint>
    </WorldItemContainer>
  );
};

/** ROUTE: List of worlds */
const WorldsList = () => {
  const { active, setGlobalModal } = useGlobalModal();
  const { selectedWorld, worlds, setGlobalWorld } = useGlobalWorld();
  const loadWorlds = async () => setGlobalWorlds(await listWorlds());
  const selectWorld = (world: APIData<World>) => {
    setGlobalWorld(world);
    setGlobalModal(MODAL.MANAGE_WORLD);
  };

  useEffect(() => {
    loadWorlds();
  }, []);

  return (
    <PageContainer>
      <header>
        <Breadcrumbs data={[WorldPaths.Index]} />
        <PageTitle>{WorldPaths.Index.text}</PageTitle>
        <PageDescription>
          Create or manage your <b>Worlds</b> and realms here.
        </PageDescription>
      </header>

      <div className="card">
        <h3 className="h4">Your Worlds</h3>
        {/* List */}
        {!worlds?.length && (
          <EmptyText>
            A formless void, without <b>Worlds</b> to display
          </EmptyText>
        )}

        <List
          data={worlds || []}
          itemText={(world: World) => <WorldItem world={world} />}
          onItemClick={selectWorld}
        />

        {/* Add new (button) */}
        <AddWorldButton
          size="lg"
          icon="public"
          text="Create New World"
          onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
        />
      </div>

      <CreateWorldModal
        data={selectedWorld}
        open={active === MODAL.MANAGE_WORLD}
      />
    </PageContainer>
  );
};

export default WorldsList;
