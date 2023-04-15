import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Paths } from "routes/index";
import { useGlobalUser } from "hooks/GlobalUser";
import { API_BASE } from "utils/constants";
import ListView from "components/Common/ListView";
import { MatIcon } from "components/Common/Containers";
import { ButtonLink, RoundButton, StyledLink } from "components/Forms/Button";
import ThemeSelector from "./ThemeSelector";

const Menu = styled.nav`
  align-items: center;
  display: grid;
  color: white;
  grid-template-columns: repeat(3, max-content);

  ${ListView} li {
    padding: 0;
  }
  ${StyledLink}, .material-icons {
    color: white;
  }
`;
const API = API_BASE;
const LOGOUT_URL = `${API}/logout/google?`;
const LOGIN_URL = `${API}/login/google?`;

const AppAuth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { email } = useGlobalUser(["email"]);
  const [authUrl, authTitle, authClass] = useMemo(() => {
    const url = email ? LOGOUT_URL : LOGIN_URL;
    return email
      ? [url, `Log out ${email}`, undefined]
      : [url, "Log in", "error"];
  }, [email]);
  // Set authenticating state for reload
  const onAuth = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const authenticating = Number(!email);
    localStorage.setItem("authenticating", String(authenticating));
    window.open(authUrl, "_self");
  };

  // Write path to localStorage for login/logout
  // This allows a user to maintain context when they login via Google
  useEffect(() => {
    const current = pathname === "/login" ? "/dashboard" : pathname;
    const lastViewed = localStorage.getItem("nextPath") || current;
    const authenticating = localStorage.getItem("authenticating") === "1";

    if (email && authenticating) {
      localStorage.removeItem("nextPath");
      localStorage.removeItem("authenticating");
      navigate(lastViewed, { replace: true });
    } else if (!authenticating) localStorage.setItem("nextPath", current);
  }, [pathname, email]);

  return (
    <>
      {/* Login/Logout Link */}
      <RoundButton
        type="button"
        className={authClass}
        onClick={onAuth}
        title={authTitle}
      >
        <MatIcon icon={email ? "account_circle" : "login"} />
      </RoundButton>
    </>
  );
};

export default AppAuth;
