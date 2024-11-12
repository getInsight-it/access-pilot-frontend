import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { DetailDrawer } from '../../drawers/DetailDrawer';
import { RoleDTO } from '../../../services/role/role-dto';

type AccessRequest = {
  id: number;
  clientId: string;
  role: RoleDTO;
  criacao: string;
  status: string;
};

const accessRequests: AccessRequest[] = [];

interface StatusColors {
  [key: string]: string;
  created: string;
  aprovado: string;
  pendente: string;
  rejeitado: string;
  'em progresso': string;
}

const statusColors: StatusColors = {
  created: 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
  aprovado: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
  pendente: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
  rejeitado: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
  'em progresso': 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
};


export const columns: ColumnDef<AccessRequest>[] = [
  {
    accessorKey: 'role.client.name',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'role.name',
    header: 'PAPEL'
  },
  {
    accessorKey: 'criacao',
    header: 'DATA DE SUBMISSÃO',
    cell: ({ row }) => {
      const date = new Date(row.original.criacao);
      const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return <span>{formattedDate}</span>;
    }
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
    cell: ({ row }) => <DetailDrawer data={row.original} />
  }
];
