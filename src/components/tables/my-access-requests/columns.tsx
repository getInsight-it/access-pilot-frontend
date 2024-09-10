import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import AccessRequests from '@/constants/access-requests.json';
import { Checkbox } from '@/components/ui/checkbox';

type AccessRequest = {
  id: number;
  system: string;
  role: string;
  requester: string;
  date_submission: string;
  status: string;
};

const accessRequests: AccessRequest[] = AccessRequests as AccessRequest[];

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
  {
    accessorKey: 'system',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'role',
    header: 'PAPEL'
  },
  // {
  //   accessorKey: 'requester',
  //   header: 'SOLICITANTE'
  // },
  {
    accessorKey: 'date_submission',
    header: 'DATA DE SUBMISSÃO'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const statusClass = statusColors[status] || 'text-gray-600';
      return <span className={statusClass}>{status}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];



;
// import { ColumnDef } from '@tanstack/react-table';

// import { CellAction } from './cell-action';
// import AccessRequests from '@/constants/access-requests.json';

// import { Checkbox } from '@/components/ui/checkbox';

// // Defina uma interface que lista os possíveis status e uma assinatura de índice
// interface StatusColors {
//   [key: string]: string;
//   aprovado: string;
//   pendente: string;
//   rejeitado: string;
//   'em progresso': string;
// }

// const statusColors: StatusColors = {
//   aprovado: 'px-3 py-1.5 rounded-full text-white font-bold bg-green-600',
//   pendente: 'px-3 py-1.5 rounded-full text-white font-bold bg-yellow-600',
//   rejeitado: 'px-3 py-1.5 rounded-full text-white font-bold bg-red-600',
//   'em progresso': 'px-3 py-1.5 rounded-full text-white font-bold bg-blue-600',
//   // Adicione mais status e cores conforme necessário
// };

// export const columns: ColumnDef<typeof AccessRequests>[] = [
//   // {
//   //   id: 'select',
//   //   header: ({ table }) => (
//   //     <Checkbox
//   //       checked={table.getIsAllPageRowsSelected()}
//   //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//   //       aria-label="Selecionar todos"
//   //     />
//   //   ),
//   //   cell: ({ row }) => (
//   //     <Checkbox
//   //       checked={row.getIsSelected()}
//   //       onCheckedChange={(value) => row.toggleSelected(!!value)}
//   //       aria-label="Selecionar linha"
//   //     />
//   //   ),
//   //   enableSorting: false,
//   //   enableHiding: false
//   // },
//   // {
//   //   accessorKey: 'id',
//   //   header: 'ID DA SOLICITAÇÃO'
//   // },
//   {
//     accessorKey: 'system',
//     header: 'SISTEMA'
//   },
//   {
//     accessorKey: 'role',
//     header: 'PAPEL'
//   },
//   {
//     accessorKey: 'requester',
//     header: 'SOLICITANTE'
//   },
//   {
//     accessorKey: 'date_submission',
//     header: 'DATA DE SUBMISSÃO'
//   },
//   {
//     accessorKey: 'status',
//     header: 'STATUS',
//     cell: ({ row }) => {
//       const status = row.original.status.toLowerCase(); // Converter para minúsculas
//       const statusClass = statusColors[status] || 'text-gray-600';
//       return <span className={statusClass}>{status}</span>;
//     }
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => <CellAction data={row.original} />
//   }
// ];