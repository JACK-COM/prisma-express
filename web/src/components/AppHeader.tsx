import { Link } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";
import { GridContainer } from "./Common/Containers";
import { useGlobalTheme } from "hooks/GlobalTheme";

const LogoLink = styled(Link)`
  align-items: center;
  display: flex;
  top: 0;
  margin-top: 0.5rem;

  .logo {
    display: block;
    height: 40px;
    pointer-events: none;
    transition: filter 300ms;
    width: auto !important;
    will-change: filter;
  }

  img {
    filter: contrast(0.1) brightness(5) drop-shadow(0 0px 2px #001125ca);
  }

  &:hover .logo {
    filter: drop-shadow(0 0 2px #747bff9d) drop-shadow(0 -2px 2px #ffd773b1)
      drop-shadow(0 2px 3px #001125ca);
  }
`;
const HeaderContainer = styled(GridContainer)`
  align-items: start;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  grid-template-columns: max-content;
  grid-template-rows: max-content auto;
  justify-content: start;
  overflow-y: hidden;
  padding: 0 0.5rem;
  position: sticky;
  top: 0;
  z-index: 999;

  @media screen and (max-width: 768px) {
    align-items: center;
    grid-template-columns: repeat(2, max-content);
    height: fit-content;
    justify-content: space-between;
    width: 100%;
  }
`;

const AppHeader = () => {
  const { logoImage } = useGlobalTheme();

  return (
    <HeaderContainer>
      <LogoLink to="/" title="MythosForge | Home">
        <img src={logoImage} className="logo" alt="App Logo" />
      </LogoLink>

      {/* Navigation Menu */}
      <AppNav />
    </HeaderContainer>
  );
};

export default AppHeader;
