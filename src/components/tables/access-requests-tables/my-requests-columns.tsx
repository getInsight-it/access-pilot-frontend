// 'use client';
// import { ColumnDef } from '@tanstack/react-table';
// import { CellAction } from './my-requests-cell-action';
// import { AccessRequest } from '@/constants/data';
// import { Checkbox } from '@/components/ui/checkbox';

// export const columns: ColumnDef<AccessRequest>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Selecionar todos"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Selecionar linha"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false
//   },
//   {
//     accessorKey: 'id',
//     header: 'ID DA SOLICITAÇÃO'
//   },
//   {
//     accessorKey: 'system',
//     header: 'SISTEMA'
//   },
//   {
//     accessorKey: 'role',
//     header: 'PAPEL'
//   },
//   {
//     accessorKey: 'date',
//     header: 'DATA DE SUBMISSÃO'
//   },
//   {
//     accessorKey: 'status',
//     header: 'STATUS'
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => <CellAction data={row.original} />
//   }
// ];


// my-requests-columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './my-requests-cell-action';
import { AccessRequest } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';

// Defina uma interface que lista os possíveis status e uma assinatura de índice
interface StatusColors {
  [key: string]: string;
  aprovado: string;
  pendente: string;
  rejeitado: string;
  'em progresso': string;
}

const statusColors: StatusColors = {
  aprovado: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
  pendente: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
  rejeitado: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
  'em progresso': 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
};

export const columns: ColumnDef<AccessRequest>[] = [
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
  //   header: 'ID DA SOLICITAÇÃO'
  // },
  {
    accessorKey: 'system',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'role',
    header: 'PAPEL'
  },
  {
    accessorKey: 'date',
    header: 'DATA DE SUBMISSÃO'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase(); // Converter para minúsculas
      const statusClass = statusColors[status] || 'text-gray-600';
      return <span className={statusClass}>{status}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];


