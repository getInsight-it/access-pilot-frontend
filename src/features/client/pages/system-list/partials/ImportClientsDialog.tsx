import { useRef } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { Toggle } from "@common/components/toggle/Toggle.tsx";

interface ImportClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importTargetClientId: string | null;
  importFile: File | null;
  importLoading: boolean;
  importForce: boolean;
  importRoles: boolean;
  importConfigurations: boolean;
  onImportForceChange: (value: boolean) => void;
  onImportRolesChange: (value: boolean) => void;
  onImportConfigurationsChange: (value: boolean) => void;
  onImportFileChange: (file: File | null) => void;
  onImport: () => void;
}

export const ImportClientsDialog = ({
  open,
  onOpenChange,
  importTargetClientId,
  importFile,
  importLoading,
  importForce,
  importRoles,
  importConfigurations,
  onImportForceChange,
  onImportRolesChange,
  onImportConfigurationsChange,
  onImportFileChange,
  onImport
}: ImportClientsDialogProps) => {
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
            <DialogTitle>Importar exportações</DialogTitle>
            <DialogDescription>
              {importTargetClientId
                ? `Importar exportação para o sistema ${importTargetClientId}.`
                : "Importar um ou mais sistemas a partir de um arquivo JSON."}
            </DialogDescription>
          </DialogHeader>

          <div className="app-dialog__body">
            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  Forçar importação?
                </span>
                <span className="app-dialog__surface-description">
                  Atualiza registros existentes e remove ausentes.
                </span>
              </div>
              <Toggle checked={importForce} onCheckedChange={onImportForceChange} disabled={importLoading} />
            </div>

            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  Importar papéis?
                </span>
                <span className="app-dialog__surface-description">
                  Inclui roles na exportação quando o sistema é gerenciado.
                </span>
              </div>
              <Toggle checked={importRoles} onCheckedChange={onImportRolesChange} disabled={importLoading} />
            </div>

            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  Importar configurações de anexo?
                </span>
                <span className="app-dialog__surface-description">
                  Substitui as configurações do sistema.
                </span>
              </div>
              <Toggle checked={importConfigurations} onCheckedChange={onImportConfigurationsChange} disabled={importLoading} />
            </div>

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
