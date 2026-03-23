import React from "react";
import { Mail, Plus, X } from "lucide-react";
import "./request-invite-emails-step.scss";

interface RequestInviteEmailsStepProps {
  emails: string[];
  emailDraft: string;
  errorMessage?: string | null;
  onDraftChange: (draft: string) => void;
  onAddDraftEmails: () => void;
  onRemoveEmail: (email: string) => void;
}

export const RequestInviteEmailsStep: React.FC<RequestInviteEmailsStepProps> = ({
  emails,
  emailDraft,
  errorMessage,
  onDraftChange,
  onAddDraftEmails,
  onRemoveEmail
}) => {
  return (
    <div className="request-invite-emails-step">
      <div className="request-invite-emails-step__intro">
        <div className="request-invite-emails-step__icon-box">
          <Mail className="request-invite-emails-step__icon" />
        </div>

        <div className="request-invite-emails-step__intro-content">
          <h4 className="request-invite-emails-step__title">Destinatários do convite</h4>
          <p className="request-invite-emails-step__description">
            Adicione um ou mais e-mails. Você pode separar vários destinatários por vírgula, espaço ou quebra de linha. Cada endereço receberá um convite individual.
          </p>
        </div>
      </div>

      <div className="request-invite-emails-step__field">
        <label className="request-invite-emails-step__label" htmlFor="invite-emails">
          E-mails dos convidados <span className="request-invite-emails-step__required">*</span>
        </label>

        <div className="request-invite-emails-step__composer">
          <textarea
            id="invite-emails"
            className={`app-textarea request-invite-emails-step__textarea${errorMessage ? " request-invite-emails-step__textarea--error" : ""}`}
            placeholder="nome@empresa.com, outra.pessoa@empresa.com"
            value={emailDraft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onAddDraftEmails();
              }
            }}
          />

          <button
            type="button"
            className="request-invite-emails-step__add-button"
            onClick={onAddDraftEmails}
          >
            <Plus className="request-invite-emails-step__add-icon" />
            <span>Adicionar</span>
          </button>
        </div>

        {errorMessage && (
          <p className="request-invite-emails-step__error">{errorMessage}</p>
        )}
      </div>

      <div className="request-invite-emails-step__summary">
        <div className="request-invite-emails-step__summary-header">
          <h4 className="request-invite-emails-step__summary-title">Lista de destinatários</h4>
          <span className="app-badge request-invite-emails-step__badge">{emails.length}</span>
        </div>

        <p className="request-invite-emails-step__description">
          Cada destinatário listado abaixo receberá um convite separado.
        </p>

        {emails.length > 0 ? (
          <div className="request-invite-emails-step__chips">
            {emails.map((email) => (
              <div key={email} className="request-invite-emails-step__chip">
                <div className="request-invite-emails-step__chip-main">
                  <div className="request-invite-emails-step__chip-icon-box">
                    <Mail className="request-invite-emails-step__chip-icon" />
                  </div>
                  <span className="request-invite-emails-step__chip-label">{email}</span>
                </div>
                <button
                  type="button"
                  className="request-invite-emails-step__chip-action"
                  onClick={() => onRemoveEmail(email)}
                  aria-label={`Remover ${email}`}
                >
                  <X className="request-invite-emails-step__chip-icon" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="request-invite-emails-step__empty-state">
            <p className="request-invite-emails-step__empty-text">
              Nenhum destinatário adicionado até agora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
