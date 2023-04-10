import styled from "styled-components";
import { MatIcon, MatIconProps } from "components/Common/Containers";
import { WICProps } from "./WorldItem";
import { APIData, UserRole, World } from "utils/types";
import {
  createOrUpdateWorld,
  deleteWorld
} from "graphql/requests/worlds.graphql";
import { updateWorlds, removeWorld } from "state";
import { noOp } from "utils";

/** `World` Icon Container (indicates a `World` data-type) */
const WorldIcon = styled(MatIcon).attrs({ icon: "public" })<WICProps>`
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

/** Generic Icon component Props */
type ItemIconProps = Omit<MatIconProps, "onClick" | "icon"> & {
  onItemClick?: (data?: any) => void;
  permissions?: UserRole;
  data: APIData<any>;
};

/** Icon that indicates (and toggles) a `World's` public visibility  */
type WorldIconProps = Pick<ItemIconProps, "permissions"> & {
  data: APIData<World>;
};
export const WorldPublicIcon = (props: WorldIconProps) => {
  const { permissions, data: world } = props;
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
    <WorldIcon
      className={iconClass}
      onClick={togglePublic}
      permissions={permissions || "Reader"}
      title={title}
    />
  );
};

/** Icon that deletes a `World` from the server and state */
export const WorldDeleteIcon = (props: WorldIconProps) => {
  const { permissions, data: world } = props;
  const iconClass = world.public ? "icon success--text" : "icon error--text";
  const title = world.public ? "Public World" : "Private World";
  const onRemoveWorld: React.MouseEventHandler = async (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    const resp = await deleteWorld(world.id);
    if (resp) removeWorld(world.id);
  };

  return (
    <WorldIcon
      className={iconClass}
      onClick={onRemoveWorld}
      permissions={permissions || "Reader"}
      title={title}
    />
  );
};

/** Generic "Delete Item" Icon */
export const DeleteItemIcon = (props: ItemIconProps) => {
  const { permissions, data, className, onItemClick = noOp, ...rest } = props;
  const iconClass = `${className || ""}`.trim() || undefined;
  const onRemove: React.MouseEventHandler = async (e) => {
    if (permissions !== "Author") return;
    e.stopPropagation();
    onItemClick(data);
  };

  return (
    <WorldIcon
      {...rest}
      className={iconClass}
      onClick={onRemove}
      permissions={permissions || "Reader"}
    />
  );
};
