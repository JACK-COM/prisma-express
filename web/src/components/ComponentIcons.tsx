import styled, { css } from "styled-components";
import { MatIcon, MatIconProps } from "./Common/MatIcon";
import {
  APIData,
  PermissionProps,
  UserRole,
  World,
  WorldType
} from "utils/types";
import { upsertWorld, deleteWorld } from "graphql/requests/worlds.graphql";
import {
  updateWorlds,
  removeWorld,
  updateAsError,
  setGlobalModal,
  MODAL,
  setGlobalWorld,
  addNotification,
  updateNotification
} from "state";
import { requireAuthor, noOp } from "utils";
import { useMemo } from "react";

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

// ICONS

export const PermissionedIcon = styled(MatIcon)<PermissionProps>`
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  ${iconStyles}
  cursor: pointer;
  ${editableStyles};
`;
export const TallIcon = styled(PermissionedIcon)`
  align-self: center;
  animation-fill-mode: backwards;
  font-size: 1rem;
  grid-row: 1 / span 2;
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};
  text-align: center;
`;

/** `World` Icon Container (indicates a `World` data-type) */
export const WorldIcon = styled(TallIcon)`
  animation: bounce 280ms linear;

  &:hover {
    animation: beacon 1.2s linear infinite;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const iconForWorld = (type: WorldType) => {
  switch (type) {
    case WorldType.Realm:
      return "grass";
    case WorldType.Universe:
      return "auto_awesome";
    case WorldType.Galaxy:
      return "storm";
    case WorldType.Star:
      return "star";
    default:
      return "public";
  }
};

/** Icon that indicates (and toggles) a `World's` public visibility  */
type WorldIconProps = Pick<ItemIconProps, "permissions"> & {
  data: APIData<World>;
};
export const WorldPublicIcon = (props: WorldIconProps) => {
  const { permissions, data: world } = props;
  const icon = useMemo(() => {
    if (permissions !== "Author") return "lock";
    return iconForWorld(world.type);
  }, [world]);
  const iconClass = world.public ? "icon success--text" : "icon error--text";
  const title = world.public ? "Public World" : "Private World";
  const togglePublic = requireAuthor(async () => {
    const noteId = addNotification("Updating World...", true);
    const isPublic = !world.public ? "is now Public" : "is now Private";
    const resp = await upsertWorld({ ...world, public: !world.public });
    if (resp && typeof resp !== "string") {
      updateWorlds([resp]);
      updateNotification(`${world.name} ${isPublic}`, noteId);
    } else updateAsError(resp || `Did not update ${world.name}`, noteId);
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
const PDeleteIcon = styled(TallIcon).attrs({ icon: "delete" })`
  align-self: center;
  cursor: ${({ "aria-disabled": disabled }) =>
    disabled ? "not-allowed" : "pointer"};
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
  const color = disabled ? "grey--text" : className;
  const iconClass = `delete ${color || ""}`.trim() || undefined;
  const onRemove = requireAuthor(
    () => !disabled && onItemClick(data),
    permissions
  );

  return (
    <PDeleteIcon
      aria-disabled={disabled || permissions === "Reader"}
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
    () => {
      setGlobalWorld(world);
      setGlobalModal(MODAL.CONFIRM_DELETE_WORLD);
    },
    permissions,
    false
  );

  return permissions === "Author" ? (
    <DeleteItemIcon
      className={`icon ${iconClass}`}
      {...rest}
      disabled={props.disabled || props["aria-disabled"] === "true"}
      data={world}
      onItemClick={onDelete}
      permissions="Author"
      title={title}
    />
  ) : (
    <></>
  );
};

/** Permissioned Icon for toggling book chapters modal */
type ChaptersIconProps = Pick<ItemIconProps, "permissions">;
export const ChaptersIcon = (props: ChaptersIconProps) => {
  const { permissions = "Reader", ...rest } = props;
  const iconClass = permissions === "Author" ? "success--text" : "grey--text";
  const onToggle = requireAuthor(
    () => setGlobalModal(MODAL.SELECT_CHAPTER),
    permissions,
    true
  );

  return (
    <TallIcon
      {...rest}
      style={{ padding: "0.6rem 0", textAlign: "center" }}
      icon="segments"
      className={`icon ${iconClass}`}
      onClick={onToggle}
      permissions={permissions}
      title="Book Chapters"
    />
  );
};
