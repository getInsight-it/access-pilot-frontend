import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form"

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, action, form }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onConfirm)}>
          <FormField
            control={form.control}
            name="finalReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo da conclusão</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Motivo da conclusão..."
                    className="col-span-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
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
  )
}

