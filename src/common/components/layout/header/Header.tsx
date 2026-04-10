import { Link } from "react-router-dom";
import { MobileSidebar } from "../sidebar/mobile-sidebar/MobileSidebar.tsx";
import { PRIVATE_ROUTES } from "../../../constants/routes.ts";
import ThemeToggle from "../../../../theme/theme-toggle.tsx";
import ThemedLogo from "./partials/themed-logo/ThemedLogo.tsx";
import Notifications from "./partials/notifications/Notifications.tsx";
import { UserNav } from "./partials/user-nav/UserNav.tsx";
import LanguageToggle from "./partials/language-toggle/LanguageToggle.tsx";
import "./Header.scss";

export default function Header() {
  return (
    <header className="dashboard-header">
      <nav className="dashboard-header__nav">
        <div className="dashboard-header__left">
          <div className="dashboard-header__mobile-toggle">
            <MobileSidebar />
          </div>
          <Link className="dashboard-header__brand-link" to={PRIVATE_ROUTES.DASHBOARD}>
            <ThemedLogo />
          </Link>
        </div>

        <div className="dashboard-header__right">
          <LanguageToggle />
          <ThemeToggle />
          <Notifications />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
