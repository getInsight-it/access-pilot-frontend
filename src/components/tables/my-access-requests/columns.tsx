import {ColumnDef} from '@tanstack/react-table';
import {DetailDrawer} from '../../drawers/DetailDrawer';
import React from "react";
import {Link} from "react-router-dom";
import {cn} from "../../../lib/utils.ts";
import {buttonVariants} from "../../ui/button.tsx";
import {Eye} from "lucide-react";
import {RequestDTO} from "../../../services/request/request-d-t-o.ts";


interface StatusColors {
  [key: string]: string;
  created: string;
  approved: string;
  canceled: string;
  pending: string;
  rejected: string;
}

const statusColors: StatusColors = {
  created: 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
  approved: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
  canceled: 'px-3 py-1 rounded font-normal bg-red-200 text-red-800 block text-center w-32 text-sm',
  pending: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
  rejected: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
};


export const columns = (selectedClient: RequestDTO | undefined,
                        setSelectedClient: React.Dispatch<React.SetStateAction<RequestDTO | undefined>>,
                        updateTable?: () => void,
                        origin?: string
): ColumnDef<RequestDTO>[] => [
  {
    accessorKey: 'protocolCode',
    header: 'PROTOCOLO'
  },
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
    cell: ({ row }) =>
    <>
      <Link
        onClick={() => setSelectedClient(row.original)}
        to={''}
        className={cn(buttonVariants({variant: 'link'}))}
      >
        <Eye className="mr-2 h-4 w-4"/> Ver detalhes
      </Link>
      {(selectedClient === row.original && <DetailDrawer data={selectedClient} onUpdate={updateTable} origin={origin}/>)}
    </>
  }
];
