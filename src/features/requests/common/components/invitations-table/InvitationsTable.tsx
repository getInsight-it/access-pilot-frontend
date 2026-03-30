import { useMemo } from "react";
import { Ban, CheckCheck, Mail, Search } from "lucide-react";

import { TablePagination } from "@components/table-pagination/TablePagination.tsx";
import { Button } from "@ui/button.tsx";
import { InvitationListItemInterface } from "../../types/invitation.model.ts";
import "./invitations-table.scss";

interface InvitationsTableProps {
  invitations: InvitationListItemInterface[];
  currentPage: number;
  totalPages: number;
  totalInvitations: number;
  searchFilter: string;
  formatDate: (date: string) => string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  actionLabel: string;
  actionVariant?: "white" | "default";
  emptyStateLabel: string;
  onAction: (invitation: InvitationListItemInterface) => void;
}

export function InvitationsTable({
  invitations,
  currentPage,
  totalPages,
  totalInvitations,
  searchFilter,
  formatDate,
  onSearchChange,
  onPageChange,
  actionLabel,
  actionVariant = "default",
  emptyStateLabel,
  onAction
}: InvitationsTableProps) {
  const startItem = totalInvitations > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = totalInvitations > 0 ? Math.min(currentPage * 10, totalInvitations) : 0;

  const emptyIcon = useMemo(() => {
    return actionLabel === "Aceitar convite" ? <Mail size={24} /> : <Ban size={24} />;
  }, [actionLabel]);

  const actionIcon = actionLabel === "Aceitar convite"
    ? <CheckCheck size={16} />
    : <Ban size={16} />;

  return (
    <div className="invitations-table">
      <div className="invitations-table__mobile">
        {invitations.length > 0 ? (
          <>
            <div className="invitations-table__cards">
              {invitations.map((invitation) => (
                <div className="invitations-table__card" key={invitation.id}>
                  <div className="invitations-table__card-header">
                    <span className="invitations-table__card-title">{invitation.protocolCode}</span>
                    <Button
                      type="button"
                      variant={actionVariant === "white" ? "white" : undefined}
                      className="invitations-table__actions-button"
                      onClick={() => onAction(invitation)}
                    >
                      {actionIcon}
                      <span>{actionLabel}</span>
                    </Button>
                  </div>
                  <div className="invitations-table__card-content">
                    <div className="invitations-table__card-row">
                      <span className="invitations-table__card-label">Sistema</span>
                      <span className="invitations-table__card-value">{invitation.clientLabel}</span>
                    </div>
                    <div className="invitations-table__card-row">
                      <span className="invitations-table__card-label">Client ID</span>
                      <span className="invitations-table__card-value">{invitation.clientId}</span>
                    </div>
                    <div className="invitations-table__card-row">
                      <span className="invitations-table__card-label">Papel</span>
                      <span className="invitations-table__card-value">{invitation.roleLabel}</span>
                    </div>
                    <div className="invitations-table__card-row">
                      <span className="invitations-table__card-label">Expiração</span>
                      <span className="invitations-table__card-value">{formatDate(invitation.expiresAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="invitations-table__mobile-pagination">
              <TablePagination
                className="invitations-table__pagination"
                align="end"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : (
          <div className="invitations-table__empty-state">
            <div>{emptyIcon}</div>
            <span>{emptyStateLabel}</span>
          </div>
        )}
      </div>

      <div className="invitations-table__desktop">
        <div className="app-table invitations-table__table">
          <div className="app-table__filter">
            <div className="invitations-table__filter-content">
              <div className="app-input-group app-input-group--icon-left invitations-table__filter-input">
                <Search className="app-input-group__icon" />
                <input
                  className="app-input"
                  placeholder="Buscar convite..."
                  value={searchFilter}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="app-table__header">
            <div className="app-table__row">
              <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--client">
                <span>Sistema</span>
              </div>
              <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--client-id">
                <span>Client ID</span>
              </div>
              <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--role">
                <span>Papel</span>
              </div>
              <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--expiration-date">
                <span>Expiração</span>
              </div>
              <div className="app-table__cell invitations-table__table-cell invitations-table__table-cell--actions">
                <span>Ações</span>
              </div>
            </div>
          </div>

          <div className="app-table__body">
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <div key={invitation.id} className="app-table__row">
                  <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--client">
                    <span>{invitation.clientLabel}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--client-id">
                    <span>{invitation.clientId}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--role">
                    <span>{invitation.roleLabel}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content invitations-table__table-cell invitations-table__table-cell--expiration-date">
                    <span>{formatDate(invitation.expiresAt)}</span>
                  </div>
                  <div className="app-table__cell invitations-table__table-cell invitations-table__table-cell--actions">
                    <Button
                      type="button"
                      variant={actionVariant === "white" ? "white" : undefined}
                      className="invitations-table__actions-button"
                      onClick={() => onAction(invitation)}
                    >
                      {actionIcon}
                      <span>{actionLabel}</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="app-table__row">
                <div className="app-table__cell invitations-table__empty-state">
                  <div>{emptyIcon}</div>
                  <span>{emptyStateLabel}</span>
                </div>
              </div>
            )}
          </div>

          <div className="app-table__footer">
            <div className="invitations-table__footer">
              <div className="invitations-table__footer-info">
                {startItem}-{endItem} de {totalInvitations} itens
              </div>
              <div className="invitations-table__footer-pagination">
                <TablePagination
                  className="invitations-table__pagination"
                  align="end"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
