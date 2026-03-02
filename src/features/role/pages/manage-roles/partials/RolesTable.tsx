import { Copy, Edit, EllipsisVertical, UserCog } from "lucide-react";
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
import { RoleResponseInterface } from "../../../common/types/role.model.ts";
import { toast } from "@common/external/ui/use-toast.ts";

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
  const EmptyState = () => (
    <div>
      <div>
        <UserCog size={24} />
      </div>
      <span>Nenhum papel encontrado</span>
    </div>
  );

  const RoleActions = ({ role }: { role: RoleResponseInterface }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => { navigator.clipboard?.writeText(role.id?.toString() ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
          <Copy size={16} />
          <span>Copiar Código</span>
      </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEditRole(role.id)}>
          <Edit size={16} />
          <span>Editar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Mobile View */}
      <div>
        {roles && roles.length > 0 ? (
          <>
            {roles.map((role, index) => (
              <div className="table-card" key={`mobile-table-card-${index}`}>
                <div className="table-card__header">
                  <div>
                    <span>Ações</span>
                    <RoleActions role={role} />
                  </div>
                </div>
                <div className="table-card__content">
                  <div className="table-card__content__row">
                    <span className="table-card__label">Label</span>
                    <span className="table-card__value">{role.label}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Label papel pai</span>
                    <span className="table-card__value">
                      {role.roleParent?.label || <span className="text-gray-400">Não informado</span>}
                    </span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Descrição</span>
                    <span className="table-card__value">{role.description}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Esfera</span>
                    <span className="table-card__value">
                      {role.level?.name || <span className="text-gray-400">Não informado</span>}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={allRoles.length}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : !loading ? (
          <EmptyState />
        ) : null}
      </div>

      {/* Desktop View */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead width="calc(25% - 25px)">Label</TableHead>
              <TableHead width="calc(25% - 25px)">Label papel pai</TableHead>
              <TableHead width="calc(25% - 25px)">Descrição</TableHead>
              <TableHead width="calc(25% - 25px)">Esfera</TableHead>
              <TableHead width="100px">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles && roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell width="calc(25% - 25px)">{role.label}</TableCell>
                  <TableCell width="calc(25% - 25px)">
                    {role.roleParent?.label || <span className="text-gray-400">Não informado</span>}
                  </TableCell>
                  <TableCell width="calc(25% - 25px)">{role.description}</TableCell>
                  <TableCell width="calc(25% - 25px)">
                    {role.level?.name || <span className="text-gray-400">Não informado</span>}
                  </TableCell>
                  <TableCell width="100px">
                    <RoleActions role={role} />
                  </TableCell>
                </TableRow>
              ))
            ) : !loading ? (
              <TableRow>
                <TableCell {...{ colSpan: 5 }}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
          <TableFooter>
            <div>
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={allRoles.length}
                onPageChange={onPageChange}
              />
            </div>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

