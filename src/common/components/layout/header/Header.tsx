import { cn } from "../../../../config/lib/utils.ts";
import { Link } from "react-router-dom";
import { UserNav } from "./partials/UserNav.tsx";
import { MobileSidebar } from "../sidebar/MobileSidebar.tsx";

import ThemeToggle from "../../../../theme/theme-toggle.tsx";
import ThemedLogo from "./partials/ThemedLogo.tsx";
import Notifications from "./partials/Notifications.tsx";

export default function Header() {
  return (
    <div
      className="supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-2 sm:px-4">
        <div className="hidden md:block flex-shrink-0">
          <Link to={"#"}>
            <ThemedLogo />
          </Link>
        </div>
        <div className={cn("block md:!hidden flex-shrink-0")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          <ThemeToggle />
          <Notifications />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
