import { Cog, FolderSync, Pen, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip.tsx";
import { Button } from "@ui/button.tsx";
import { ClientResponseInterface } from "@features/client/common/model/client.model";

interface ClientDetailActionsProps {
  client: ClientResponseInterface;
  onEdit: (clientId: string) => void;
  onSync: (clientId: string) => void;
  onPublish: (clientId?: number) => void;
  onUnpublish: (clientId?: number) => void;
  onManageRoles: (clientId: string) => void;
}

interface ActionButtonProps {
  icon: any;
  label: string;
  onClick: () => void;
}

export const ClientDetailActions = ({
  client,
  onEdit,
  onSync,
  onPublish,
  onUnpublish,
  onManageRoles
}: ClientDetailActionsProps) => {
  const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}>
            <Icon />
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div>
      <p>Ações:</p>
      <div>
        <ActionButton
          icon={Pen}
          label="Editar"
          onClick={() => onEdit(client.clientId)}
        />

        {client.managed && (
          <ActionButton
            icon={FolderSync}
            label="Sincronizar"
            onClick={() => onSync(client.clientId)}
          />
        )}

        {client.status !== "PUBLISHED" ? (
          <ActionButton
            icon={Cog}
            label="Publicar"
            onClick={() => onPublish(client.id)}
          />
        ) : (
          <ActionButton
            icon={Cog}
            label="Despublicar"
            onClick={() => onUnpublish(client.id)}
          />
        )}

        {client.managed && (
          <ActionButton
            icon={User}
            label="Gerenciar papéis"
            onClick={() => onManageRoles(client.clientId)}
          />
        )}
      </div>
    </div>
  );
};
