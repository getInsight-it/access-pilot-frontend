import { Button } from "../../../../../components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../../../../../components/ui/dropdown-menu.tsx";
import { Eye, MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { savePreviousRoute } from "../../../../../common/utils/NavigationStateManager.ts";

interface CellActionProps {
  data: any;
  origin?: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, origin }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
            onClick={() => {
              savePreviousRoute(location.pathname + location.search, origin)
              navigate(`/dashboard/access-requests/${data.id}`, { state: { origin: origin } })}
            }>
            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
