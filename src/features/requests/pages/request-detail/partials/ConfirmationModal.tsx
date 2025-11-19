import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../../common/external/ui/dialog.tsx"
import { Button } from "../../../../../common/external/ui/button.tsx"
import { Textarea } from "../../../../../common/external/ui/textarea.tsx"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../../common/external/ui/form.tsx"
import { UseFormReturn } from "react-hook-form"

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  action: string;
  form: UseFormReturn<any>;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, action, form }: ConfirmationModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'aprovação') {
      onConfirm();
    } else {
      form.handleSubmit(onConfirm)(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {action !== 'aprovação' && (
            <FormField
              control={form.control}
              name="finalReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo {action === 'cancelamento' ? 'do cancelamento' : 'da revogação'}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o motivo aqui..."
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {action === 'aprovação' && (
            <p>Deseja prosseguir com a aprovação desta solicitação?</p>
          )}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar {action}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

