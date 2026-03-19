import React from "react";
import { ClipboardList, FileText, LaptopMinimal, Mail, ShieldUser } from "lucide-react";
import { FileIcon } from "@common/components/FileIcon.tsx";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import { FileAttachment } from "../../types/access-request.model.ts";
import "./request-review-step.scss";

interface RequestReviewStepProps {
  selectedClient: string | null;
  selectedRole: string | null;
  reason: string;
  roles: RoleResponseInterface[];
  attachments: FileAttachment[];
  emails?: string[];
}

export const RequestReviewStep: React.FC<RequestReviewStepProps> = ({
  selectedClient,
  selectedRole,
  reason,
  roles,
  attachments,
  emails = []
}) => {
  const selectedRoleName = roles.find((role) => role.id.toString() === selectedRole)?.label || "Não selecionado";
  const reasonValue = reason || "Não informado";
  const showEmailSection = emails.length > 0;
  const attachmentGroupCount = attachments.length;
  const totalAttachedFiles = attachments.reduce((total, attachment) => total + attachment.files.length, 0);
  const totalReviewedItems = showEmailSection ? 4 : 3;
  const uniqueEmailDomains = Array.from(new Set(emails.map((email) => email.split("@")[1]).filter(Boolean)));

  return (
    <div className="request-review-step">
      <div className="request-review-step__highlight">
        <div className="request-review-step__highlight-content">
          <p className="request-review-step__highlight-eyebrow">Conferência final</p>
          <h4 className="request-review-step__highlight-title">Revise os dados antes de enviar sua solicitação</h4>
          <p className="request-review-step__highlight-description">
            Depois do envio, a aprovação seguirá o fluxo do sistema selecionado.
          </p>
        </div>
        <div className="request-review-step__highlight-metrics">
          <article className="request-review-step__metric">
            <p className="request-review-step__metric-label">Itens revisados</p>
            <p className="request-review-step__metric-value">{totalReviewedItems}</p>
          </article>
          {showEmailSection ? (
            <>
              <article className="request-review-step__metric">
                <p className="request-review-step__metric-label">Destinatários</p>
                <p className="request-review-step__metric-value">{emails.length}</p>
              </article>
              <article className="request-review-step__metric">
                <p className="request-review-step__metric-label">Domínios</p>
                <p className="request-review-step__metric-value">{uniqueEmailDomains.length}</p>
              </article>
            </>
          ) : (
            <>
              <article className="request-review-step__metric">
                <p className="request-review-step__metric-label">Tipos de anexo</p>
                <p className="request-review-step__metric-value">{attachmentGroupCount}</p>
              </article>
              <article className="request-review-step__metric">
                <p className="request-review-step__metric-label">Arquivos anexados</p>
                <p className="request-review-step__metric-value">{totalAttachedFiles}</p>
              </article>
            </>
          )}
        </div>
      </div>

      <div className="request-review-step__summary">
        <h4 className="request-review-step__section-title">Resumo da solicitação</h4>

        <div className="request-review-step__summary-grid">
          <article className="request-review-step__summary-card">
            <div className="request-review-step__summary-icon-box">
              <LaptopMinimal className="request-review-step__summary-icon" />
            </div>
            <div className="request-review-step__summary-content">
              <p className="request-review-step__summary-label">Sistema</p>
              <p className="request-review-step__summary-value">{selectedClient || "Não selecionado"}</p>
            </div>
          </article>

          <article className="request-review-step__summary-card">
            <div className="request-review-step__summary-icon-box">
              <ShieldUser className="request-review-step__summary-icon" />
            </div>
            <div className="request-review-step__summary-content">
              <p className="request-review-step__summary-label">Papel</p>
              <p className="request-review-step__summary-value">{selectedRoleName}</p>
            </div>
          </article>

          <article className="request-review-step__summary-card request-review-step__summary-card--full">
            <div className="request-review-step__summary-icon-box">
              <ClipboardList className="request-review-step__summary-icon" />
            </div>
            <div className="request-review-step__summary-content">
              <p className="request-review-step__summary-label">Justificativa</p>
              <p className="request-review-step__summary-value">{reasonValue}</p>
            </div>
          </article>

          {showEmailSection && (
            <article className="request-review-step__summary-card request-review-step__summary-card--full">
              <div className="request-review-step__summary-icon-box">
                <Mail className="request-review-step__summary-icon" />
              </div>
              <div className="request-review-step__summary-content">
                <p className="request-review-step__summary-label">Destinatários</p>
                <div className="request-review-step__email-list">
                  {emails.map((email) => (
                    <div key={email} className="request-review-step__email-chip">
                      <div className="request-review-step__email-chip-main">
                        <div className="request-review-step__email-chip-icon-box">
                          <Mail className="request-review-step__email-chip-icon" />
                        </div>
                        <span className="request-review-step__email-chip-label">{email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>

      {!showEmailSection && (
        <div className="request-review-step__attachments">
          <h4 className="request-review-step__section-title">Anexos</h4>

          {attachments.length > 0 ? (
            <div className="request-review-step__attachments-grid">
              {attachments.map((attachment) => (
                <article key={attachment.key} className="request-review-step__attachment-card">
                  <div className="request-review-step__attachment-header">
                    <div className="request-review-step__attachment-icon-box">
                      <FileText className="request-review-step__attachment-icon" />
                    </div>
                    <div className="request-review-step__attachment-heading">
                      <p className="request-review-step__attachment-title">{attachment.fileName}</p>
                      <p className="request-review-step__attachment-meta">
                        {attachment.files.length} arquivo(s)
                      </p>
                    </div>
                  </div>

                  <div className="request-review-step__file-list">
                    {attachment.files.map((file, index) => (
                      <div key={`${attachment.key}-${index}`} className="request-review-step__file-item">
                        <div className="request-review-step__file-main">
                          <FileIcon fileName={file.name} />
                          <p className="request-review-step__file-name">{file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="request-review-step__empty-state">
              <div className="request-review-step__empty-icon-box">
                <FileText className="request-review-step__empty-icon" />
              </div>
              <p className="request-review-step__empty-text">Nenhum anexo informado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
