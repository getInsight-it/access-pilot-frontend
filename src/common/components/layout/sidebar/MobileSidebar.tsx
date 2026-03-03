import { Sheet, SheetContent, SheetTrigger } from "../../../external/ui/sheet.tsx";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { navItems } from "./constant/sidebar.constant.ts";
import { DashboardNav } from "./dashboard-nav/DashboardNav.tsx";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button aria-label="Open menu">
            <MenuIcon />
          </button>
        </SheetTrigger>
        <SheetContent side="left">
          <div>
            <div>
              <h2>
                Menu
              </h2>
              <div>
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
