import { useState } from "react";
import { DashboardNav } from "../dashboard-nav.tsx";
import { cn } from "../../config/lib/utils.ts";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "../../common/hooks/useSidebar.tsx";
import { navItems, supportNavItems } from "./sidebar.constant.ts";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative hidden flex-none border-r z-10 none pt-6 pb-6 flex flex-col justify-between`,
        status && "duration-300",
        !isMinimized ? "w-[296px]" : "!w-[72px]",
        className
      )}>
      <ChevronLeft
        className={cn(
          "absolute -right-3 bottom-20 cursor-pointer rounded-full border border-gray-100 bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />

      <div className={cn(
        "transition-all duration-700 ease-in-out",
        !isMinimized ? "mx-6" : "mx-auto"
      )}>
        <DashboardNav items={navItems} />
      </div>

      <div className={cn(
        "transition-all duration-700 ease-in-out",
        !isMinimized ? "mx-4" : "mx-auto"
      )}>
        <DashboardNav items={supportNavItems}></DashboardNav>
      </div>
    </nav>
  );
}
