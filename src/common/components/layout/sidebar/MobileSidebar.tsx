import { Sheet, SheetContent, SheetTrigger } from "../../../external/ui/sheet.tsx";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { navItems } from "./constant/sidebar.constant.ts";
import { DashboardNav } from "./partials/DashboardNav.tsx";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors" aria-label="Open menu">
            <MenuIcon className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="!px-0 w-[280px] sm:w-[320px]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Menu
              </h2>
              <div className="space-y-1">
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
