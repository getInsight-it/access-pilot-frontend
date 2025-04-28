import { Link, useLocation } from "react-router-dom";
import { Icons } from "../components/icons";
import { cn } from "../config/lib/utils";
import { NavItem } from "../common/types";
import { Dispatch, SetStateAction } from "react";
import { useSidebar } from "../common/hooks/useSidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useTheme } from "./layout/ThemeToggle/theme-provider";
import { ApproverComponentGuard } from "../common/context/auth/approver-guard.tsx";

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

  if(!items?.length) {
    return null;
  }

  const { theme } = useTheme();

  return (
    <nav className="grid items-start gap-0">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];

          // cria o conteúdo interno do Tooltip/Link
          const content = (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={item.disabled ? "/" : item.href!}
                  className={cn(
                    "flex items-center gap-2 overflow-hidden py-4 text-sm text-[var(--dashboard-nav-text)] font-medium hover:bg-[var(--dashboard-nav-bg)]",
                    path === item.href ? "bg-[var(--dashboard-nav-bg)]" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80",
                    isMinimized && "px-3"
                  )}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <Icon
                    className={cn(
                      isMinimized ? "ml-3" : "ml-5",
                      "size-5 text-[var(--dashboard-nav-text)]"
                    )}
                  />
                  {theme === "gov" && (
                    <hr className="absolute left-0 mt-[52px] h-[1px] w-full bg-gray-100" />
                  )}
                  {(isMobileNav || (!isMinimized && !isMobileNav)) && (
                    <span className="mr-2 truncate">{item.title}</span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? "hidden" : "inline-block"}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          );

          return item.href ? (
            item.protected
              ? (<ApproverComponentGuard key={index}>{content}</ApproverComponentGuard>)
              : content
          ) : null;
        })}
      </TooltipProvider>

      {theme === "gov" && (isMobileNav || (!isMinimized && !isMobileNav)) && (
        <div className="absolute bottom-0 p-4 pointer-events-none truncate">
          <p className="text-xs font-regular">Powered by:</p>
          <img className="w-36" src="/img/accesspilot-logo.svg" />
        </div>
      )}
    </nav>
  );
}
