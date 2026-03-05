import { TablePagination } from "@components/table-pagination/TablePagination.tsx";
import { Button } from "@ui/button.tsx";
import { toast } from "@ui/use-toast.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@ui/dropdown-menu.tsx";
import { PAGINATION } from "@constants/pagination.ts";
import { Copy, EllipsisVertical, PencilLine, UserCog } from "lucide-react";
import { RoleResponseInterface } from "../../../../common/types/role.model.ts";
import "./RolesTable.scss";

interface RolesTableProps {
  roles: RoleResponseInterface[];
  allRoles: RoleResponseInterface[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditRole: (roleId: number) => void;
}

export function RolesTable({
  roles,
  allRoles,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEditRole
}: RolesTableProps) {
  const totalItems = allRoles.length;
  const startItem = totalItems > 0 ? (currentPage - 1) * PAGINATION.DEFAULT_PAGE_SIZE + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * PAGINATION.DEFAULT_PAGE_SIZE, totalItems) : 0;

  const renderActionsMenu = (role: RoleResponseInterface) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="white" className="roles-table__row-actions-button">
          <EllipsisVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard?.writeText(role.id?.toString() ?? "");
            toast({ title: "Copiado", description: "Código copiado para a área de transferência." });
          }}
        >
          <Copy size={16} />
          <span>Copiar código</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditRole(role.id)}>
          <PencilLine size={16} />
          <span>Editar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="roles-table">
      <div className="roles-table__mobile">
        {roles.length > 0 ? (
          <>
            <div className="roles-table__cards">
              {roles.map((role) => (
                <div className="roles-table__card" key={role.id}>
                  <div className="roles-table__card-header">
                    <span>Ações</span>
                    {renderActionsMenu(role)}
                  </div>
                  <div className="roles-table__card-content">
                    <div className="roles-table__card-row">
                      <span className="roles-table__card-label">Label</span>
                      <span className="roles-table__card-value">{role.label}</span>
                    </div>
                    <div className="roles-table__card-row">
                      <span className="roles-table__card-label">Label papel pai</span>
                      <span className="roles-table__card-value">
                        {role.roleParent?.label || <span className="roles-table__muted">Não informado</span>}
                      </span>
                    </div>
                    <div className="roles-table__card-row">
                      <span className="roles-table__card-label">Descrição</span>
                      <span className="roles-table__card-value">{role.description || "-"}</span>
                    </div>
                    <div className="roles-table__card-row">
                      <span className="roles-table__card-label">Esfera</span>
                      <span className="roles-table__card-value">
                        {role.level?.name || <span className="roles-table__muted">Não informado</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="roles-table__mobile-pagination">
              <TablePagination
                className="roles-table__pagination"
                align="end"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : !loading ? (
          <div className="roles-table__empty-state">
            <div>
              <UserCog size={24} />
            </div>
            <span>Nenhum papel encontrado</span>
          </div>
        ) : null}
      </div>

      <div className="roles-table__desktop">
        <div className="app-table app-table--icon app-table--no-filter roles-table__table">
          <div className="app-table__header">
            <div className="app-table__row">
              <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--label">
                <span>Label</span>
              </div>
              <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--parent">
                <span>Label papel pai</span>
              </div>
              <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--description">
                <span>Descrição</span>
              </div>
              <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--level">
                <span>Esfera</span>
              </div>
              <div className="app-table__cell app-table__cell--icon roles-table__table-cell roles-table__table-cell--actions">
                <span>Ações</span>
              </div>
            </div>
          </div>

          <div className="app-table__body">
            {roles.length > 0 ? (
              roles.map((role) => (
                <div key={role.id} className="app-table__row">
                  <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--label">
                    <span>{role.label}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--parent">
                    {role.roleParent?.label || <span className="roles-table__muted">Não informado</span>}
                  </div>
                  <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--description">
                    <span>{role.description || "-"}</span>
                  </div>
                  <div className="app-table__cell app-table__cell--content roles-table__table-cell roles-table__table-cell--level">
                    {role.level?.name || <span className="roles-table__muted">Não informado</span>}
                  </div>
                  <div className="app-table__cell app-table__cell--icon roles-table__table-cell roles-table__table-cell--actions">
                    {renderActionsMenu(role)}
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className="app-table__row">
                <div className="app-table__cell roles-table__empty-state">
                  <div>
                    <UserCog size={24} />
                  </div>
                  <span>Nenhum papel encontrado</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="app-table__footer">
            <div className="roles-table__table-footer">
              <div className="roles-table__table-footer-info">
                {startItem}-{endItem} de {totalItems} itens
              </div>
              <div className="roles-table__table-footer-pagination">
                <TablePagination
                  className="roles-table__pagination"
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
