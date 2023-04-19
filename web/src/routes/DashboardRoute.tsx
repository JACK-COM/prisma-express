import { Routes, Route } from "react-router-dom";
import { Paths, trimParent } from "routes";
import Home from "./Home";
import UserSettings from "./UserSettings";

const { Dashboard } = Paths;

/** Concerns for all books and series (purchased or user-created) */
const DashboardRoute = () => {
  return (
    <Routes>
      {/* Dashboard/App Home */}
      <Route index element={<Home />} />

      <Route
        // Dashboard/App Home
        path={trimParent(Dashboard.Index.path, "dashboard")}
        element={<Home />}
      />

      <Route
        // User Settings
        path={trimParent(Dashboard.Settings.path, "dashboard")}
        element={<UserSettings />}
      />
    </Routes>
  );
};

export default DashboardRoute;
