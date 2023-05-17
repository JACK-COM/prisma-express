import { GlobalWorld, MODAL, setGlobalModal } from "state";
import { Card, CardTitle, GridContainer } from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { ButtonWithIcon, RoundButton } from "./Forms/Button";
import { Fragment } from "react";
import { WorldType, worldTypes } from "utils/types";

const actions = [
  {
    icon: "explore",
    text: "Add Exploration",
    onClick: () => setGlobalModal(MODAL.CREATE_EXPLORATION)
  },
  {
    icon: "public",
    text: "Add World",
    types: WorldType.Star,
    onClick: () => setGlobalModal(MODAL.CREATE_WORLD)
  },
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
  const { focusedWorld } = GlobalWorld.getState();
  const { type, parentWorldId } = focusedWorld || { type: WorldType.Other };
  const superlocation = type === WorldType.Other && !parentWorldId;
  const canDo = ({ types: t }: { types?: WorldType }) =>
    !t || worldTypes.indexOf(type) <= worldTypes.indexOf(t);
  const wactions = actions.filter((a) => superlocation || canDo(a));
  const lastAction = wactions.length - 1;

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
        {wactions.map((opt, i) => (
          <Fragment key={i}>
            <ButtonWithIcon
              className={opt.icon === "delete" ? "error--text" : undefined}
              icon={opt.icon}
              text={opt.text}
              variant="outlined"
              onClick={opt.onClick}
            />
            {i < lastAction && <hr className="transparent" />}
          </Fragment>
        ))}
      </GridContainer>
    </Card>
  );
}
