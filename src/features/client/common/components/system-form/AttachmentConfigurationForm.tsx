import React, { useRef, useState } from "react";
import { Plus, Settings, Upload, X } from "lucide-react";
import { Input } from "../../../../../components/ui/input.tsx";
import { Button } from "../../../../../components/ui/button.tsx";
import { Switch } from "../../../../../components/ui/switch.tsx";
import { Textarea } from "../../../../../components/ui/textarea.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "../../../../../components/ui/accordion.tsx";
import { Label } from "../../../../../components/ui/label.tsx";
import { Card } from "../../../../../components/ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../components/ui/dialog.tsx";
import { AttachmentConfigurationInterface, AVAILABLE_EXTENSIONS } from "../../model/configuration.model.ts";
import { clientService } from "../../service/client-service.ts";
import { HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";

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
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState(false);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [formError, setFormError] = useState<{
    key?: string;
    description?: string;
    extensions?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [duplicateKeys, setDuplicateKeys] = useState<string[]>([]);
  const [importedConfigs, setImportedConfigs] = useState<AttachmentConfigurationInterface[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddConfig = () => {
    const errors: {
      key?: string;
      description?: string;
      extensions?: string;
    } = {};

    if(!key.trim()) errors.key = "Chave é obrigatória";
    if(!description.trim()) errors.description = "Descrição é obrigatória";
    if(selectedExtensions.length === 0) errors.extensions = "Selecione pelo menos uma extensão";
    if(configurations.some(config => config.key === key.trim())) errors.key = "Já existe uma configuração com esta chave";

    if(Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    setFormError({});
    onAddConfiguration({
      key,
      description,
      required,
      allowedExtensions: selectedExtensions,
      active: true
    });

    setKey("");
    setDescription("");
    setRequired(false);
    setSelectedExtensions([]);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
    if(formError.key) setFormError(prev => ({ ...prev, key: undefined }));
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
          const importedConfigurations = JSON.parse(response.data) as AttachmentConfigurationInterface[];
          const duplicates = importedConfigurations.filter(
            importedConfig => configurations.some(
              existingConfig => existingConfig.key === importedConfig.key
            )
          ).map(config => config.key);

          if(duplicates.length > 0) {
            setDuplicateKeys(duplicates);
            setImportedConfigs(importedConfigurations);
            setImportModalOpen(true);
          } else {
            importedConfigurations.forEach(config => {
              onAddConfiguration({...config, active: true});
            });
          }
        }
      })
      .catch((error: HttpRequestError) => {
        console.error("Erro ao importar configurações:", error);
        alert("Ocorreu um erro ao importar as configurações.");
      })
      .finally(() => {
        setLoading(false);
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
  };

  const confirmImport = () => {
    duplicateKeys.forEach(key => {
      onDeleteConfiguration(key);
    });

    importedConfigs.forEach(config => {
      onAddConfiguration({...config, active: true});
    });

    setImportModalOpen(false);
    setDuplicateKeys([]);
    setImportedConfigs([]);
  };

  const cancelImport = () => {
    setImportModalOpen(false);
    setDuplicateKeys([]);
    setImportedConfigs([]);
  };

  const activeConfigurations = configurations.filter(config => config.active !== false);

  return (
    <div className="col-span-1 md:col-span-2">
      <h3 className="text-lg font-bold mb-2">Configurações de Anexos</h3>
      <Card className="border-primary p-4 bg-[var(--system-card)]">
        <div className="flex flex-wrap mb-4 items-center">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="add-config">
              <AccordionTrigger className="p-0">
                <div
                  className="flex flex-row items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-secondary/80 transition-colors">
                  <Plus className="h-4 w-4" />
                  Adicionar Nova Configuração
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-4">
                <div className="border border-primary rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="config-key" className="mb-2 block">Chave *</Label>
                      <Input
                        id="config-key"
                        value={key}
                        onChange={handleNameChange}
                        placeholder="Chave da configuração"
                        className={formError.key ? "border-red-500" : ""}
                      />
                      {formError.key && (
                        <p className="text-red-500 text-xs mt-1">{formError.key}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="config-required" className="mb-2 block">Obrigatório *</Label>
                      <div className="flex items-center h-10 space-x-2">
                        <Switch
                          id="config-required"
                          checked={required}
                          onCheckedChange={setRequired}
                        />
                        <span>{required ? "Sim" : "Não"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="config-description" className="mb-2 block">Descrição *</Label>
                    <Textarea
                      id="config-description"
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder="Descrição da configuração"
                      className={formError.description ? "border-red-500" : ""}
                    />
                    {formError.description && (
                      <p className="text-red-500 text-xs mt-1">{formError.description}</p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 block">Extensões Permitidas *</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_EXTENSIONS.map((extension) => (
                        <div
                          key={extension}
                          onClick={() => toggleExtension(extension)}
                          className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                            selectedExtensions.includes(extension)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {extension}
                        </div>
                      ))}
                    </div>
                    {formError.extensions && (
                      <p className="text-red-500 text-xs mt-1">{formError.extensions}</p>
                    )}
                  </div>
                  <Button onClick={handleAddConfig} className="mt-4" type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Configuração
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div
            onClick={handleImportClick}
            className="flex flex-row items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-secondary/80 transition-colors">
            <Upload className="h-4 w-4" />
            <span className="font-medium">Importar Configuração</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          {activeConfigurations.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-lg">
              <p className="text-muted-foreground">Nenhuma configuração adicionada</p>
            </div>
          ) : (
            <div className="p-4 flex flex-row flex-wrap gap-4 items-center border border-dashed rounded-lg">
              {activeConfigurations.map((config) => (
                <Card
                  key={config.key}
                  className="border-primary relative w-[100px] h-[100px] flex flex-col items-center justify-center p-2 bg-secondary">
                  <button
                    onClick={() => onDeleteConfiguration(config.key)}
                    className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                    aria-label="Remover configuração"
                    type="button">
                    <X className="h-4 w-4" />
                  </button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer gap-2 w-full h-full flex flex-col items-center justify-center">
                        <Settings className="h-5 w-5 mt-1 text-gray-800" />
                        <span className="text-xs text-center line-clamp-2">
                          {truncateText(config.key, 12)}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Chave:</span> {config.key}
                        </div>
                        <div>
                          <span className="font-medium">Descrição:</span> {config.description}
                        </div>
                        <div>
                          <span className="font-medium">Obrigatório:</span> {config.required ? "Sim" : "Não"}
                        </div>
                        <div>
                          <span className="font-medium">Extensões:</span> {config.allowedExtensions.join(", ")}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Confirmação de Importação</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <h4 className="font-medium text-lg mb-2">Configurações duplicadas</h4>
              <div className="border rounded-md p-3 bg-amber-50 dark:bg-amber-950/30">
                <p className="mb-2">As seguintes configurações já existem e serão sobrescritas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {duplicateKeys.map(key => (
                    <li key={key}><strong>{key}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Configurações a serem importadas</h4>
              <div className="max-h-[200px] overflow-y-auto border rounded-md p-3">
                <ul className="space-y-3">
                  {importedConfigs.map(config => (
                    <li key={config.key} className="pb-2 border-b last:border-b-0">
                      <div><span className="font-semibold">Chave:</span> {config.key}</div>
                      <div><span className="font-semibold">Descrição:</span> {config.description}</div>
                      <div><span className="font-semibold">Obrigatório:</span> {config.required ? "Sim" : "Não"}</div>
                      <div><span className="font-semibold">Extensões:</span> {config.allowedExtensions.join(", ")}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
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
