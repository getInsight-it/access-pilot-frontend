import React, { useRef, useState } from "react";
import { Download, Plus, Settings, Upload, X } from "lucide-react";
import { Toggle } from "@common/components/toggle/Toggle.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { AttachmentConfigurationInterface, AVAILABLE_EXTENSIONS } from "../model/configuration.model.ts";
import { clientService } from "../service/client-service.ts";
import { HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { toast } from "@ui/use-toast.ts";
import "./AttachmentConfigurationForm.scss";

export interface AttachmentConfigSectionProps {
  configurations: AttachmentConfigurationInterface[];
  onAddConfiguration: (config: AttachmentConfigurationInterface) => void;
  onDeleteConfiguration: (name: string) => void;
}

export const AttachmentConfigurationForm: React.FC<AttachmentConfigSectionProps> = ({
  configurations,
  onAddConfiguration,
  onDeleteConfiguration
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState(false);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [formError, setFormError] = useState<{
    name?: string;
    description?: string;
    extensions?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [duplicateNames, setDuplicateNames] = useState<string[]>([]);
  const [importedConfigs, setImportedConfigs] = useState<AttachmentConfigurationInterface[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeConfigurations = configurations.filter(config => config.active !== false);

  const handleAddConfig = () => {
    const errors: {
      name?: string;
      description?: string;
      extensions?: string;
    } = {};

    if(!name.trim()) errors.name = "Nome é obrigatório";
    if(!description.trim()) errors.description = "Descrição é obrigatória";
    if(selectedExtensions.length === 0) errors.extensions = "Selecione pelo menos uma extensão";
    if(configurations.some(config => config.name === name.trim())) errors.name = "Já existe uma configuração com este nome";

    if(Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    setFormError({});
    onAddConfiguration({
      key: "",
      name,
      description,
      required,
      allowedExtensions: selectedExtensions,
      active: true
    });

    setName("");
    setDescription("");
    setRequired(false);
    setSelectedExtensions([]);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if(formError.name) setFormError(prev => ({ ...prev, name: undefined }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if(formError.description) setFormError(prev => ({ ...prev, description: undefined }));
  };

  const toggleExtension = (extension: string) => {
    setSelectedExtensions(prev =>
      prev.includes(extension)
        ? prev.filter(ext => ext !== extension)
        : [...prev, extension]
    );
    if(formError.extensions) setFormError(prev => ({ ...prev, extensions: undefined }));
  };

  const truncateText = (text: string, maxLength: number) => {
    if(text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleImportClick = () => {
    if(fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if(!file) return;

    if(file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Por favor, selecione apenas arquivos CSV.");
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    await clientService.clientConfigurationPreview(file)
      .then((response: HttpRequestResponse | HttpRequestError) => {
        if(response instanceof HttpRequestResponse) {
          const importedConfigurations = response.data as AttachmentConfigurationInterface[];
          const duplicates = importedConfigurations.filter(
            importedConfig => configurations.some(
              existingConfig => existingConfig.name === importedConfig.name
            )
          ).map(config => config.name);

          if(duplicates.length > 0) {
            setDuplicateNames(duplicates);
            setImportedConfigs(importedConfigurations);
            setImportModalOpen(true);
          } else {
            importedConfigurations.forEach(config => {
              onAddConfiguration({ ...config, active: true });
            });
          }
        }
      })
      .catch((error: any) => {
        const errorMessage: string = formatErrorMessages(error.error);
        toast({
          title: "Erro ao importar configurações",
          description: errorMessage,
          variant: "destructive"
        });
      })
      .finally(() => {
        setLoading(false);
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
  };

  const confirmImport = () => {
    duplicateNames.forEach(entry => {
      onDeleteConfiguration(entry);
    });

    importedConfigs.forEach(config => {
      onAddConfiguration({ ...config, active: true });
    });

    setImportModalOpen(false);
    setDuplicateNames([]);
    setImportedConfigs([]);
  };

  const cancelImport = () => {
    setImportModalOpen(false);
    setDuplicateNames([]);
    setImportedConfigs([]);
  };

  const handleExportClick = async () => {
    if(activeConfigurations.length === 0) {
      toast({
        title: "Nenhuma configuração para exportar",
        description: "Adicione pelo menos uma configuração antes de exportar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setExporting(true);
      const response = await clientService.exportAttachmentConfigurationsPreview(activeConfigurations);
      const url = window.URL.createObjectURL(response.data as Blob);
      const link = document.createElement("a");
      const fileName = response.headers["content-disposition"]?.match(/filename="?(.+?)"?$/)?.[1]
        || "attachments_configurations.csv";

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao exportar configurações",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="attachment-configuration-form">
      <h3 className="attachment-configuration-form__title">Anexos</h3>

      <div className="attachment-configuration-form__surface">
        <div className="attachment-configuration-form__form-content">
          <div className="attachment-configuration-form__top-row">
            <div className="attachment-configuration-form__field">
              <label className="attachment-configuration-form__label" htmlFor="config-name">
                Nome <span className="attachment-configuration-form__required">*</span>
              </label>
              <input
                id="config-name"
                value={name}
                onChange={handleNameChange}
                placeholder="Nome da configuração"
                className={`app-input attachment-configuration-form__input${formError.name ? " attachment-configuration-form__input--error" : ""}`}
              />
              {formError.name && (
                <p className="attachment-configuration-form__error">{formError.name}</p>
              )}
            </div>

            <div className="attachment-configuration-form__field">
              <span className="attachment-configuration-form__label">Ícone</span>
              <div className="attachment-configuration-form__icon-row">
                <span className="attachment-configuration-form__icon-preview">
                  <Settings className="attachment-configuration-form__icon-preview-icon" />
                </span>
                <button
                  type="button"
                  className="ui-button ui-button--white attachment-configuration-form__action-button attachment-configuration-form__action-button--white"
                >
                  Selecionar ícone
                </button>
              </div>
            </div>
          </div>

          <div className="attachment-configuration-form__field">
            <label className="attachment-configuration-form__label" htmlFor="config-description">
              Descrição <span className="attachment-configuration-form__required">*</span>
            </label>
            <textarea
              id="config-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Descrição da configuração"
              className={`app-textarea attachment-configuration-form__textarea${formError.description ? " attachment-configuration-form__textarea--error" : ""}`}
            />
            {formError.description && (
              <p className="attachment-configuration-form__error">{formError.description}</p>
            )}
          </div>

          <div className="attachment-configuration-form__field">
            <span className="attachment-configuration-form__label">
              Extensões Permitidas <span className="attachment-configuration-form__required">*</span>
            </span>
            <div className="attachment-configuration-form__extensions-picker">
              {AVAILABLE_EXTENSIONS.map((extension) => (
                <button
                  type="button"
                  key={extension}
                  onClick={() => toggleExtension(extension)}
                  className={`attachment-configuration-form__extension-option${selectedExtensions.includes(extension) ? " attachment-configuration-form__extension-option--selected" : ""}`}
                >
                  {extension}
                </button>
              ))}
            </div>
            {formError.extensions && (
              <p className="attachment-configuration-form__error">{formError.extensions}</p>
            )}
          </div>

          <div className="attachment-configuration-form__toggle-row">
            <div className="attachment-configuration-form__toggle-control">
              <Toggle
                checked={required}
                onCheckedChange={setRequired}
              />
              <span className="attachment-configuration-form__label">Tornar anexo obrigatório</span>
            </div>
          </div>

          <button
            type="button"
            className="ui-button ui-button--primary attachment-configuration-form__action-button attachment-configuration-form__action-button--primary attachment-configuration-form__action-button--add"
            onClick={handleAddConfig}
          >
            <span className="attachment-configuration-form__button-content">
              <Plus className="attachment-configuration-form__button-icon" />
              <span>Adicionar Configuração</span>
            </span>
          </button>
        </div>
      </div>

      <div className="attachment-configuration-form__import-export-actions">
        <button
          type="button"
          className="ui-button ui-button--white attachment-configuration-form__action-button attachment-configuration-form__action-button--white"
          onClick={handleImportClick}
          disabled={loading}
        >
          <span className="attachment-configuration-form__button-content">
            <Upload className="attachment-configuration-form__button-icon" />
            <span>Importar Configuração</span>
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="attachment-configuration-form__file-input"
            disabled={loading}
          />
        </button>

        <button
          type="button"
          className="ui-button ui-button--white attachment-configuration-form__action-button attachment-configuration-form__action-button--white"
          onClick={handleExportClick}
          disabled={exporting}
        >
          <span className="attachment-configuration-form__button-content">
            <Download className="attachment-configuration-form__button-icon" />
            <span>Exportar Configuração</span>
          </span>
        </button>
      </div>

      <div className="attachment-configuration-form__list-section">
        {activeConfigurations.length === 0 ? (
          <div className="attachment-configuration-form__empty-state">
            <p className="attachment-configuration-form__empty-state-text">Nenhum tipo de anexo adicionado</p>
          </div>
        ) : (
          <div className="attachment-configuration-form__list-grid">
            {activeConfigurations.map((config) => (
              <div
                key={config.name}
                className="attachment-configuration-form__card"
              >
                <div className="attachment-configuration-form__card-header">
                  <span className="attachment-configuration-form__card-icon-box">
                    <Settings className="attachment-configuration-form__card-icon" />
                  </span>
                  <button
                    onClick={() => onDeleteConfiguration(config.name)}
                    aria-label="Remover configuração"
                    type="button"
                    className="attachment-configuration-form__delete-button"
                  >
                    <X className="attachment-configuration-form__delete-icon" />
                  </button>
                </div>

                <p className="attachment-configuration-form__card-name">{truncateText(config.name, 50)}</p>

                <div className="attachment-configuration-form__card-badge-wrap">
                  {config.required ? (
                    <span className="app-badge app-badge--header">Obrigatório</span>
                  ) : (
                    <span className="attachment-configuration-form__optional-badge">Opcional</span>
                  )}
                </div>

                <div className="attachment-configuration-form__card-extensions-section">
                  <span className="attachment-configuration-form__card-extensions-label">Extensões permitidas:</span>
                  <div className="attachment-configuration-form__card-extensions-list">
                    {config.allowedExtensions.map((extension) => (
                      <span key={`${config.name}-${extension}`} className="attachment-configuration-form__extension-badge">
                        {extension}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirmação de Importação
            </DialogTitle>
          </DialogHeader>

          <div className="attachment-configuration-form__dialog-content">
            <div className="attachment-configuration-form__dialog-section">
              <h4 className="attachment-configuration-form__dialog-title">Configurações duplicadas</h4>
              <div className="attachment-configuration-form__dialog-body">
                <p className="attachment-configuration-form__dialog-description">
                  As seguintes configurações já existem e serão sobrescritas:
                </p>
                <ul className="attachment-configuration-form__dialog-list">
                  {duplicateNames.map(entry => (
                    <li key={entry}>
                      <strong>{entry}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="attachment-configuration-form__dialog-section">
              <h4 className="attachment-configuration-form__dialog-title">Configurações a serem importadas</h4>
              <div className="attachment-configuration-form__dialog-body">
                <ul className="attachment-configuration-form__dialog-list">
                  {importedConfigs.map(config => (
                    <li key={config.name}>
                      <div className="attachment-configuration-form__dialog-item">
                        <div>
                          <span>Nome:</span>{" "}
                          <span>{config.name}</span>
                        </div>
                        <div>
                          <span>Descrição:</span>{" "}
                          <span>{config.description}</span>
                        </div>
                        <div>
                          <span>Obrigatório:</span>{" "}
                          <span>{config.required ? "Sim" : "Não"}</span>
                        </div>
                        <div>
                          <span>Extensões:</span>{" "}
                          <span>{config.allowedExtensions.join(", ")}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="ui-button ui-button--white attachment-configuration-form__action-button attachment-configuration-form__action-button--white"
              onClick={cancelImport}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="ui-button ui-button--primary attachment-configuration-form__action-button attachment-configuration-form__action-button--primary"
              onClick={confirmImport}
            >
              Confirmar Importação
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
