import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {RoleDTO} from "../../../services/role/role-dto.ts";

export const columns = (
): ColumnDef<RoleDTO>[] => [
  {
    accessorKey: 'name',
    header: 'NOME DA FUNÇÃO'
  },
  {
    accessorKey: 'roleParent.name',
    header: 'FUNÇÃO PAI'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
