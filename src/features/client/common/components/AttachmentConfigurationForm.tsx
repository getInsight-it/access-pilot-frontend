import React, { useRef, useState } from "react";
import { Plus, Settings, Upload, X } from "lucide-react";
import { Input } from "../../../../common/external/ui/input.tsx";
import { Button } from "../../../../common/external/ui/button.tsx";
import { Switch } from "../../../../common/external/ui/switch.tsx";
import { Textarea } from "../../../../common/external/ui/textarea.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "../../../../common/external/ui/accordion.tsx";
import { Label } from "../../../../common/external/ui/label.tsx";
import { Card } from "../../../../common/external/ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../common/external/ui/popover.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../common/external/ui/dialog.tsx";
import { AttachmentConfigurationInterface, AVAILABLE_EXTENSIONS } from "../model/configuration.model.ts";
import { clientService } from "../service/client-service.ts";
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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [duplicateNames, setDuplicateNames] = useState<string[]>([]);
  const [importedConfigs, setImportedConfigs] = useState<AttachmentConfigurationInterface[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          const importedConfigurations = JSON.parse(response.data) as AttachmentConfigurationInterface[];
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

  const activeConfigurations = configurations.filter(config => config.active !== false);

  return (
    <div className="col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Anexos</h3>

      <div className="mb-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="add-config" className="border border-gray-300 dark:border-gray-700 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex flex-row items-center gap-2">
                <Plus className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Adicionar Novo Tipo de Anexo
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="config-name">
                      Nome <span className="text-primary-600">*</span>
                    </Label>
                    <Input
                      id="config-name"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Nome da configuração"
                      className={`mt-2 ${formError.name ? "border-red-500" : ""}`}
                    />
                    {formError.name && (
                      <p className="text-sm text-red-500 mt-1">{formError.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300">
                      Tornar anexo obrigatório
                    </Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch
                        checked={required}
                        onCheckedChange={setRequired}
                      />
                      <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
                        {required ? "Obrigatório" : "Opcional"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="config-description">
                    Descrição <span className="text-primary-600">*</span>
                  </Label>
                  <Textarea
                    id="config-description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Descrição da configuração"
                    className={`mt-2 ${formError.description ? "border-red-500" : ""}`}
                  />
                  {formError.description && (
                    <p className="text-sm text-red-500 mt-1">{formError.description}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-normal text-gray-700 dark:text-gray-300">
                    Extensões Permitidas <span className="text-primary-600">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVAILABLE_EXTENSIONS.map((extension) => (
                      <div
                        key={extension}
                        onClick={() => toggleExtension(extension)}
                        className={`px-3 py-1 rounded-md cursor-pointer transition-colors text-sm ${
                          selectedExtensions.includes(extension)
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {extension}
                      </div>
                    ))}
                  </div>
                  {formError.extensions && (
                    <p className="text-sm text-red-500 mt-1">{formError.extensions}</p>
                  )}
                </div>

                <Button onClick={handleAddConfig} type="button" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Configuração
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={loading}
            className="flex items-center gap-2 min-h-[44px]"
          >
            <Upload className="h-4 w-4 text-primary-600" />
            <span>Importar Anexos</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
              disabled={loading}
            />
          </Button>
        </div>
      </div>

      <div>
        {activeConfigurations.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Nenhum tipo de anexo adicionado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeConfigurations.map((config) => (
              <Card
                key={config.name}
                className="relative p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <button
                  onClick={() => onDeleteConfiguration(config.name)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remover configuração"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="cursor-pointer flex flex-col items-center text-center">
                      <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {truncateText(config.name, 50)}
                      </span>
                      <span
                        className={`text-xs ${config.required ? "text-primary-600" : "text-gray-500"} mt-1`}>
                        {config.required ? "Obrigatório" : "Opcional"}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome:</span>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{config.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</span>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{config.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Obrigatório:</span>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{config.required ? "Sim" : "Não"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Extensões:</span>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{config.allowedExtensions.join(", ")}</p>
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
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirmação de Importação
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Configurações duplicadas
              </h4>
              <div className="border border-amber-200 dark:border-amber-800 rounded-md p-3 bg-amber-50 dark:bg-amber-950/30">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  As seguintes configurações já existem e serão sobrescritas:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {duplicateNames.map(name => (
                    <li key={name} className="text-sm text-gray-900 dark:text-gray-100">
                      <strong>{name}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Configurações a serem importadas
              </h4>
              <div className="max-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-3">
                  {importedConfigs.map(config => (
                    <li key={config.name} className="pb-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Nome:</span>{" "}
                          <span className="text-gray-900 dark:text-gray-100">{config.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Descrição:</span>{" "}
                          <span className="text-gray-900 dark:text-gray-100">{config.description}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Obrigatório:</span>{" "}
                          <span className="text-gray-900 dark:text-gray-100">{config.required ? "Sim" : "Não"}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Extensões:</span>{" "}
                          <span className="text-gray-900 dark:text-gray-100">{config.allowedExtensions.join(", ")}</span>
                        </div>
                      </div>
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
