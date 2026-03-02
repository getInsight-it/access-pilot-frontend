import { Link, useLocation } from "react-router-dom";
import { Icons } from "./Icons.tsx";
import { NavItem } from "../../../../types";
import { Dispatch, SetStateAction } from "react";
import { useSidebar } from "../../../../hooks/useSidebar.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../external/ui/tooltip.tsx";
import { useTheme } from "../../../../../theme/theme-provider.tsx";
import { RoleComponentGuard } from "../../../../context/auth/RoleGuard.tsx";

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
  const location = useLocation();
  const path = location.pathname;
  const { isMinimized } = useSidebar();
  const { theme } = useTheme();

  if(!items?.length) {
    return null;
  }

  const isActiveItem = (itemHref: string) => {
    return path.includes(itemHref) && itemHref !== "/";
  };

  return (
    <nav>
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon as keyof typeof Icons || "arrowRight"];
          const isActive = isActiveItem(item.href!);

          const content = (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={item.disabled ? "/" : item.href!}
                  onClick={() => {
                    if(setOpen) setOpen(false);
                  }}>
                  <Icon />
                  {theme === "gov" && (
                    <hr />
                  )}
                  {(isMobileNav || (!isMinimized && !isMobileNav)) && (
                    <span>
                      {item.title}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}>
                {item.title}
              </TooltipContent>
            </Tooltip>
          );

          return item.href ? (
            item.protected
              ? (<RoleComponentGuard roles={item.roles || undefined} key={index}>{content}</RoleComponentGuard>)
              : content
          ) : null;
        })}
      </TooltipProvider>

      {/* {theme === "gov" && (isMobileNav || (!isMinimized && !isMobileNav)) && (
        <div>
          <p>Powered by:</p>
          <img src="/img/accesspilot-logo.svg" />
        </div>
      )} */}
    </nav>
  );
}
