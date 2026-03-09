import { Button } from "../../../../../common/external/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../common/external/ui/dialog.tsx";
import { FileAttachment } from "../components/request-justification-step/RequestJustificationStep.tsx";

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
        <div>
          <h4>Resumo da solicitação:</h4>
          <ul>
            <li><strong>Sistema:</strong> {clientId}</li>
            <li>
              <strong>Papel:</strong> {roleLabel}
            </li>
            <li><strong>Motivo:</strong> {reason}</li>
            {attachments.length > 0 && (
              <li>
                <strong>Anexos:</strong>
                <ul>
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
