import { TablePagination } from "@components/table-pagination/TablePagination.tsx";
import { Button } from "@ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@ui/dropdown-menu.tsx";
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
          <span>Detalhes</span>
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
                    <span>Ações</span>
                    {renderActionsMenu(request.id)}
                  </div>
                  <div className="request-list-table__card-content">
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">Protocolo</span>
                      <span className="request-list-table__card-value">{request.protocolCode}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">Sistema</span>
                      <span className="request-list-table__card-value">{request.role?.client?.name}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">Papel</span>
                      <span className="request-list-table__card-value">{request.role?.label}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">Data de submissão</span>
                      <span className="request-list-table__card-value">{formatDate(request.criacao)}</span>
                    </div>
                    <div className="request-list-table__card-row">
                      <span className="request-list-table__card-label">Status</span>
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
            <span>Nenhuma solicitação encontrada</span>
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
                  placeholder="Buscar solicitação..."
                  value={searchFilter}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="app-table__header">
            <div className="app-table__row">
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--protocol">
                <span>Protocolo</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--system">
                <span>Sistema</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--role">
                <span>Papel</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--submission-date">
                <span>Data de submissão</span>
              </div>
              <div className="app-table__cell app-table__cell--content request-list-table__table-cell request-list-table__table-cell--status">
                <span>Status</span>
              </div>
              <div className="app-table__cell app-table__cell--icon request-list-table__table-cell request-list-table__table-cell--actions">
                <span>Ações</span>
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
                  <span>Nenhuma solicitação encontrada</span>
                </div>
              </div>
            )}
          </div>

          <div className="app-table__footer">
            <div className="request-list-table__footer">
              <div className="request-list-table__footer-info">
                {startItem}-{endItem} de {totalRequests} itens
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
