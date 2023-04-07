import { useState } from "react";
import styled from "styled-components";
import Breadcrumbs from "components/Common/Breadcrumbs";
import { PageContainer, PageTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { Hint } from "components/Forms/Form";
import Modal from "components/Modals/Modal";
import { Paths } from "routes";
import CreateWorldForm from "components/Form.CreateWorld";
import { CreateWorldData, createWorld } from "graphql/requests/worlds.graphql";

const { Worlds: WorldPaths } = Paths;
const AddWorldButton = styled(ButtonWithIcon).attrs({ variant: "transparent" })`
  align-self: end;
`;
const EmptyText = styled.p`
  font-style: oblique;
`;

/** ROUTE: List of worlds */
const WorldsList = () => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateWorldData>>({});
  const submit = async () => {
    console.log("CreateWorld.submit", formData)
    const resp = await createWorld(formData);
    console.log("CreateWorld.response", resp);
    if (resp !== null) setEditing(false);
  };

  return (
    <PageContainer>
      <Breadcrumbs data={[WorldPaths.Index]} />
      <PageTitle>{WorldPaths.Index.text}</PageTitle>
      <Hint>
        Create or manage your <b>Worlds</b> and realms here.
      </Hint>

      <div className="card">
        {/* List */}
        <EmptyText>
          No <b>Worlds</b> to display
        </EmptyText>

        {/* Add new (button) */}
        <AddWorldButton
          size="lg"
          icon="public"
          text="Create New World"
          onClick={() => setEditing(true)}
        />
      </div>

      <div className="card"></div>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Create New World"
        cancelText="Cancel"
        confirmText="Create"
        onConfirm={submit}
      >
        <CreateWorldForm data={formData} onChange={setFormData} />
      </Modal>
    </PageContainer>
  );
};

export default WorldsList;
