import { AlertModal } from "../../../components/modal/alert-modal";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu";
import { Cog, Eye, FolderSync, MoreHorizontal, Pen, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { catchError, finalize, from, tap } from "rxjs";
import { toast } from "../../ui/use-toast.ts";
import { ClientResponseInterface } from "../../../features/client/common/model/client.model.ts";
import { clientService } from "../../../features/client/common/service/client-service.ts";

interface CellActionProps {
  data: ClientResponseInterface,
  updateState?: React.Dispatch<React.SetStateAction<boolean>>
}

export const CellAction: React.FC<CellActionProps> = ({ data, updateState }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onConfirm = async () => {};

  const handleSync = (clientId: string) => {
    setLoading(true);
    from(clientService.synchronousByClientId(clientId)).pipe(
      tap((response) => {
        toast({
          title: "Sistema sincronizado",
          description: "O sistema foi sincronizado com sucesso"
        });
        updateState?.(false);
      }),
      catchError((error) => {
        toast({
          title: "Erro ao sincronizar sistema",
          description: "O sistema não foi sincronizado",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };


  const handlePublish = (clientId?: number) => {
    setLoading(true);
    from(clientService.publish(clientId)).pipe(
      tap((response) => {
        if(response) {
          toast({
            title: "Sistema publicado",
            description: "O sistema foi publicado com sucesso"
          });
          updateState?.(false);
        }
      }),
      catchError((error) => {
        toast({
          title: "Erro ao publicar sistema",
          description: "O sistema não foi publicado",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  const handleUnpublish = (clientId?: number) => {
    setLoading(true);
    from(clientService.unpublish(clientId)).pipe(
      tap((response) => {
        if(response) {
          toast({
            title: "Sistema despublicado",
            description: "O sistema foi despublicado com sucesso"
          });
          updateState?.(false);
        }
      }),
      catchError((error) => {
        toast({
          title: "Erro ao despublicar sistema",
          description: "O sistema não foi despublicado",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  return (
    <>
      {/*{modal === 'EDIT_SYSTEM' ? <ModalSystemDrawer data={data} open={modal} setOpen={() => setModal(null)}/> : null}*/}
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
            onClick={() => navigate(`/dashboard/systems/${data.clientId}/details`)}
          >
            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/systems/${data.clientId}/edit`)}
          >
            <Pen className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          {data.managed && (
            <DropdownMenuItem
              onClick={() => handleSync(data.clientId)}
            >
              <FolderSync className="mr-2 h-4 w-4" /> Sincronizar
            </DropdownMenuItem>
          )}
          {data.status !== "PUBLISHED" && (
            <DropdownMenuItem
              onClick={() => handlePublish(data.id)}
            >
              <Cog className="mr-2 h-4 w-4" /> Publicar
            </DropdownMenuItem>
          )}
          {data.status === "PUBLISHED" && (
            <DropdownMenuItem
              onClick={() => handleUnpublish(data.id)}
            >
              <Cog className="mr-2 h-4 w-4" /> Despublicar
            </DropdownMenuItem>
          )}
          {data.managed && (
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/systems/${data.clientId}/roles`)}
            >
              <User className="mr-2 h-4 w-4" /> Gerenciar papéis
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>


      </DropdownMenu>
    </>
  );
};
