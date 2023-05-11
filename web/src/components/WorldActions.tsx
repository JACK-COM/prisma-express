import styled from "styled-components";
import { GlobalWorld, MODAL, setGlobalModal } from "state";
import { Card, CardTitle, GridContainer, MatIcon } from "./Common/Containers";
import { ButtonWithIcon, RoundButton } from "./Forms/Button";
import { Fragment } from "react";

const ActionButton = styled(ButtonWithIcon)`
  align-self: end;
`;
const toolbarOpts = [
  {
    icon: "manage_history",
    text: "Manage Events",
    onClick: () => setGlobalModal(MODAL.MANAGE_WORLD_EVENTS)
  },
  {
    icon: "delete",
    text: "Delete World",
    onClick: () => setGlobalModal(MODAL.CONFIRM_DELETE_WORLD)
  }
];

export default function WorldActions() {
  return (
    <Card>
      <CardTitle className="flex">
        <RoundButton
          variant="transparent"
          size="md"
          onClick={() => setGlobalModal(MODAL.MANAGE_WORLD)}
        >
          <MatIcon icon="settings" className="accent--text" />
        </RoundButton>
        Manage&nbsp;<span className="accent--text">World</span>
      </CardTitle>

      <GridContainer columns="1fr" style={{ marginBottom: "1.5rem" }}>
        {toolbarOpts.map((opt, i) => (
          <Fragment key={i}>
            <ActionButton
              className={opt.icon === "delete" ? "error--text" : undefined}
              icon={opt.icon}
              text={opt.text}
              variant="outlined"
              onClick={opt.onClick}
            />
            {i < toolbarOpts.length - 1 && <hr className="transparent" />}
          </Fragment>
        ))}
      </GridContainer>
    </Card>
  );
}
