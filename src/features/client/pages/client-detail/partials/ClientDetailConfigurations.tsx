import { Settings } from "lucide-react";
import { AttachmentConfigurationInterface } from "../../../common/model/configuration.model.ts";
import { Card } from "../../../../../components/ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover.tsx";
import { useState } from "react";

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

  // Estado para controlar qual popover está aberto
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Manipuladores de eventos de mouse
  const handleMouseEnter = (configKey: string) => {
    setOpenPopoverId(configKey);
  };

  const handleMouseLeave = () => {
    setOpenPopoverId(null);
  };

  return (
    <div>
      <p className="font-bold mb-3 text-lg">Configurações de anexos:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {configurations.map((config: AttachmentConfigurationInterface) => (
          <Card
            key={config.key}
            className="relative flex flex-col items-center justify-center p-3 bg-secondary">
            <Popover open={openPopoverId === config.key}>
              <PopoverTrigger asChild>
                <div
                  className="cursor-pointer gap-2 w-full h-full flex flex-col items-center justify-center p-3"
                  onMouseEnter={() => handleMouseEnter(config.key)}
                  onMouseLeave={handleMouseLeave}>
                  <Settings className="h-6 w-6 mt-1 text-gray-400" />
                  <span className="text-sm font-medium text-center line-clamp-1">
                    {truncateText(config.name, 50)}
                  </span>
                  <span className="text-xs text-center text-muted-foreground line-clamp-2">
                    {truncateText(config.description, 50)}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-100 max-w-[500px]"
                onMouseEnter={() => handleMouseEnter(config.key)}
                onMouseLeave={handleMouseLeave}>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Nome:</span> {config.name}
                  </div>
                  <div>
                    <span className="font-semibold">Descrição:</span> {config.description}
                  </div>
                  <div>
                    <span className="font-semibold">Obrigatório:</span> {config.required ? "Sim" : "Não"}
                  </div>
                  <div>
                    <span className="font-semibold">Extensões:</span> {config.allowedExtensions.join(", ")}
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
