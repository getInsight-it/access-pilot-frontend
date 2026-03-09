import { FileDown, Loader2 } from "lucide-react";
import { Button } from "../../../../../../common/external/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../common/external/ui/dialog.tsx";
import { Toggle } from "../../../../../../common/components/toggle/Toggle.tsx";

interface ExportLevelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportIncludeItems: boolean;
  exportIncludeBuiltIn: boolean;
  exportLoading: boolean;
  onExportIncludeItemsChange: (value: boolean) => void;
  onExportIncludeBuiltInChange: (value: boolean) => void;
  onExport: () => void;
}

export const ExportLevelsDialog = ({
  open,
  onOpenChange,
  exportIncludeItems,
  exportIncludeBuiltIn,
  exportLoading,
  onExportIncludeItemsChange,
  onExportIncludeBuiltInChange,
  onExport
}: ExportLevelsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar esferas</DialogTitle>
          <DialogDescription>
            Defina os dados que devem compor o arquivo de exportação.
          </DialogDescription>
        </DialogHeader>

        <div className="app-dialog__body">
          <div className="app-dialog__surface">
            <div className="app-dialog__surface-main">
              <span className="app-dialog__surface-title">
                Incluir esferas Built-in?
              </span>
              <span className="app-dialog__surface-description">
                Esferas Built-in são ignoradas na importação.
              </span>
            </div>
            <Toggle checked={exportIncludeBuiltIn} onCheckedChange={onExportIncludeBuiltInChange} disabled={exportLoading} />
          </div>

          <div className="app-dialog__surface">
            <div className="app-dialog__surface-main">
              <span className="app-dialog__surface-title">
                Incluir itens?
              </span>
              <span className="app-dialog__surface-description">
                Exporta os itens associados a cada esfera.
              </span>
            </div>
            <Toggle checked={exportIncludeItems} onCheckedChange={onExportIncludeItemsChange} disabled={exportLoading} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exportLoading}>
            Cancelar
          </Button>
          <Button onClick={onExport} disabled={exportLoading}>
            {exportLoading ? <Loader2 className="app-dialog__button-icon animate-spin" /> : <FileDown className="app-dialog__button-icon" />}
            {exportLoading ? "Exportando..." : "Exportar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
