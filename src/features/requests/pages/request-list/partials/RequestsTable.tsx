import { EllipsisVertical, ReceiptText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../../../common/external/ui/table.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../../common/external/ui/dropdown-menu.tsx";
import { PaginationWrapper } from "../../../../../common/components/PaginationWrapper.tsx";
import { RequestStatusBadge } from "../../../common/components/RequestStatusBadge.tsx";
import { RequestInterface } from "../../../common/types/request.model.ts";

interface RequestsTableProps {
  requests: RequestInterface[];
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  formatDate: (date: string) => string;
  onNavigateToDetails: (requestId: number) => void;
  onPageChange: (page: number) => void;
}

export function RequestsTable({
  requests,
  currentPage,
  totalPages,
  totalRequests,
  formatDate,
  onNavigateToDetails,
  onPageChange
}: RequestsTableProps) {
  return (
    <>
      {/* Mobile View */}
      <div>
        {requests.length > 0 ? (
          <>
            {requests.map((request, index) => (
              <div className="table-card" key={`request-table-card-${index}`}>
                <div className="table-card__header">
                  <span>Ações</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onNavigateToDetails(request.id)}
                      >
                        <ReceiptText size={16} />
                        <span>Detalhes</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="table-card__content">
                  <div className="table-card__content__row">
                    <span className="table-card__label">Protocolo:</span>
                    <span className="table-card__value">{request.protocolCode}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Sistema:</span>
                    <span className="table-card__value">{request.role?.client?.name}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Papel:</span>
                    <span className="table-card__value">{request.role?.label}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Data de submissão:</span>
                    <span className="table-card__value">{formatDate(request.criacao)}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Status:</span>
                    <span className="table-card__value">
                      {RequestStatusBadge(request.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : (
          <div>
            <div>
              <ReceiptText size={24} />
            </div>
            <span>Nenhuma solicitação encontrada</span>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead width="calc(20% - 20px)">Protocolo</TableHead>
              <TableHead width="calc(20% - 20px)">Sistema</TableHead>
              <TableHead width="calc(20% - 20px)">Papel</TableHead>
              <TableHead width="calc(20% - 20px)">Data de submissão</TableHead>
              <TableHead width="calc(20% - 20px)">Status</TableHead>
              <TableHead width="100px">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell width="calc(20% - 20px)">{request.protocolCode}</TableCell>
                  <TableCell width="calc(20% - 20px)">{request.role?.client?.name}</TableCell>
                  <TableCell width="calc(20% - 20px)">{request.role?.label}</TableCell>
                  <TableCell width="calc(20% - 20px)">{formatDate(request.criacao)}</TableCell>
                  <TableCell width="calc(20% - 20px)">{RequestStatusBadge(request.status)}</TableCell>
                  <TableCell width="100px">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onNavigateToDetails(request.id)}
                        >
                          <ReceiptText size={16} />
                          <span>Detalhes</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell {...{ colSpan: 6 }}>
                  <div>
                    <div>
                      <ReceiptText size={24} />
                    </div>
                    <span>Nenhuma solicitação encontrada</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <div>
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalRequests}
                onPageChange={onPageChange}
              />
            </div>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

