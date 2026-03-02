import React, { useRef, useState } from "react";
import { Download, Plus, Settings, Upload, X } from "lucide-react";
import { Input } from "@ui/input.tsx";
import { Button } from "@ui/button.tsx";
import { Switch } from "@ui/switch.tsx";
import { Textarea } from "@ui/textarea.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@ui/accordion.tsx";
import { Label } from "@ui/label.tsx";
import { Card } from "@ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { AttachmentConfigurationInterface, AVAILABLE_EXTENSIONS } from "../model/configuration.model.ts";
import { clientService } from "../service/client-service.ts";
import { HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { toast } from "@ui/use-toast.ts";

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
  const [accordionValue, setAccordionValue] = useState<string>("add-config");

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
      key: '',
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
              onAddConfiguration({...config, active: true});
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
    duplicateNames.forEach(name => {
      onDeleteConfiguration(name);
    });

    importedConfigs.forEach(config => {
      onAddConfiguration({...config, active: true});
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
    if (activeConfigurations.length === 0) {
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
      const a = document.createElement("a");
      const fileName = response.headers["content-disposition"]?.match(/filename=\"?(.+?)\"?$/)?.[1]
        || "attachments_configurations.csv";

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
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
    <div>
      <h3>Anexos</h3>

      <div>
        <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value="add-config" className="!border-outline-button-border">
            <AccordionTrigger>
              <div>
                <Plus className="text-primary-600" />
                <span>
                  Adicionar Novo Tipo de Anexo
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <div>
                  <div>
                    <Label htmlFor="config-name">
                      Nome <span className="text-primary-600">*</span>
                    </Label>
                    <Input
                      id="config-name"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Nome da configuração"
                      className={`${formError.name ? "border-red-500" : ""}`}
                    />
                    {formError.name && (
                      <p>{formError.name}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Tornar anexo obrigatório
                    </Label>
                    <div>
                      <Switch
                        checked={required}
                        onCheckedChange={setRequired}
                      />
                      <span>
                        {required ? "Obrigatório" : "Opcional"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="config-description">
                    Descrição <span className="text-primary-600">*</span>
                  </Label>
                  <Textarea
                    id="config-description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Descrição da configuração"
                    className={`${formError.description ? "border-red-500" : ""}`}
                  />
                  {formError.description && (
                    <p>{formError.description}</p>
                  )}
                </div>

                <div>
                  <Label>
                    Extensões Permitidas <span className="text-primary-600">*</span>
                  </Label>
                  <div>
                    {AVAILABLE_EXTENSIONS.map((extension) => (
                      <div
                        key={extension}
                        onClick={() => toggleExtension(extension)}
                        className={`${
                          selectedExtensions.includes(extension)
                            ? "bg-primary-600"
                            : ""
                        }`}
                      >
                        {extension}
                      </div>
                    ))}
                  </div>
                  {formError.extensions && (
                    <p>{formError.extensions}</p>
                  )}
                </div>

                <Button onClick={handleAddConfig} type="button">
                  <Plus />
                  Adicionar Configuração
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={loading}
          >
            <Upload className="text-primary-600" />
            <span>Importar Configuração</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
              disabled={loading}
            />
          </Button>
          <Button
            variant="outline"
            onClick={handleExportClick}
            disabled={exporting}
          >
            <Download className="text-primary-600" />
            <span>Exportar Configuração</span>
          </Button>
        </div>
      </div>

      <div>
        {activeConfigurations.length === 0 ? (
          <div>
            <p>Nenhum tipo de anexo adicionado</p>
          </div>
        ) : (
          <div>
            {activeConfigurations.map((config) => (
              <Card
                key={config.name}
                className="!border-outline-button-border"
              >
                <button
                  onClick={() => onDeleteConfiguration(config.name)}
                  aria-label="Remover configuração"
                  type="button"
                >
                  <X />
                </button>

                <Popover>
                  <PopoverTrigger asChild>
                    <div>
                      <Settings />
                      <span>
                        {truncateText(config.name, 50)}
                      </span>
                      <span
                        className={`${config.required ? "text-primary-600" : ""}`}>
                        {config.required ? "Obrigatório" : "Opcional"}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      <div>
                        <span>Nome:</span>
                        <p>{config.name}</p>
                      </div>
                      <div>
                        <span>Descrição:</span>
                        <p>{config.description}</p>
                      </div>
                      <div>
                        <span>Obrigatório:</span>
                        <p>{config.required ? "Sim" : "Não"}</p>
                      </div>
                      <div>
                        <span>Extensões:</span>
                        <p>{config.allowedExtensions.join(", ")}</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </Card>
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

          <div>
            <div>
              <h4>
                Configurações duplicadas
              </h4>
              <div>
                <p>
                  As seguintes configurações já existem e serão sobrescritas:
                </p>
                <ul>
                  {duplicateNames.map(name => (
                    <li key={name}>
                      <strong>{name}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4>
                Configurações a serem importadas
              </h4>
              <div>
                <ul>
                  {importedConfigs.map(config => (
                    <li key={config.name}>
                      <div>
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
            <Button variant="outline" onClick={cancelImport}>
              Cancelar
            </Button>
            <Button onClick={confirmImport}>
              Confirmar Importação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
