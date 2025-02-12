import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {RoleDTO} from "../../../services/role/role-dto.ts";

export const columns = (
): ColumnDef<RoleDTO>[] => [
  {
    accessorKey: 'name',
    header: 'NOME DO PAPEL'
  },
  {
    accessorKey: 'roleParent.name',
    header: 'PAPEL PAI',
    cell: ({ row }) => (
      <span>
        {row.original.roleParent?.name?.trim() ? row.original.roleParent?.name : '-'}
      </span>
    )
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO',
    cell: ({ row }) => (
      <span>
        {row.original.description?.trim() ? row.original.description : '-'}
      </span>
    )
  },
  {
    accessorKey: 'esfera',
    header: 'ESFERA',
    cell: ({ row }) => (
      <span>
        -
        {/* {row.original.description?.trim() ? row.original.description : '-'} */}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
