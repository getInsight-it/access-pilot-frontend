import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Role } from '../../../constants/data';
import { Checkbox } from '../../../components/ui/checkbox';

export const columns: ColumnDef<Role>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false
  // },
  // {
  //   accessorKey: 'id',
  //   header: 'ID DA FUNÇÃO'
  // },
  {
    accessorKey: 'name',
    header: 'NOME DA FUNÇÃO'
  },
  {
    accessorKey: 'parentRole',
    header: 'FUNÇÃO PAI'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO'
  },
  // {
  //   accessorKey: 'role',
  //   header: 'FUNÇÃO'
  // },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
