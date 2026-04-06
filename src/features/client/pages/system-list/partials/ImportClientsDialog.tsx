import { useRef } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { Toggle } from "@common/components/toggle/Toggle.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";

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
  const { t } = useI18n();
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
            <DialogTitle>{t("Importar exportações")}</DialogTitle>
            <DialogDescription>
              {importTargetClientId
                ? t("Importar exportação para o sistema {{clientId}}.", { clientId: importTargetClientId })
                : t("Importar um ou mais sistemas a partir de um arquivo JSON.")}
            </DialogDescription>
          </DialogHeader>

          <div className="app-dialog__body">
            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  {t("Forçar importação?")}
                </span>
                <span className="app-dialog__surface-description">
                  {t("Atualiza registros existentes e remove ausentes.")}
                </span>
              </div>
              <Toggle checked={importForce} onCheckedChange={onImportForceChange} disabled={importLoading} />
            </div>

            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  {t("Importar papéis?")}
                </span>
                <span className="app-dialog__surface-description">
                  {t("Inclui papéis na exportação quando o sistema é gerenciado.")}
                </span>
              </div>
              <Toggle checked={importRoles} onCheckedChange={onImportRolesChange} disabled={importLoading} />
            </div>

            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  {t("Importar configurações de anexo?")}
                </span>
                <span className="app-dialog__surface-description">
                  {t("Substitui as configurações do sistema.")}
                </span>
              </div>
              <Toggle checked={importConfigurations} onCheckedChange={onImportConfigurationsChange} disabled={importLoading} />
            </div>

            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  {t("Arquivo JSON")}
                </span>
                <span className="app-dialog__surface-description">
                  {importFile ? importFile.name : t("Nenhum arquivo selecionado")}
                </span>
              </div>
              <Button variant="outline" onClick={triggerFileSelect} disabled={importLoading}>
                {t("Selecionar arquivo")}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importLoading}>
              {t("Cancelar")}
            </Button>
            <Button onClick={onImport} disabled={importLoading}>
              {importLoading ? <Loader2 className="app-dialog__button-icon animate-spin" /> : <FileUp className="app-dialog__button-icon" />}
              {importLoading ? t("Importando...") : t("Importar")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
