import {ColumnDef} from '@tanstack/react-table';
import {CellAction} from './cell-action';
import TrafficLight from '../../../components/TrafficLights';
import {SystemDetailDrawer} from '../../../components/drawers/SystemDetailDrawer';
import React, {Dispatch, SetStateAction} from "react";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {Link} from "react-router-dom";
import {cn} from "../../../lib/utils.ts";
import {buttonVariants} from "../../ui/button.tsx";
import {Eye} from "lucide-react";

const statusColors: Record<string, string> = {
  gerenciado: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
  pendente: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
  rejeitado: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
  'em progresso': 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
};

export const columns = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<ClientDTO>[] => [
  {
    accessorKey: 'clientId',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => (
      <div className="flex gap-x-2 items-center">
        <TrafficLight managed={row.original.managed} published={row.original.status === 'PUBLISHED'} />
        {/* <p>
          {row.original.managed
            ? row.original.status !== 'PUBLISHED' ? 'Não Publicado' : 'Publicado'
            : 'Não Gerenciado'
          }
        </p> */}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original}  updateState={setLoading} />
  }
];
