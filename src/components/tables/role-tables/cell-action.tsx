import {AlertModal} from '../../../components/modal/alert-modal';
import {Button} from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import {Edit, MoreHorizontal, Trash} from 'lucide-react';
import {useState} from 'react';
import {catchError, finalize, from, tap} from "rxjs";
import {roleService} from "../../../services/role";
import {toast} from "../../ui/use-toast.ts";
import {RoleDTO} from "../../../services/role/role-dto.ts";

interface CellActionProps {
  data: RoleDTO,
  onEdit?: (data: RoleDTO) => void
}

export const CellAction: React.FC<CellActionProps> = ({data, onEdit}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    from(roleService.deleteRole(data.id)).pipe(
      tap(() => {
        toast({
          title: "Função apagada",
          description: "A função foi apagada com sucesso",
        });
        setOpen(false);
      }),
      catchError((error) => {
        toast({
          title: "Erro ao apagar função",
          description: "A função não foi apagada",
          variant: "destructive",
        });
        console.error(error);
        return [];
      }), finalize(() => setLoading(false))
    ).subscribe();
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
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => onEdit?.(data)}
          >
            <Edit className="mr-2 h-4 w-4"/> Atualizar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4"/> Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
