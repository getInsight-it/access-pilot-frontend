import ThemeToggle from "../../components/layout/ThemeToggle/theme-toggle";
import { cn } from "../../config/lib/utils";
import { MobileSidebar } from "../navigation/mobile-sidebar.tsx";
import { UserNav } from "./user-nav";
import ThemedLogo from "./ThemedLogo";
import { Link } from "react-router-dom";
import Notifications from "../notifications/Notifications";

export default function Header() {
  return (
    <div
      className="supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <div className="hidden md:block">
          <Link to={"#"}>
            <ThemedLogo />
          </Link>
        </div>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Notifications />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
