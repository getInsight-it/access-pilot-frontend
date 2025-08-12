import { Link, useLocation } from "react-router-dom";
import { Icons } from "./Icons.tsx";
import { cn } from "../../../../../config/lib/utils.ts";
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
    <nav className="grid items-start gap-1">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon as keyof typeof Icons || "arrowRight"];
          const isActive = isActiveItem(item.href!);

          const content = (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={item.disabled ? "/" : item.href!}
                  className={cn(
                    "flex items-center gap-2 overflow-hidden h-11 group",

                    "rounded-md",
                    "text-base font-semibold",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-primary-100 hover:text-primary-800 dark:hover:bg-primary-900/20 dark:hover:text-primary-800",
                    "transition-colors duration-200",
                    isActive ?
                      "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-800" :
                      "transparent",
                    item.disabled && "cursor-not-allowed opacity-80",
                    isMinimized && "px-3 justify-start"
                  )}
                  onClick={() => {
                    if(setOpen) setOpen(false);
                  }}>
                  <Icon
                    className={cn(
                      isMinimized ? "ml-0" : "ml-4",
                      "size-5",
                      "text-gray-500 dark:text-gray-100",
                      "group-hover:text-primary-800",
                      isActive && "text-primary-800 dark:text-primary-800"
                    )}
                  />
                  {theme === "gov" && (
                    <hr className="absolute left-0 mt-[52px] h-[1px] w-full bg-gray-100 dark:bg-gray-700" />
                  )}
                  {(isMobileNav || (!isMinimized && !isMobileNav)) && (
                    <span className="mr-2 truncate">
                      {item.title}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? "hidden" : "inline-block"}>
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

      {theme === "gov" && (isMobileNav || (!isMinimized && !isMobileNav)) && (
        <div className="absolute bottom-0 p-4 pointer-events-none truncate">
          <p className="text-xs font-regular text-gray-600 dark:text-gray-400">Powered by:</p>
          <img className="w-36" src="/img/accesspilot-logo.svg" />
        </div>
      )}
    </nav>
  );
}
