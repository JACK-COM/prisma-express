import styled from "styled-components";
import { AppRouteDef, Paths } from "routes/index";
import { FlexColumn } from "components/Common/Containers";
import { MatIcon } from "./Common/MatIcon";
import { ButtonLink, RoundButton } from "components/Forms/Button";
import ThemeSelector from "./ThemeSelector";
import AppAuth from "./AppAuth";
import { Link, useLocation, useMatch } from "react-router-dom";
import ModalDrawer from "./Modals/ModalDrawer";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { useEffect, useState } from "react";
import { useGlobalUser } from "hooks/GlobalUser";

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
  align-items: center;
  display: grid;
  grid-column-gap: 0.4rem;
  grid-template-columns: repeat(3, 1fr);
  position: fixed;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 999;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    position: relative;
    top: auto;
    right: auto;
  }
`;

const routes = [
  Paths.Dashboard,
  Paths.Library,
  Paths.BookStore,
  Paths.Characters,
  Paths.Worlds,
  Paths.Explorations,
  Paths.Timelines
];

const AppNav = () => {
  const location = useLocation();
  const { isMobile } = useGlobalWindow();
  const { authenticated } = useGlobalUser(["authenticated"]);
  const [open, setOpen] = useState(false);
  const closeDrawer = () => setOpen(false);
  const toggleDrawer = () => (isMobile ? setOpen(!open) : closeDrawer());

  useEffect(() => {
    closeDrawer();
  }, [location]);

  return (
    <>
      <Menu id="app-menu" className="app-menu">
        <FloatingButtons>
          {/* Navigation Links */}
          <RoundButton variant="transparent" size="lg">
            <MatIcon icon="search" />
          </RoundButton>

          {/* Light/Dark Theme */}
          <ThemeSelector />

          {/* Login/Logout Link */}
          <AppAuth />

          {isMobile && (
            <RoundButton animation="none" size="lg" variant="transparent">
              <MatIcon icon="menu" onClick={toggleDrawer} />
            </RoundButton>
          )}
        </FloatingButtons>

        <MenuLinks authenticated={authenticated} />
      </Menu>

      {isMobile && (
        <ModalDrawer
          title="App Menu"
          open={open}
          openTowards="left"
          onClose={closeDrawer}
        >
          <MenuLinks authenticated={authenticated} />
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
  color: #fff;
  text-shadow: ${({ theme }) => theme.presets.elevate.xs} #000;
  font-size: 0.9rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding: 0 0.6rem;

  &:hover,
  &.active {
    background-color: ${({ theme }) => theme.colors.accent}2c;
    text-shadow: none;
  }

  &.active:hover {
    color: initial;
  }
`;

function MenuLinks({ authenticated }: { authenticated: boolean }) {
  const active = ({ path }: AppRouteDef) => useMatch(`${path}/*`) !== null;
  const cn = (r: AppRouteDef) => (active(r) ? "active" : "");
  const showHide = authenticated ? "" : "hide";

  return (
    <MenuLinksContainer className="menu--links">
      {routes.map((r) => (
        <NavLink key={r.Index.path} className={cn(r.Index)} to={r.Index.path}>
          {r.Index.text}
        </NavLink>
      ))}
      <NavLink
        className={`${showHide} ${cn(Paths.Dashboard.Settings)}`}
        to={Paths.Dashboard.Settings.path}
      >
        {Paths.Dashboard.Settings.text}
      </NavLink>
    </MenuLinksContainer>
  );
}
