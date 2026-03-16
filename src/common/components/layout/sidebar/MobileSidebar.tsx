import { Sheet, SheetContent, SheetTrigger } from "../../../external/ui/sheet.tsx";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import {
  administrationNavItems,
  inviteNavItems,
  primaryNavItems,
  requestNavItems,
  supportNavItems
} from "./constant/sidebar.constant.ts";
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
                <DashboardNav items={primaryNavItems} isMobileNav={true} setOpen={setOpen} />
                {requestNavItems.length > 0 && (
                  <DashboardNav items={requestNavItems} isMobileNav={true} setOpen={setOpen} />
                )}
                {inviteNavItems.length > 0 && (
                  <DashboardNav items={inviteNavItems} isMobileNav={true} setOpen={setOpen} />
                )}
                {administrationNavItems.length > 0 && (
                  <DashboardNav items={administrationNavItems} isMobileNav={true} setOpen={setOpen} />
                )}
                {supportNavItems.length > 0 && (
                  <DashboardNav items={supportNavItems} isMobileNav={true} setOpen={setOpen} />
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
