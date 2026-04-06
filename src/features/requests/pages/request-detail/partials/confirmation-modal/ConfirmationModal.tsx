import { type FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../../common/external/ui/dialog.tsx";
import { useI18n } from "../../../../../../common/context/i18n/I18nContext.tsx";
import "./confirmation-modal.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  action: string;
  requiresReason: boolean;
  form: UseFormReturn<any>;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  action,
  requiresReason,
  form
}: ConfirmationModalProps) {
  const { t } = useI18n();
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if(!requiresReason) {
      onConfirm();
      return;
    }

    form.handleSubmit(onConfirm)(event);
  };

  const hasReasonField = requiresReason;
  const reasonError = form.formState.errors.finalReason?.message;

  const reasonLabel = action === t("cancelamento")
    ? t("Motivo do cancelamento")
    : action === t("rejeição")
      ? t("Motivo da rejeição")
      : t("Motivo da revogação");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="confirmation-modal">
        <DialogHeader className="confirmation-modal__header">
          <DialogTitle className="confirmation-modal__title">{title}</DialogTitle>
        </DialogHeader>

        <form className="confirmation-modal__form" onSubmit={handleSubmit}>
          {hasReasonField ? (
            <div className="confirmation-modal__field">
              <label className="confirmation-modal__label" htmlFor="request-status-final-reason">
                {reasonLabel}
              </label>
              <textarea
                id="request-status-final-reason"
                className="app-textarea confirmation-modal__textarea"
                placeholder={t("Descreva o motivo aqui...")}
                {...form.register("finalReason")}
              />
              {reasonError && <span className="confirmation-modal__error">{t(String(reasonError))}</span>}
            </div>
          ) : (
            <p className="confirmation-modal__description">{t("Deseja prosseguir com a aprovação desta solicitação?")}</p>
          )}

          <DialogFooter className="confirmation-modal__footer">
            <button
              type="button"
              className="ui-button ui-button--white confirmation-modal__button"
              onClick={onClose}
            >
              {t("Cancelar")}
            </button>
            <button
              type="submit"
              className="ui-button ui-button--primary theme-button--primary confirmation-modal__button confirmation-modal__button--confirm"
            >
              {t("Confirmar {{action}}", { action })}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
