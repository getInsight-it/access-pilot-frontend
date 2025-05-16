import { AlertModal } from "../../../components/modal/alert-modal";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { catchError, finalize, from } from "rxjs";
import { toast } from "../../ui/use-toast.ts";
import { useNavigate } from "react-router-dom";
import { roleService } from "../../../features/role/common/service/role-service.ts";
import { RoleResponseInterface } from "../../../features/role/common/types/role.model.ts";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";

interface CellActionProps {
  data: RoleResponseInterface,
  onEdit?: (data: RoleResponseInterface) => void
  onDetails?: (data: RoleResponseInterface) => void
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onConfirm = async () => {
    setLoading(true);
    from(roleService.deleteRole(data.id)).pipe(
      catchError((error) => {
        toast({
          title: "Erro ao apagar função",
          description: "A função não foi apagada",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }), finalize(() => setLoading(false))
    ).subscribe(
      {}
    );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
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
              savePreviousRoute(location.pathname + location.search);
              navigate(`/dashboard/roles/${data.id}/edit`)
            }}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/roles/${data.id}/details`)}>
            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
