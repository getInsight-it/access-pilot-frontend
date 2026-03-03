import { Link } from "react-router-dom";
import { UserNav } from "./partials/UserNav.tsx";
import { MobileSidebar } from "../sidebar/MobileSidebar.tsx";
import { PRIVATE_ROUTES } from "../../../constants/routes.ts";

import ThemeToggle from "../../../../theme/theme-toggle.tsx";
import ThemedLogo from "./partials/ThemedLogo.tsx";
import Notifications from "./partials/Notifications.tsx";
import "./Header.scss";

export default function Header() {
  return (
    <header className="dashboard-header">
      <nav className="dashboard-header__nav">
        <div className="dashboard-header__brand">
          <Link to={PRIVATE_ROUTES.DASHBOARD}>
            <ThemedLogo />
          </Link>
        </div>
        <div className="dashboard-header__mobile-toggle">
          <MobileSidebar />
        </div>

        <div className="dashboard-header__actions">
          <ThemeToggle />
          <Notifications />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
