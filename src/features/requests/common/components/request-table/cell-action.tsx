import { Button } from "../../../../../components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../../../../../components/ui/dropdown-menu.tsx";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RequestModel } from "../../types/request.model.ts";
import React from "react";

interface CellActionProps {
  data: RequestModel;
  origin?: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, origin }) => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/access-requests/${data.id}`, { state: { origin: origin } })}
          >
            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
