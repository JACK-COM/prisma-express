import styled from "styled-components";
import { MatIcon } from "components/Common/Containers";
import { WICProps } from "./WorldItem";
import { APIData, UserRole, World } from "utils/types";
import {
  createOrUpdateWorld,
  deleteWorld
} from "graphql/requests/worlds.graphql";
import { updateWorlds, removeWorld } from "state";

/** IconContainer */
const Icon = styled(MatIcon).attrs({ icon: "public" })<WICProps>`
  align-self: center;
  animation: shake 280ms linear;
  cursor: ${({ permissions }) =>
    permissions === "Author" ? "pointer" : "inherit"};
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  &:active,
  &:focus {
  }

  &:hover {
    animation-name: spin;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/** Component Props */
type WorldIconProps = {
  permissions?: UserRole;
  world: APIData<World>;
};

/** Icon that indicates (and toggles) a `World's` public visibility  */
export const WorldPublicIcon = (props: WorldIconProps) => {
  const { permissions, world } = props;
  const iconClass = world.public ? "icon success--text" : "icon error--text";
  const title = world.public ? "Public World" : "Private World";
  const togglePublic: React.MouseEventHandler = async (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    const data = { ...world, public: !world.public };
    const resp = await createOrUpdateWorld(data);
    if (resp) updateWorlds([resp]);
  };

  return (
    <Icon
      className={iconClass}
      onClick={togglePublic}
      permissions={permissions || "Reader"}
      title={title}
    />
  );
};

export default WorldPublicIcon;

/** Icon that indicates (and toggles) a `World's` public visibility  */
export const WorldDeleteIcon = (props: WorldIconProps) => {
  const { permissions, world } = props;
  const iconClass = world.public ? "icon success--text" : "icon error--text";
  const title = world.public ? "Public World" : "Private World";
  const onRemoveWorld: React.MouseEventHandler = async (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    const data = { ...world, public: !world.public };
    const resp = await deleteWorld(world.id);
    if (resp) removeWorld(world.id);
  };

  return (
    <Icon
      className={iconClass}
      onClick={onRemoveWorld}
      permissions={permissions || "Reader"}
      title={title}
    />
  );
};
