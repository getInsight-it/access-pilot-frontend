import { Edit, EllipsisVertical, UserCog } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <UserCog size={24} className="text-gray-400" />
      </div>
      <span className="text-sm text-gray-500">Nenhum papel encontrado</span>
    </div>
  );

  const RoleActions = ({ role }: { role: RoleResponseInterface }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex flex-row gap-2"
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
      <div className="flex flex-col gap-4 lg:hidden w-full sm:w-auto">
        {roles && roles.length > 0 ? (
          <>
            {roles.map((role, index) => (
              <div className="table-card" key={`mobile-table-card-${index}`}>
                <div className="table-card__header">
                  <div className="flex items-center justify-between">
                    <span className="mr-2">Ações</span>
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
            <div className="p-4">
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
      <div className="hidden lg:flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead width="calc(25% - 25px)">Label</TableHead>
              <TableHead width="calc(25% - 25px)">Label papel pai</TableHead>
              <TableHead width="calc(25% - 25px)">Descrição</TableHead>
              <TableHead width="calc(25% - 25px)">Esfera</TableHead>
              <TableHead className="flex align-center justify-center" width="100px">Ações</TableHead>
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
                  <TableCell className="flex align-center justify-center" width="100px">
                    <RoleActions role={role} />
                  </TableCell>
                </TableRow>
              ))
            ) : !loading ? (
              <TableRow>
                <TableCell {...{ colSpan: 5 }} className="py-12 justify-center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
          <TableFooter>
            <div className="p-4">
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

