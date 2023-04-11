import styled, { css } from "styled-components";
import { MatIcon, MatIconProps } from "components/Common/Containers";
import { APIData, PermissionProps, UserRole, World } from "utils/types";
import {
  createOrUpdateWorld,
  deleteWorld
} from "graphql/requests/worlds.graphql";
import { updateWorlds, removeWorld } from "state";
import { guard, noOp, suppressEvent } from "utils";

/** `World` Icon Container (indicates a `World` data-type) */
const WorldIcon = styled(MatIcon).attrs({ icon: "public" })<PermissionProps>`
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

/* CSS for icons */
export const iconStyles = css`
  align-self: center;
  animation: bounce 400ms linear;
  grid-row: 1 / span 2;
  margin: 0 ${({ theme }) => theme.sizes.sm} 0 0;
`;
/* CSS for editable items */
export const editableStyles = css`
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
export const PermissionedIcon = styled(MatIcon)<PermissionProps>`
  display: ${({ permissions }) =>
    permissions === "Author" ? "block" : "none"};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  ${iconStyles}
  cursor: pointer;
  ${editableStyles};
`;

/** Generic Icon component Props */
type ItemIconProps = Omit<MatIconProps, "onClick" | "icon"> & {
  onItemClick?: (data?: any) => void;
  permissions?: UserRole;
  disabled?: boolean;
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
    suppressEvent(e);
    const data = { ...world, public: !world.public };
    const resp = await createOrUpdateWorld(data);
    if (resp && typeof resp !== "string") updateWorlds([resp]);
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
type DIProps = { disabled: boolean };
const DeleteIcon = styled(PermissionedIcon).attrs({ icon: "delete" })<DIProps>`
  align-self: last baseline;
  cursor: ${({ disabled = false }) => (disabled ? "not-allowed" : "pointer")};
  pointer-events: ${({ permissions, disabled }) =>
    !disabled && permissions === "Author" ? "fill" : "none"};
  grid-column: initial;
  grid-row: initial;
`;
export const DeleteItemIcon = (props: ItemIconProps) => {
  const {
    permissions,
    data,
    disabled = false,
    className,
    onItemClick = noOp,
    ...rest
  } = props;
  const color = disabled ? "grey--text" : "error--text";
  const iconClass = `${color} ${className || ""}`.trim() || undefined;
  const onRemove = guard(() => !disabled && onItemClick(data), permissions);

  return (
    <DeleteIcon
      disabled={disabled}
      {...rest}
      icon="delete"
      permissions={permissions || "Reader"}
      className={iconClass}
      onClick={onRemove}
    />
  );
};
