import styled, { css } from "styled-components";
import { MatIcon, MatIconProps } from "components/Common/Containers";
import { APIData, PermissionProps, UserRole, World } from "utils/types";
import { upsertWorld, deleteWorld } from "graphql/requests/worlds.graphql";
import { updateWorlds, removeWorld } from "state";
import { requireAuthor, noOp, suppressEvent } from "utils";

/** Generic Icon component Props */
type ItemIconProps = Omit<MatIconProps, "onClick" | "icon"> & {
  onItemClick?: (data?: any) => void;
  permissions?: UserRole;
  disabled?: boolean;
  data: APIData<any>;
};

/* CSS for icons */
export const iconStyles = css`
  align-self: center;
  animation: bounce 400ms linear;
`;
/* CSS for editable items */
export const editableStyles = css`
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
export const PermissionedIcon = styled(MatIcon)<PermissionProps>`
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  ${iconStyles}
  cursor: pointer;
  ${editableStyles};
`;

/** `World` Icon Container (indicates a `World` data-type) */
const WorldIcon = styled(PermissionedIcon)<PermissionProps>`
  align-self: center;
  animation: shake 280ms linear;
  grid-row: 1/3;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  &:hover {
    animation-name: spin;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/** Icon that indicates (and toggles) a `World's` public visibility  */
type WorldIconProps = Pick<ItemIconProps, "permissions"> & {
  data: APIData<World>;
};
export const WorldPublicIcon = (props: WorldIconProps) => {
  const { permissions, data: world } = props;
  const icon = permissions === "Author" ? "public" : "lock";
  const iconClass = world.public ? "icon success--text" : "icon error--text";
  const title = world.public ? "Public World" : "Private World";
  const togglePublic = requireAuthor(async () => {
    const resp = await upsertWorld({ ...world, public: !world.public });
    if (resp && typeof resp !== "string") updateWorlds([resp]);
  }, permissions);

  return (
    <WorldIcon
      icon={icon}
      className={iconClass}
      onClick={togglePublic}
      permissions={permissions || "Reader"}
      title={title}
    />
  );
};

/** Generic "Delete Item" Icon */
type DIProps = { disabled: boolean };
const PDeleteIcon = styled(PermissionedIcon).attrs({ icon: "delete" })<DIProps>`
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
  const onRemove = requireAuthor(
    () => !disabled && onItemClick(data),
    permissions
  );

  return (
    <PDeleteIcon
      disabled={disabled}
      {...rest}
      icon="delete"
      permissions={permissions || "Reader"}
      className={iconClass}
      onClick={onRemove}
    />
  );
};

/** Icon that deletes a `World` from the server and state */
export const DeleteWorldIcon = (props: WorldIconProps & ItemIconProps) => {
  const { permissions, data: world, ...rest } = props;
  const iconClass = world.public ? "success--text" : "error--text";
  const title = world.public ? "Public World" : "Private World";
  const onDelete = requireAuthor(
    async () => {
      const resp = await deleteWorld(world.id);
      if (typeof resp === "string") return console.log(resp);
      if (resp) removeWorld(world.id);
    },
    permissions,
    false
  );

  return permissions === "Author" ? (
    <DeleteItemIcon
      className={`icon ${iconClass}`}
      {...rest}
      data={world}
      onItemClick={onDelete}
      permissions="Author"
      title={title}
    />
  ) : (
    <></>
  );
};
