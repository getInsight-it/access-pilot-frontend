import { type FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../../common/external/ui/dialog.tsx";
import "./confirmation-modal.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  action: string;
  form: UseFormReturn<any>;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  action,
  form
}: ConfirmationModalProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if(action === "aprovação") {
      onConfirm();
      return;
    }

    form.handleSubmit(onConfirm)(event);
  };

  const hasReasonField = action !== "aprovação";
  const reasonError = form.formState.errors.finalReason?.message;

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
                Motivo {action === "cancelamento" ? "do cancelamento" : action === "rejeição" ? "da rejeição" : "da revogação"}
              </label>
              <textarea
                id="request-status-final-reason"
                className="app-textarea confirmation-modal__textarea"
                placeholder="Descreva o motivo aqui..."
                {...form.register("finalReason")}
              />
              {reasonError && <span className="confirmation-modal__error">{String(reasonError)}</span>}
            </div>
          ) : (
            <p className="confirmation-modal__description">Deseja prosseguir com a aprovação desta solicitação?</p>
          )}

          <DialogFooter className="confirmation-modal__footer">
            <button
              type="button"
              className="ui-button ui-button--white confirmation-modal__button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="ui-button ui-button--primary theme-button--primary confirmation-modal__button confirmation-modal__button--confirm"
            >
              Confirmar {action}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
