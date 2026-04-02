import { Button } from "@common/external/ui/button.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { useInvitation } from "./useInvitation.ts";
import "./invitation.scss";

const INVITATION_HERO_ARTWORK_SRC = "/img/invitation-icon.png";
const INVITATION_BRAND_LOGO_SRC = "/img/accesspilot-logo.svg";
const INVITATION_ROLE_ICON_SRC = "/img/invitation-role-icon.svg";

export default function Invitation() {
  const { t } = useI18n();
  const {
    invitation,
    clientLabel,
    roleLabel,
    footerMessage,
    isLoading,
    isSubmitting,
    errorMessage,
    isValidInvitation,
    handleAcceptInvitation
  } = useInvitation();

  return (
    <main className="invitation">
      <section className="invitation__card" aria-labelledby="invitation-title">
        <div className="invitation__body">
          <div className="invitation__brand">
            <img
              className="invitation__brand-logo"
              src={INVITATION_BRAND_LOGO_SRC}
              alt="AccessPilot"
            />
          </div>

          <div className="invitation__hero" aria-hidden="true">
            <img className="invitation__hero-artwork" src={INVITATION_HERO_ARTWORK_SRC} alt="" />
          </div>

          <div className="invitation__content">
            <h1 id="invitation-title" className="invitation__title">
              {t("Você foi convidado para o AccessPilot")}
            </h1>
            <p className="invitation__description">
              {isLoading
                ? t("Estamos validando seu convite para carregar as informações de acesso.")
                : t("Aceite o convite para começar a gerenciar seus sistemas e solicitações de acesso com segurança e agilidade.")}
            </p>
          </div>

          {errorMessage ? (
            <div className="invitation__message invitation__message--error" role="alert">
              <h2 className="invitation__message-title">{t("Convite indisponível")}</h2>
              <p className="invitation__message-description">{errorMessage}</p>
            </div>
          ) : (
            <dl className="invitation__details">
              <div className="invitation__detail-row">
                <dt className="invitation__detail-label">{t("Organização")}</dt>
                <dd className="invitation__detail-value">{clientLabel}</dd>
              </div>

              <div className="invitation__detail-row">
                <dt className="invitation__detail-label">{t("Papel atribuído")}</dt>
                <dd className="invitation__detail-value invitation__detail-value--with-icon">
                  <img className="invitation__detail-icon" src={INVITATION_ROLE_ICON_SRC} alt="" />
                  <span>{roleLabel}</span>
                </dd>
              </div>

              <div className="invitation__detail-row invitation__detail-row--last">
                <dt className="invitation__detail-label">{t("E-mail")}</dt>
                <dd className="invitation__detail-value">{invitation?.emailMasked ?? "-"}</dd>
              </div>
            </dl>
          )}

          {isValidInvitation && (
            <div className="invitation__actions">
              <Button
                type="button"
                className="invitation__primary-action"
                onClick={handleAcceptInvitation}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? t("Redirecionando...") : t("Aceitar Convite")}
              </Button>
              <p className="invitation__actions-hint">
                {t("Ao continuar, você será direcionado para a autenticação adequada ao seu convite.")}
              </p>
            </div>
          )}
        </div>

        <footer className="invitation__footer">{footerMessage}</footer>
      </section>
    </main>
  );
}
