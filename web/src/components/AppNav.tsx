import styled from "styled-components";
import { Paths } from "routes/index";
import ListView from "components/Common/ListView";
import { FlexColumn, MatIcon } from "components/Common/Containers";
import { ButtonLink, StyledLink } from "components/Forms/Button";
import ThemeSelector from "./ThemeSelector";
import AppAuth from "./AppAuth";
import { Link } from "react-router-dom";

const Menu = styled.nav`
  align-items: center;
  display: grid;
  color: white;
  grid-template-columns: auto;
`;

const MenuLinks = styled(FlexColumn)`
  padding-top: 2rem;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const FloatingButtons = styled.div`
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 999;

  @media screen and (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
  }
`;

const NavLink = styled(Link)`
  color: white;
  height: 2.5rem;
  line-height: 2.5rem;
`;

const routes = [Paths.Library, Paths.Characters, Paths.Worlds, Paths.Timelines];

const AppNav = () => {
  const searchPath = Paths.Search.Index.path;

  return (
    <Menu className="app-menu">
      <FloatingButtons>
        {/* Navigation Links */}
        <ButtonLink variant="transparent" round href={searchPath}>
          <MatIcon icon="search" />
        </ButtonLink>

        {/* Light/Dark Theme */}
        <ThemeSelector />

        {/* Login/Logout Link */}
        <AppAuth />
      </FloatingButtons>

      <MenuLinks>
        <h6>Menu</h6>
        {routes.map((r) => (
          <NavLink key={r.Index.path} to={r.Index.path}>
            {r.Index.text}
          </NavLink>
        ))}
      </MenuLinks>
    </Menu>
  );
};

export default AppNav;
