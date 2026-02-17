import { FileDown, Loader2 } from "lucide-react";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../common/external/ui/dialog.tsx";
import { Switch } from "../../../../../common/external/ui/switch.tsx";

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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Exportar esferas</DialogTitle>
          <DialogDescription>
            Defina os dados que devem compor o arquivo de exportação.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 rounded-md border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Incluir esferas Built-in?
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Esferas Built-in são ignoradas na importação.
              </span>
            </div>
            <Switch checked={exportIncludeBuiltIn} onCheckedChange={onExportIncludeBuiltInChange} disabled={exportLoading} />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-md border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Incluir itens?
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Exporta os itens associados a cada esfera.
              </span>
            </div>
            <Switch checked={exportIncludeItems} onCheckedChange={onExportIncludeItemsChange} disabled={exportLoading} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exportLoading}>
            Cancelar
          </Button>
          <Button onClick={onExport} disabled={exportLoading}>
            {exportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            {exportLoading ? "Exportando..." : "Exportar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
