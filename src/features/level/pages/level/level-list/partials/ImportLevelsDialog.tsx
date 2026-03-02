import { useRef } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "../../../../../../common/external/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../common/external/ui/dialog.tsx";

interface ImportLevelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importFile: File | null;
  importLoading: boolean;
  onImportFileChange: (file: File | null) => void;
  onImport: () => void;
}

export const ImportLevelsDialog = ({
  open,
  onOpenChange,
  importFile,
  importLoading,
  onImportFileChange,
  onImport
}: ImportLevelsDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onImportFileChange(file);
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar esferas</DialogTitle>
            <DialogDescription>
              Importar esferas a partir de um arquivo JSON. Esferas Built-in serão ignoradas.
            </DialogDescription>
          </DialogHeader>

          <div>
            <div className="border border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-gray-900 dark:text-gray-100">
                  Arquivo JSON
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {importFile ? importFile.name : "Nenhum arquivo selecionado"}
                </span>
              </div>
              <Button variant="outline" onClick={triggerFileSelect} disabled={importLoading}>
                Selecionar arquivo
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importLoading}>
              Cancelar
            </Button>
            <Button onClick={onImport} disabled={importLoading}>
              {importLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
              {importLoading ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
