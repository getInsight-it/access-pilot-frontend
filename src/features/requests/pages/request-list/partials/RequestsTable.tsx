import { TablePagination } from "@components/table-pagination/TablePagination.tsx";
import { Button } from "@ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@ui/dropdown-menu.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { EllipsisVertical, ReceiptText, Search } from "lucide-react";
import { RequestStatusBadge } from "../../../common/components/RequestStatusBadge.tsx";
import { RequestInterface } from "../../../common/types/request.model.ts";
import "./RequestsTable.scss";

interface RequestsTableProps {
  requests: RequestInterface[];
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  searchFilter: string;
  formatDate: (date: string) => string;
  onSearchChange: (value: string) => void;
  onNavigateToDetails: (requestId: number) => void;
  onPageChange: (page: number) => void;
}

export function RequestsTable({
  requests,
  currentPage,
  totalPages,
  totalRequests,
  searchFilter,
  formatDate,
  onSearchChange,
  onNavigateToDetails,
  onPageChange
}: RequestsTableProps) {
  const { t } = useI18n();
  const startItem = totalRequests > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = totalRequests > 0 ? Math.min(currentPage * 10, totalRequests) : 0;

  const renderActionsMenu = (requestId: number) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="white" className="request-list-table__actions-button">
          <EllipsisVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onNavigateToDetails(requestId)}
        >
          <ReceiptText size={16} />
          <span>{t("Detalhes")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="request-list-table">
      <div className="request-list-table__mobile">
        {requests.length > 0 ? (
          <>
            <div className="request-list-table__cards">
              {requests.map((request) => (
                <div className="request-list-table__card" key={request.id}>
                  <div className="request-list-table__card-header">
                    <span>{t("Ações")}</span>
                    {renderActionsMenu(request.id)}
                  </div>
                  <div className="request-list-table__card-content">
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">{t("Protocolo")}</span>
                      <span className="request-list-table__card-value">{request.protocolCode}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">{t("Sistema")}</span>
                      <span className="request-list-table__card-value">{request.role?.client?.name}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">{t("Papel")}</span>
                      <span className="request-list-table__card-value">{request.role?.label}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">{t("Data de submissão")}</span>
                      <span className="request-list-table__card-value">{formatDate(request.criacao)}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">{t("Status")}</span>
                      <span className="request-list-table__card-value">
                        {RequestStatusBadge(request.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="request-list-table__mobile-pagination">
              <TablePagination
                className="request-list-table__pagination"
                align="end"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : (
          <div className="request-list-table__empty-state">
            <div>
              <ReceiptText size={24} />
            </div>
            <span>{t("Nenhuma solicitação encontrada")}</span>
          </div>
        )}
      </div>

      <div className="request-list-table__desktop">
        <div className="app-table app-table--icon request-list-table__table">
          <div className="app-table__filter">
            <div className="request-list-table__filter-content">
              <div className="app-input-group app-input-group--icon-left request-list-table__filter-input">
                <Search className="app-input-group__icon" />
                <input
                  className="app-input"
                  placeholder={t("Buscar solicitação...")}
                  value={searchFilter}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="app-table__header">
            <div className="app-table__row">
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--protocol">
                <span>{t("Protocolo")}</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--system">
                <span>{t("Sistema")}</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--role">
                <span>{t("Papel")}</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--submission-date">
                <span>{t("Data de submissão")}</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--status">
                <span>{t("Status")}</span>
              </div>
              <div className="app-table__cell app-table__cell--icon request-list-table__table-cell request-list-table__table-cell--actions">
                <span>{t("Ações")}</span>
              </div>
            </div>
          </div>

          <div className="app-table__body">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="app-table__row">
                  <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--protocol">
                    <span>{request.protocolCode}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--system">
                    <span>{request.role?.client?.name}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--role">
                    <span>{request.role?.label}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--submission-date">
                    <span>{formatDate(request.criacao)}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--status">
                    {RequestStatusBadge(request.status)}
                  </div>
                  <div className="app-table__cell app-table__cell--icon request-list-table__table-cell request-list-table__table-cell--actions">
                    {renderActionsMenu(request.id)}
                  </div>
                </div>
              ))
            ) : (
              <div className="app-table__row">
              <div className="app-table__cell request-list-table__empty-state">
                  <div>
                    <ReceiptText size={24} />
                  </div>
                  <span>{t("Nenhuma solicitação encontrada")}</span>
                </div>
              </div>
            )}
          </div>

          <div className="app-table__footer">
            <div className="request-list-table__footer">
              <div className="request-list-table__footer-info">
                {t("{{start}}-{{end}} de {{total}} itens", {
                  start: startItem,
                  end: endItem,
                  total: totalRequests
                })}
              </div>
              <div className="request-list-table__footer-pagination">
                <TablePagination
                  className="request-list-table__pagination"
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
