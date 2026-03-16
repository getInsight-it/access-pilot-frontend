import { Button } from "@common/external/ui/button.tsx";
import { useInvitation } from "./useInvitation.ts";
import "./invitation.scss";

const INVITATION_HERO_IMAGE_SRC = "/img/invitation-hero.png";
const INVITATION_BRAND_ICON_SRC = "/img/invitation-brand-icon.svg";
const INVITATION_ROLE_ICON_SRC = "/img/invitation-role-icon.svg";

export default function Invitation() {
  const {
    invitation,
    clientLabel,
    roleLabel,
    footerMessage,
    isLoading,
    isSubmitting,
    errorMessage,
    isValidInvitation,
    handleAcceptInvitation,
    handleDeclineInvitation
  } = useInvitation();

  return (
    <main className="invitation">
      <section className="invitation__card" aria-labelledby="invitation-title">
        <div className="invitation__body">
          <div className="invitation__brand">
            <span className="invitation__brand-icon-box" aria-hidden="true">
              <img className="invitation__brand-icon" src={INVITATION_BRAND_ICON_SRC} alt="" />
            </span>
            <span className="invitation__brand-title">AccessPilot</span>
          </div>

          <div className="invitation__hero" aria-hidden="true">
            <img className="invitation__hero-image" src={INVITATION_HERO_IMAGE_SRC} alt="" />
          </div>

          <div className="invitation__content">
            <h1 id="invitation-title" className="invitation__title">
              Você foi convidado para o AccessPilot
            </h1>
            <p className="invitation__description">
              {isLoading
                ? "Estamos validando seu convite para carregar as informações de acesso."
                : "Aceite o convite para começar a gerenciar seus sistemas e solicitações de acesso com segurança e agilidade."}
            </p>
          </div>

          {errorMessage ? (
            <div className="invitation__message invitation__message--error" role="alert">
              <h2 className="invitation__message-title">Convite indisponível</h2>
              <p className="invitation__message-description">{errorMessage}</p>
            </div>
          ) : (
            <dl className="invitation__details">
              <div className="invitation__detail-row">
                <dt className="invitation__detail-label">Organização</dt>
                <dd className="invitation__detail-value">{clientLabel}</dd>
              </div>

              <div className="invitation__detail-row">
                <dt className="invitation__detail-label">Papel atribuído</dt>
                <dd className="invitation__detail-value invitation__detail-value--with-icon">
                  <img className="invitation__detail-icon" src={INVITATION_ROLE_ICON_SRC} alt="" />
                  <span>{roleLabel}</span>
                </dd>
              </div>

              <div className="invitation__detail-row invitation__detail-row--last">
                <dt className="invitation__detail-label">E-mail</dt>
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
                {isSubmitting ? "Redirecionando..." : "Aceitar Convite"}
              </Button>
              <button
                type="button"
                className="invitation__secondary-action"
                onClick={handleDeclineInvitation}
              >
                Recusar convite
              </button>
              <p className="invitation__actions-hint">
                Ao continuar, você será direcionado para a autenticação adequada ao seu convite.
              </p>
            </div>
          )}
        </div>

        <footer className="invitation__footer">{footerMessage}</footer>
      </section>
    </main>
  );
}
