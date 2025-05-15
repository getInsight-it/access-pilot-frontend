import { Button } from "../../../../../components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../components/ui/dialog.tsx";
import { FileAttachment } from "./AttachmentStep.tsx";

interface ConfirmRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string,
  roleLabel: string,
  reason: string,
  attachments: FileAttachment[];
  onConfirm: () => void;
}

export const ConfirmRequestDialog = ({
  isOpen,
  onOpenChange,
  clientId,
  roleLabel,
  reason,
  attachments,
  onConfirm
}: ConfirmRequestDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar envio</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja enviar esta solicitação?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="text-sm font-medium mb-2">Resumo da solicitação:</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>Sistema:</strong> {clientId}</li>
            <li>
              <strong>Papel:</strong> {roleLabel}
            </li>
            <li><strong>Motivo:</strong> {reason}</li>
            {attachments.length > 0 && (
              <li>
                <strong>Anexos:</strong>
                <ul className="">
                  {attachments.map((file, index) => (
                    <li key={index}>- {file.fileName}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
