import { cn } from "../../../../config/lib/utils.ts";
import { Link } from "react-router-dom";
import { UserNav } from "./partials/UserNav.tsx";
import { MobileSidebar } from "../sidebar/MobileSidebar.tsx";
import { PRIVATE_ROUTES } from "../../../constants/routes.ts";

import ThemeToggle from "../../../../theme/theme-toggle.tsx";
import ThemedLogo from "./partials/ThemedLogo.tsx";
import Notifications from "./partials/Notifications.tsx";

export default function Header() {
  return (
    <div>
      <nav>
        <div>
          <Link to={PRIVATE_ROUTES.DASHBOARD}>
            <ThemedLogo />
          </Link>
        </div>
        <div>
          <MobileSidebar />
        </div>

        <div>
          <ThemeToggle />
          <Notifications />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
