import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Paths } from "../routes/index";
import { useGlobalUser } from "../hooks/GlobalUser";
import ListView from "./Common/ListView";
import { API_BASE } from "../utils/constants";
import { ButtonLink } from "./Forms/Button";
import { MatIcon } from "./Common/Containers";

const StyledLink = styled(Link)`
  font-size: 0.8rem;
`;
const Menu = styled.nav`
  align-items: center;
  display: grid;
  grid-template-columns: repeat(2, max-content);
`;
const API = API_BASE;

const AppNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { email } = useGlobalUser(["email"]);
  const [authUrl, authText, authTitle, authClass] = useMemo(() => {
    const url = email ? `${API}/logout/google?` : `${API}/login/google?`;
    return email
      ? [url, "Logout", `Log out ${email}`, "error"]
      : [url, "Login", "Log in", undefined];
  }, [email]);
  // Set authenticating state for reload
  const onAuth = () => {
    const authenticating = Number(!email);
    localStorage.setItem("authenticating", String(authenticating));
  };
  const routes = [Paths.Search.Index];
  if (email) routes.push(Paths.Dashboard.Index);
  // else routes.push(Paths.Categories.Index);

  // Write path to localStorage for login/logout
  useEffect(() => {
    const current = pathname === "/login" ? "/" : pathname;
    const lastViewed = localStorage.getItem("nextPath") || current;
    const authenticating = localStorage.getItem("authenticating") === "1";

    if (email && authenticating) {
      localStorage.removeItem("nextPath");
      localStorage.removeItem("authenticating");
      navigate(lastViewed, { replace: true });
    } else if (!authenticating) localStorage.setItem("nextPath", current);
  }, [pathname, email]);

  return (
    <Menu className="app-menu">
      <ListView
        row
        className="menu-items slide-in-right"
        data={routes}
        itemText={({ path, text }: any) => (
          <StyledLink to={path}>{text}</StyledLink>
        )}
      />

      <ButtonLink
        size="sm"
        className={authClass}
        href={authUrl}
        onClick={onAuth}
        title={authTitle}
      >
        <MatIcon icon="account_circle" />
        {authText}
      </ButtonLink>
    </Menu>
  );
};

export default AppNav;
