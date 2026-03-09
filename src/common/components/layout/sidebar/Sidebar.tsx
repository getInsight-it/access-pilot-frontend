import { cn } from "../../../../config/lib/utils.ts";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "../../../hooks/useSidebar.tsx";
import { administrationNavItems, primaryNavItems, supportNavItems } from "./constant/sidebar.constant.ts";
import { DashboardNav } from "./dashboard-nav/DashboardNav.tsx";
import "./Sidebar.scss";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  return (
    <nav
      className={cn(
        "dashboard-sidebar",
        isMinimized && "dashboard-sidebar--collapsed",
        className
      )}>
      <div className="dashboard-sidebar__content">
        <div className="dashboard-sidebar__nav-items">
          <div className="dashboard-sidebar__group">
            <DashboardNav items={primaryNavItems} />
          </div>
          {administrationNavItems.length > 0 && (
            <div className="dashboard-sidebar__group">
              <p className="dashboard-sidebar__section-title">Administração</p>
              <DashboardNav items={administrationNavItems} />
            </div>
          )}
          {supportNavItems.length > 0 && (
            <div className="dashboard-sidebar__group">
              <DashboardNav items={supportNavItems} />
            </div>
          )}
        </div>
      </div>

      <footer className="dashboard-sidebar__footer">
        <button
          type="button"
          className="dashboard-sidebar__toggle-button"
          onClick={toggle}
          aria-label={isMinimized ? "Expandir menu" : "Recolher menu"}>
          <ChevronLeft
            className={cn(
              "dashboard-sidebar__toggle-icon",
              isMinimized && "dashboard-sidebar__toggle-icon--collapsed"
            )}
          />
          {!isMinimized && (
            <span className="dashboard-sidebar__toggle-label">
              Recolher menu
            </span>
          )}
        </button>
      </footer>
    </nav>
  );
}
