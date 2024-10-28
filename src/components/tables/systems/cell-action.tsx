import { AlertModal } from '../../../components/modal/alert-modal';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import { Cog, Eye, FileKey, FileKey2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CellActionProps {
  data: {
    id: number;
    name: string;
    description: string;
    status: string;
    managed: boolean;
    published: boolean;
  };
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onConfirm = async () => {
    // Lógica de confirmação
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
            onClick={() => navigate(`/dashboard/request-detail/`)}
          >
            <Eye className="mr-2 h-4 w-4" /> Detalhar
          </DropdownMenuItem>

          {!data.managed && (
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/request-detail/`)}
            >
              <Cog className="mr-2 h-4 w-4" /> Gerenciar
            </DropdownMenuItem>
          )}

          {data.managed && !data.published && (
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/request-detail/`)}
            >
              <FileKey2 className="mr-2 h-4 w-4" /> Publicar
            </DropdownMenuItem>
          )}

          {data.managed && data.published && (
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/request-detail/`)}
            >
              <FileKey className="mr-2 h-4 w-4" /> Despublicar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
