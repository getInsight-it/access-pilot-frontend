import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { System } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<System>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Selecionar todos"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Selecionar linha"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false
  // },
  // {
  //   accessorKey: 'id',
  //   header: 'ID DO SISTEMA'
  // },
  {
    accessorKey: 'name',
    header: 'NOME'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO'
  },
  {
    accessorKey: 'status',
    header: 'STATUS'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
