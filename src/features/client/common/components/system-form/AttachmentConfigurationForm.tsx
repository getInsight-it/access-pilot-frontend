import type React from "react";
import { useState } from "react";
import { Plus, Settings, X } from "lucide-react";
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
import { AttachmentConfigurationInterface, AVAILABLE_EXTENSIONS } from "../../model/configuration.model.ts";

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
      allowedExtensions: selectedExtensions
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

  return (
    <div className="col-span-1 md:col-span-2">

      <h3 className="text-lg font-bold mb-2">Configurações de Anexos</h3>

      <Card className="border-primary p-4 bg-[var(--system-card)]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="add-config">
            <AccordionTrigger className="pb-3 pt-0 text-base font-medium">
              <div className="flex flex-row gap-2 items-center">
                Adicionar Nova Configuração
                <Plus className="h-4 w-4 mr-2" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="border border-primary rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="config-key" className="mb-2 block">Chave *</Label>
                    <Input
                      id="config-key"
                      value={key}
                      onChange={handleNameChange}
                      placeholder="Chave da configuração"
                      className={formError.key ? "border-red-500" : ""} />
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
                  {formError.extensions && (<p className="text-red-500 text-xs mt-1">{formError.extensions}</p>)}
                </div>

                <Button
                  onClick={handleAddConfig}
                  className="mt-4"
                  type="button">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Configuração
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          {configurations.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-lg">
              <p className="text-muted-foreground">Nenhuma configuração adicionada</p>
            </div>
          ) : (
            <div className="p-4 flex flex-row flex-wrap gap-4 items-center border border-dashed rounded-lg">
              {configurations.map((config) => (
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
                        <Settings className="h-6 w-6 mt-1 text-gray-400" />
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
    </div>
  );
};
