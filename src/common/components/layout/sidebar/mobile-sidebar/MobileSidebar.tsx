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
import { useI18n } from "../../../../context/i18n/I18nContext.tsx";
import "./mobile-sidebar.scss";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

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
        aria-label={t("Abrir menu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="mobile-sidebar__trigger-icon" />
      </Button>

      <button
        type="button"
        className="mobile-sidebar__overlay"
        aria-label={t("Fechar menu")}
        onClick={() => setOpen(false)}
      />

      <aside className="mobile-sidebar__drawer" aria-hidden={!open}>
        <div className="mobile-sidebar__header">
          <p className="mobile-sidebar__title">{t("Menu")}</p>
          <button
            type="button"
            className="mobile-sidebar__close"
            aria-label={t("Fechar menu")}
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
              <p className="mobile-sidebar__section-title">{t("Solicitações")}</p>
              <DashboardNav items={requestNavItems} isMobileNav={true} setOpen={setOpen} />
            </div>
          )}

          {inviteNavItems.length > 0 && (
            <div className="mobile-sidebar__group">
              <p className="mobile-sidebar__section-title">{t("Convites")}</p>
              <DashboardNav items={inviteNavItems} isMobileNav={true} setOpen={setOpen} />
            </div>
          )}

          {administrationNavItems.length > 0 && (
            <div className="mobile-sidebar__group">
              <p className="mobile-sidebar__section-title">{t("Administração")}</p>
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
