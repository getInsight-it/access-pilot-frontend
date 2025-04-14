import { ColumnDef } from "@tanstack/react-table";
import { RequestModel } from "../../types/request.model.ts";
import { CellAction } from "./cell-action.tsx";

interface StatusColors {
  [key: string]: string;

  created: string;
  approved: string;
  canceled: string;
  pending: string;
  rejected: string;
}

const statusColors: StatusColors = {
  created: "px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm",
  approved: "px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm",
  canceled: "px-3 py-1 rounded font-normal bg-gray-200 text-gray-800 block text-center w-32 text-sm",
  pending: "px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm",
  rejected: "px-3 py-1 rounded font-normal bg-red-200 text-red-800 block text-center w-32 text-sm"
};

const statusTranslations: { [key: string]: string } = {
  created: "Criado",
  approved: "Aprovado",
  canceled: "Cancelado",
  pending: "Em análise",
  rejected: "Rejeitado"
};

export const columns = (origin?: string): ColumnDef<RequestModel>[] => [
  {
    accessorKey: "protocolCode",
    header: "PROTOCOLO"
  },
  {
    accessorKey: "role.client.name",
    header: "SISTEMA"
  },
  {
    accessorKey: "role.name",
    header: "PAPEL"
  },
  {
    accessorKey: "criacao",
    header: "DATA DE SUBMISSÃO",
    cell: ({ row }) => {
      const date = new Date(row.original.criacao);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      return <span>{formattedDate}</span>;
    }
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const statusClass = statusColors[status] || "text-gray-600";
      const translatedStatus = statusTranslations[status] || status;
      return <span className={statusClass}>{translatedStatus}</span>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} origin={origin} />
  }
];

