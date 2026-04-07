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
import { useI18n } from "../../../../../common/context/i18n/I18nContext.tsx";

interface ConfirmRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string,
  roleLabel: string,
  reason: string,
  attachments: FileAttachment[];
  onConfirm: () => void;
}

export const ConfirmRequestDialog = ({
  isOpen,
  onOpenChange,
  clientName,
  roleLabel,
  reason,
  attachments,
  onConfirm
}: ConfirmRequestDialogProps) => {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Confirmar envio")}</DialogTitle>
          <DialogDescription>
            {t("Você tem certeza que deseja enviar esta solicitação?")}
          </DialogDescription>
        </DialogHeader>
        <div>
          <h4>{t("Resumo da solicitação:")}</h4>
          <ul>
            <li><strong>{t("Sistema")}:</strong> {clientName}</li>
            <li>
              <strong>{t("Papel")}:</strong> {roleLabel}
            </li>
            <li><strong>{t("Motivo")}:</strong> {reason}</li>
            {attachments.length > 0 && (
              <li>
                <strong>{t("Anexos")}:</strong>
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
            {t("Cancelar")}
          </Button>
          <Button onClick={onConfirm}>{t("Confirmar")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
