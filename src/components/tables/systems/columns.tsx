'use client'
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Systems from '@/constants/systems.json';
import { Checkbox } from '@/components/ui/checkbox';

type System = {
  id: number;
  name: string;
  description: string;
  status: string;
};

const accessRequests: System[] = Systems as System[];

interface StatusColors {
  [key: string]: string;
  gerenciado: string;
  pendente: string;
  rejeitado: string;
  'em progresso': string;
}

const statusColors: StatusColors = {
  gerenciado: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
  pendente: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
  rejeitado: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
  'em progresso': 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
};

export const columns: ColumnDef<System>[] = [
  {
    accessorKey: 'name',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const statusClass = statusColors[status] || 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm';
      return <span className={statusClass}>{status}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
