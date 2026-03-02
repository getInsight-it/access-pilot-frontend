import { useRef } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { Switch } from "@ui/switch.tsx";

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
        className="hidden"
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

          <div>
            <div>
              <div>
                <span>
                  Forçar importação?
                </span>
                <span>
                  Atualiza registros existentes e remove ausentes.
                </span>
              </div>
              <Switch checked={importForce} onCheckedChange={onImportForceChange} disabled={importLoading} />
            </div>

            <div>
              <div>
                <span>
                  Importar papéis?
                </span>
                <span>
                  Inclui roles na exportação quando o sistema é gerenciado.
                </span>
              </div>
              <Switch checked={importRoles} onCheckedChange={onImportRolesChange} disabled={importLoading} />
            </div>

            <div>
              <div>
                <span>
                  Importar configurações de anexo?
                </span>
                <span>
                  Substitui as configurações do sistema.
                </span>
              </div>
              <Switch checked={importConfigurations} onCheckedChange={onImportConfigurationsChange} disabled={importLoading} />
            </div>

            <div>
              <div>
                <span>
                  Arquivo JSON
                </span>
                <span>
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
              {importLoading ? <Loader2 className="animate-spin" /> : <FileUp />}
              {importLoading ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
