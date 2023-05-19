import { GlobalUser, GlobalWorld, MODAL, setGlobalModal } from "state";
import { Card, CardTitle, GridContainer } from "./Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { ButtonWithIcon, RoundButton } from "./Forms/Button";
import { Fragment } from "react";
import { LocationType, locationTypes } from "utils/types";

const actions = [
  {
    icon: "face",
    text: "Add a Character",
    types: undefined,
    onClick: () => setGlobalModal(MODAL.MANAGE_CHARACTER)
  },
  {
    icon: "explore",
    text: "Add Exploration",
    onClick: () => setGlobalModal(MODAL.CREATE_EXPLORATION)
  },
  {
    icon: "delete",
    text: "Delete Location",
    types: undefined,
    onClick: () => setGlobalModal(MODAL.CONFIRM_DELETE_LOCATION)
  }
];

const { Other } = LocationType;

export default function LocationActions() {
  const { id: userId } = GlobalUser.getState();
  const { focusedLocation } = GlobalWorld.getState();
  const owner = focusedLocation?.authorId === userId;
  const { type, parentLocationId } = focusedLocation || { type: Other };
  const superlocation = type === Other && !parentLocationId;
  const canDo = ({ types: t }: { types?: LocationType }) =>
    !t || locationTypes.indexOf(type) <= locationTypes.indexOf(t);
  const wactions = actions.filter((a) => superlocation || canDo(a));
  const lastAction = wactions.length - 1;

  return (
    <Card>
      <CardTitle className="flex">
        <RoundButton
          disabled={!owner}
          variant="transparent"
          size="md"
          onClick={() => setGlobalModal(MODAL.MANAGE_LOCATION)}
        >
          <MatIcon icon="settings" className="accent--text" />
        </RoundButton>
        Manage&nbsp;<span className="accent--text">Location</span>
      </CardTitle>

      <GridContainer columns="1fr" style={{ marginBottom: "1.5rem" }}>
        {wactions.map((opt, i) => (
          <Fragment key={i}>
            <ButtonWithIcon
              disabled={!owner && opt.icon === "delete"}
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
