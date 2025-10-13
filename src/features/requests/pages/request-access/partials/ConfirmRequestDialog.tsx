import { Button } from "../../../../../common/external/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../common/external/ui/dialog.tsx";
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Confirmar envio</DialogTitle>
          <DialogDescription className="text-sm">
            Você tem certeza que deseja enviar esta solicitação?
          </DialogDescription>
        </DialogHeader>
        <div className="py-3 sm:py-4">
          <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Resumo da solicitação:</h4>
          <ul className="space-y-2 text-sm">
            <li className="break-words"><strong>Sistema:</strong> {clientId}</li>
            <li className="break-words">
              <strong>Papel:</strong> {roleLabel}
            </li>
            <li className="break-words"><strong>Motivo:</strong> {reason}</li>
            {attachments.length > 0 && (
              <li>
                <strong>Anexos:</strong>
                <ul className="mt-1 space-y-1">
                  {attachments.map((file, index) => (
                    <li key={index} className="break-words ml-2">- {file.fileName}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto">Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
