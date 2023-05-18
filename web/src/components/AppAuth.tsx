import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalUser } from "hooks/GlobalUser";
import { API_BASE } from "utils/constants";
import { MatIcon } from "./Common/MatIcon";
import { RoundButton } from "components/Forms/Button";
import { GridItem } from "components/Common/Containers";
import { GridItemTitle } from "components/Common/Containers";
import { truncateString } from "utils";
import { TallIcon } from "./ComponentIcons";
import useElemBlur from "hooks/GlobalElemBlur";
import { Link } from "react-router-dom";
import { Paths } from "routes";
import ImageLoader from "./Common/ImageLoader";

const Container = styled.aside`
  display: inline-flex;
`;
const Submenu = styled.menu`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bgColor};
  border-radius: ${({ theme }) => theme.presets.round.sm};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  display: grid;
  filter: drop-shadow(0 0 0.5rem #001125ca);
  grid-template-columns: 1fr;
  padding: 0.4rem;
  position: fixed;
  right: 0.5rem;
  top: 2.2rem;
  width: 200px;
`;
const SubmenuGrid = css`
  align-items: center;
  grid-column-gap: 0.4rem;
  grid-template-columns: 24px 1fr;
`;
const SubmenuTitle = styled(GridItemTitle)`
  display: grid;
  ${SubmenuGrid}
`;
const $submenuItem = css`
  cursor: pointer;
  font-size: smaller;
  text-shadow: ${({ theme }) => theme.presets.elevate.xs} #001125ec;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent}3c;
  }
`;
const SubmenuItem = styled(GridItem)`
  ${SubmenuGrid}
  ${$submenuItem}
`;
const SubmenuLink = styled(Link)`
  color: inherit;
  display: grid;
  padding: 0.4rem;
  ${SubmenuGrid}
  ${$submenuItem}
`;
const API = API_BASE;
const LOGIN_URL = `${API}/login/google?`;
export const LOGOUT_URL = `${API}/logout/google?`;

const AppAuth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { email, displayName, image, authenticated } = useGlobalUser([
    "email",
    "displayName",
    "image",
    "authenticated"
  ]);
  const [submenu, showSubmenu] = useState(false);
  const [authUrl, authTitle, authClass] = useMemo(() => {
    const url = email ? LOGOUT_URL : LOGIN_URL;
    return email ? [url, `Log out ${email}`, "accent"] : [url, "Log in"];
  }, [email]);

  // Toggle submenu
  const toggleSubmenu = () => showSubmenu(!submenu);

  const closeSubmenu = () => showSubmenu(false);

  // Login/logout handler. Opens new window for Google auth if no email in state
  const authenticate = () => {
    closeSubmenu();
    localStorage.setItem("authenticating", String(Number(!displayName)));
    window.open(authUrl, "_self");
  };

  // Set authenticating state for reload
  const onAuth: MouseEventHandler<any> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle submenu if already authenticated
    if (authenticated) return toggleSubmenu();
    // otherwise begin login flow
    return authenticate();
  };

  // HOOK: Close submenu when it loses focus
  const containerRef = useRef(null);
  useElemBlur(containerRef, () => showSubmenu(false));

  // HOOK: Close submenu on escape key
  useEffect(() => {
    // Trigger handler on ESC keypress
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSubmenu();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Write path to localStorage for login/logout
  // This allows a user to maintain context when they login via Google
  useEffect(() => {
    const current = pathname === "/login" ? "/dashboard" : pathname;
    const lastViewed = localStorage.getItem("nextPath") || current;
    const authenticating = localStorage.getItem("authenticating") === "1";

    if (displayName && authenticating) {
      localStorage.removeItem("nextPath");
      localStorage.removeItem("authenticating");
      navigate(lastViewed, { replace: true });
    } else if (!authenticating) localStorage.setItem("nextPath", current);
  }, [pathname, displayName]);

  return (
    <Container ref={containerRef}>
      {/* Login/Logout Link */}
      <RoundButton
        type="button"
        className={authClass}
        onClick={onAuth}
        title={authTitle}
        size="lg"
        variant={authenticated ? undefined : "transparent"}
      >
        {displayName ? (
          <ImageLoader
            round
            src={image}
            fallbackIcon="account_circle"
            width={32}
          />
        ) : (
          <MatIcon icon={"login"} />
        )}
      </RoundButton>

      {/* submenu */}
      {submenu && (
        <Submenu className="submenu slide-in-down">
          {authenticated && (
            <SubmenuTitle className="accent--text">
              <TallIcon permissions="Reader" icon="person" />
              {truncateString(displayName, 4)}
            </SubmenuTitle>
          )}
          <SubmenuLink
            to={Paths.Dashboard.Settings.path}
            onClick={closeSubmenu}
          >
            <TallIcon permissions="Reader" icon="manage_accounts" />
            Settings
          </SubmenuLink>

          <SubmenuItem role="button" onClick={authenticate}>
            <TallIcon permissions="Reader" icon="power_off" />
            Logout
          </SubmenuItem>
        </Submenu>
      )}
    </Container>
  );
};

export default AppAuth;
