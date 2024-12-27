import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import AccessRequests from '../../../constants/access-requests.json';
import { Checkbox } from '../../../components/ui/checkbox';
import { DetailDrawer } from '../../../components/drawers/DetailDrawer';
import {Link} from "react-router-dom";
import {cn} from "../../../lib/utils.ts";
import {buttonVariants} from "../../ui/button.tsx";
import {Eye} from "lucide-react";
import React from "react";
import {RequestDTO} from "../../../services/request/request-d-t-o.ts";


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

export const columns = (selectedClient: RequestDTO | undefined,
                        setSelectedClient: React.Dispatch<React.SetStateAction<RequestDTO | undefined>>,
                        updateTable?: () => void
): ColumnDef<RequestDTO>[] => [
  {
    accessorKey: 'protocolCode',
    header: 'PROTOCOLO'
  },
  {
    accessorKey: 'system',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'role',
    header: 'PAPEL'
  },
  {
    accessorKey: 'requester',
    header: 'SOLICITANTE'
  },
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
    cell: ({ row }) =>
      <>
        <Link
          onClick={() => setSelectedClient(row.original)}
          to={''}
          className={cn(buttonVariants({variant: 'link'}))}
        >
          <Eye className="mr-2 h-4 w-4"/> Ver detalhes
        </Link>
        {(selectedClient === row.original && <DetailDrawer data={selectedClient} onUpdate={updateTable}/>)}
      </>
  }
];

