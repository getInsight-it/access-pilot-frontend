import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import { Button } from "../../../../external/ui/button.tsx";
import {
  administrationNavItems,
  inviteNavItems,
  primaryNavItems,
  requestNavItems,
  supportNavItems
} from "../constant/sidebar.constant.ts";
import { DashboardNav } from "../dashboard-nav/DashboardNav.tsx";
import "./mobile-sidebar.scss";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`mobile-sidebar${open ? " mobile-sidebar--open" : ""}`}>
      <Button
        type="button"
        variant="white"
        size="icon"
        className="mobile-sidebar__trigger"
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="mobile-sidebar__trigger-icon" />
      </Button>

      <button
        type="button"
        className="mobile-sidebar__overlay"
        aria-label="Fechar menu"
        onClick={() => setOpen(false)}
      />

      <aside className="mobile-sidebar__drawer" aria-hidden={!open}>
        <div className="mobile-sidebar__header">
          <p className="mobile-sidebar__title">Menu</p>
          <button
            type="button"
            className="mobile-sidebar__close"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          >
            <X className="mobile-sidebar__close-icon" />
          </button>
        </div>

        <div className="mobile-sidebar__content">
          <div className="mobile-sidebar__group">
            <DashboardNav items={primaryNavItems} isMobileNav={true} setOpen={setOpen} />
          </div>

          {requestNavItems.length > 0 && (
            <div className="mobile-sidebar__group">
              <p className="mobile-sidebar__section-title">Solicitações</p>
              <DashboardNav items={requestNavItems} isMobileNav={true} setOpen={setOpen} />
            </div>
          )}

          {inviteNavItems.length > 0 && (
            <div className="mobile-sidebar__group">
              <p className="mobile-sidebar__section-title">Convites</p>
              <DashboardNav items={inviteNavItems} isMobileNav={true} setOpen={setOpen} />
            </div>
          )}

          {administrationNavItems.length > 0 && (
            <div className="mobile-sidebar__group">
              <p className="mobile-sidebar__section-title">Administração</p>
              <DashboardNav items={administrationNavItems} isMobileNav={true} setOpen={setOpen} />
            </div>
          )}

          {supportNavItems.length > 0 && (
            <div className="mobile-sidebar__group">
              <DashboardNav items={supportNavItems} isMobileNav={true} setOpen={setOpen} />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
