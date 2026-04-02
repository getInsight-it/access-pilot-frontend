import { cn } from "../../../../config/lib/utils.ts";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "../../../hooks/useSidebar.tsx";
import {
  administrationNavItems,
  inviteNavItems,
  primaryNavItems,
  requestNavItems,
  supportNavItems
} from "./constant/sidebar.constant.ts";
import { DashboardNav } from "./dashboard-nav/DashboardNav.tsx";
import { useI18n } from "../../../context/i18n/I18nContext.tsx";
import "./Sidebar.scss";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const { t } = useI18n();

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
          {requestNavItems.length > 0 && (
            <div className="dashboard-sidebar__group">
              <p className="dashboard-sidebar__section-title">{t("Solicitações")}</p>
              <DashboardNav items={requestNavItems} />
            </div>
          )}
          {inviteNavItems.length > 0 && (
            <div className="dashboard-sidebar__group">
              <p className="dashboard-sidebar__section-title">{t("Convites")}</p>
              <DashboardNav items={inviteNavItems} />
            </div>
          )}
          {administrationNavItems.length > 0 && (
            <div className="dashboard-sidebar__group">
              <p className="dashboard-sidebar__section-title">{t("Administração")}</p>
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
          aria-label={isMinimized ? t("Expandir menu") : t("Recolher menu")}>
          <ChevronLeft
            className={cn(
              "dashboard-sidebar__toggle-icon",
              isMinimized && "dashboard-sidebar__toggle-icon--collapsed"
            )}
          />
          {!isMinimized && (
            <span className="dashboard-sidebar__toggle-label">
              {t("Recolher menu")}
            </span>
          )}
        </button>
      </footer>
    </nav>
  );
}
