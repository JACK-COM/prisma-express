import styled from "styled-components";
import { MatIcon } from "components/Common/Containers";
import { WICProps } from "./WorldItem";
import { APIData, UserRole, World } from "utils/types";
import { createOrUpdateWorld } from "graphql/requests/worlds.graphql";
import { updateWorlds } from "state";

/** IconContainer */
const Icon = styled(MatIcon).attrs({ icon: "public" })<WICProps>`
  align-self: center;
  cursor: ${({ permissions }) =>
    permissions === "Author" ? "pointer" : "inherit"};
  grid-area: icon;
  margin-right: ${({ theme }) => theme.sizes.sm};
  pointer-events: ${({ permissions }) =>
    permissions === "Author" ? "fill" : "none"};

  &:active,
  &:focus {
    animation: beacon 400ms linear;
  }

  &:hover {
    animation: spin 300ms linear;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/** Component Props */
type PublicIconProps = {
  permissions?: UserRole;
  world: APIData<World>;
};

/** Icon that indicates (and toggles) a `World's` public visibility  */
const WorldPublicIcon = (props: PublicIconProps) => {
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
