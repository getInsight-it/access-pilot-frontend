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
        className="app-dialog__hidden-input"
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

          <div className="app-dialog__body">
            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  Arquivo JSON
                </span>
                <span className="app-dialog__surface-description">
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
              {importLoading ? <Loader2 className="app-dialog__button-icon animate-spin" /> : <FileUp className="app-dialog__button-icon" />}
              {importLoading ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
