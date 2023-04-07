import { Link } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";
import { FlexRow, GridContainer } from "./Common/Containers";
import { useGlobalTheme } from "hooks/GlobalTheme";

const LogoLink = styled(Link)`
  align-items: center;
  display: flex;

  .logo {
    display: block;
    height: 40px;
    pointer-events: none;
    transition: filter 300ms;
    width: auto !important;
    will-change: filter;
  }

  &:hover {
    filter: drop-shadow(0 0 8px #646cffaa) drop-shadow(0 -2em 2em #ffb964aa);

    .logo {
      filter: blur(2px);
    }
  }
`;
const HeaderContainer = styled(GridContainer)`
  background-color: black;
  border-bottom: 1px solid ${({ theme }) => theme.colors.semitransparent};
  color: ${({ theme }) => theme.colors.primary};
  height: 60px;
  justify-content: space-between;
  padding: 0 0.5rem;
  top: 0;

  @media screen and (max-width: 767px) {
    height: fit-content;
    grid-template-columns: auto;
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
