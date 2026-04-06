import { Link, useLocation } from "react-router-dom";
import { Icons } from "../partials/Icons.tsx";
import { NavItem } from "../../../../types";
import { Dispatch, SetStateAction } from "react";
import { useSidebar } from "../../../../hooks/useSidebar.tsx";
import { RoleComponentGuard } from "../../../../context/auth/RoleGuard.tsx";
import { useI18n } from "../../../../context/i18n/I18nContext.tsx";
import { cn } from "../../../../../config/lib/utils.ts";
import "./DashboardNav.scss";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const { t } = useI18n();
  const location = useLocation();
  const path = location.pathname;
  const { isMinimized } = useSidebar();
  const isCollapsedDesktop = isMinimized && !isMobileNav;

  if(!items?.length) {
    return null;
  }

  const isActiveItem = (itemHref: string) => {
    return path.includes(itemHref) && itemHref !== "/";
  };

  return (
    <nav
      className={cn(
        "dashboard-nav",
        isCollapsedDesktop && "dashboard-nav--collapsed"
      )}>
      {items.map((item, index) => {
        const Icon = Icons[item.icon as keyof typeof Icons || "arrowRight"];
        const isActive = isActiveItem(item.href!);
        const itemKey = `${item.href}-${index}`;

        const content = (
          <Link
            className={cn(
              "dashboard-nav__link",
              isActive && "dashboard-nav__link--active"
            )}
            to={item.disabled ? "/" : item.href!}
            onClick={() => {
              if(setOpen) setOpen(false);
            }}>
            <Icon className="dashboard-nav__icon" />
            {(isMobileNav || !isCollapsedDesktop) && (
              <span className="dashboard-nav__label">
                {t(item.title)}
              </span>
            )}
            {isCollapsedDesktop && (
              <span className="dashboard-nav__hover-label">
                {t(item.title)}
              </span>
            )}
          </Link>
        );

        return item.href ? (
          <div className="dashboard-nav__item" key={itemKey}>
            {item.protected
              ? <RoleComponentGuard roles={item.roles || undefined}>{content}</RoleComponentGuard>
              : content}
          </div>
        ) : null;
      })}

      {/* {theme === "gov" && (isMobileNav || (!isMinimized && !isMobileNav)) && (
        <div>
          <p>Powered by:</p>
          <img src="/img/accesspilot-logo.svg" />
        </div>
      )} */}
    </nav>
  );
}
