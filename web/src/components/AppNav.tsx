import styled from "styled-components";
import { Paths } from "routes/index";
import ListView from "components/Common/ListView";
import { FlexColumn, MatIcon } from "components/Common/Containers";
import { ButtonLink, RoundButton, StyledLink } from "components/Forms/Button";
import ThemeSelector from "./ThemeSelector";
import AppAuth from "./AppAuth";
import { Link } from "react-router-dom";
import ModalDrawer from "./Modals/ModalDrawer";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { useState } from "react";

const Menu = styled.nav`
  align-items: center;
  display: grid;
  color: white;
  grid-template-columns: auto;

  @media screen and (max-width: 768px) {
    > .menu--links {
      display: none;
    }
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

const routes = [Paths.Library, Paths.Characters, Paths.Worlds, Paths.Timelines];

const AppNav = () => {
  const searchPath = Paths.Search.Index.path;
  const { isMobile } = useGlobalWindow();
  const [open, setOpen] = useState(false);
  const closeDrawer = () => setOpen(false);
  const toggleDrawer = () => (isMobile ? setOpen(!open) : closeDrawer());

  return (
    <>
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

          {isMobile && (
            <RoundButton variant="transparent">
              <MatIcon icon="menu" onClick={toggleDrawer} />
            </RoundButton>
          )}
        </FloatingButtons>

        <MenuLinks />
      </Menu>

      {isMobile && (
        <ModalDrawer
          title="App Menu"
          open={open}
          openTowards="left"
          onClose={closeDrawer}
        >
          <MenuLinks />
        </ModalDrawer>
      )}
    </>
  );
};

export default AppNav;

const MenuLinksContainer = styled(FlexColumn)`
  padding-top: 2rem;
  h6 {
    border-bottom: 0.05rem solid ${({ theme }) => theme.colors.primary};
    height: 2.5rem;
    line-height: 2.5rem;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-shadow: ${({ theme }) => theme.presets.elevate.xs} #000;
  height: 2.5rem;
  line-height: 2.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

function MenuLinks() {
  return (
    <MenuLinksContainer className="menu--links">
      <h6 className="primary--text">Menu</h6>
      {routes.map((r) => (
        <NavLink key={r.Index.path} to={r.Index.path}>
          {r.Index.text}
        </NavLink>
      ))}
    </MenuLinksContainer>
  );
}
