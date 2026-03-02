import { useState } from "react";
import { cn } from "../../../../config/lib/utils.ts";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "../../../hooks/useSidebar.tsx";
import { navItems, supportNavItems } from "./constant/sidebar.constant.ts";
import { DashboardNav } from "./partials/DashboardNav.tsx";

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
        className
      )}>
      <ChevronLeft
        onClick={handleToggle}
      />

      <div>
        <DashboardNav items={navItems} />
      </div>

      <div>
        <DashboardNav items={supportNavItems}></DashboardNav>
      </div>
    </nav>
  );
}
