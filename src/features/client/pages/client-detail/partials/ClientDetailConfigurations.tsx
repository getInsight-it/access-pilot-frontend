import { Settings } from "lucide-react";
import { AttachmentConfigurationInterface } from "../../../common/model/configuration.model.ts";
import { Card } from "../../../../../components/ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover.tsx";

interface ClientDetailConfigurationsProps {
  configurations: AttachmentConfigurationInterface[];
  truncateText: (text: string, maxLength: number) => string;
}

export const ClientDetailConfigurations = ({
  configurations,
  truncateText
}: ClientDetailConfigurationsProps) => {
  if (!configurations || configurations.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="font-bold mb-3 text-lg">Configurações de anexos:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {configurations.map((config: AttachmentConfigurationInterface) => (
          <Card
            key={config.key}
            className="relative flex flex-col items-center justify-center p-3 bg-secondary">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="cursor-pointer gap-2 w-full h-full flex flex-col items-center justify-center p-3">
                  <Settings className="h-6 w-6 mt-1 text-gray-400" />
                  <span className="text-sm font-medium text-center line-clamp-1">
                    {truncateText(config.key, 15)}
                  </span>
                  <span className="text-xs text-center text-muted-foreground line-clamp-2">
                    {truncateText(config.description, 30)}
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
    </div>
  );
};
