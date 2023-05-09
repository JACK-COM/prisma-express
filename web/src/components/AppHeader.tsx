import { Link } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";
import { GridContainer } from "./Common/Containers";
import { useGlobalTheme } from "hooks/GlobalTheme";

const LogoLink = styled(Link)`
  align-items: center;
  display: grid;
  filter: contrast(0.1) brightness(5) drop-shadow(0 0px 2px #001125ca);
  font-weight: 500;
  grid-gap: 0.3rem;
  grid-template-columns: 40px max-content;
  padding: 0.5rem 0;
  text-transform: uppercase;
  top: 0;

  .logo {
    display: block;
    pointer-events: none;
    font-family: "Ubuntu", sans-serif;
    font-size: 0.8rem;
    transition: filter 300ms;
    width: auto !important;
    will-change: filter;
  }

  &:hover .logo {
    filter: drop-shadow(0 0 2px #747bff9d) drop-shadow(0 -2px 2px #ffd773b1)
      drop-shadow(0 2px 3px #001125ca);
  }
`;
const Container = styled(GridContainer)`
  align-items: start;
  background: ${({ theme }) => theme.colors.bgGradientDir('180deg')};
  color: ${({ theme }) => theme.colors.primary};
  grid-template-columns: 100%;
  grid-template-rows: max-content auto;
  grid-row: 1 / span 2;
  justify-content: start;
  overflow-y: hidden;
  padding: 0 0.5rem;
  position: sticky;
  top: 0;
  z-index: 999;

  @media screen and (max-width: 768px) {
    align-items: center;
    grid-row: auto;
    grid-template-columns: repeat(2, max-content);
    height: fit-content;
    justify-content: space-between;
    width: 100%;
  }
`;

const AppHeader = () => {
  const { logoImage } = useGlobalTheme();

  return (
    <Container id="app-header">
      <LogoLink to="/" title="MythosForge | Home">
        <img src={logoImage} height={40} className="logo" alt="App Logo" />
        <span className="logo">Mythos Forge</span>
      </LogoLink>

      {/* Navigation Menu */}
      <AppNav />
    </Container>
  );
};

export default AppHeader;
