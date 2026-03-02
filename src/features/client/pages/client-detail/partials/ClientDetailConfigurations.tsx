import { InfoIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover.tsx";
import { useState } from "react";
import { AttachmentConfigurationInterface } from "@features/client/common/model/configuration.model";

interface ClientDetailConfigurationsProps {
  configurations: AttachmentConfigurationInterface[];
  truncateText: (text: string, maxLength: number) => string;
}

export const ClientDetailConfigurations = ({ configurations }: ClientDetailConfigurationsProps) => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handleTogglePopover = (configKey: string) => {
    setOpenPopoverId(prevId => prevId === configKey ? null : configKey);
  };

  const handleMouseEnter = (configKey: string) => {
    setOpenPopoverId(configKey);
  };

  const handleMouseLeave = () => {
    setOpenPopoverId(null);
  };

  if(!configurations || configurations.length === 0) {
    return (
      <div>
        <p>Nenhum anexo cadastrado para este sistema.</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        {configurations.map((config: AttachmentConfigurationInterface) => (
          <Popover key={config.key} open={openPopoverId === config.key}>
            <div
              className="bg-zebra-background-2">
              <div>
                <p className="text-[14px]">
                  {config.name}
                </p>
                <div>
                  <span>
                    {config.description}
                  </span>
                </div>
                {config.required && (
                  <div>
                    <span className="text-primary-600 dark:text-primary-400">
                      Obrigatório
                    </span>
                  </div>
                )}
              </div>
              <div>
                <PopoverTrigger asChild>
                  <button
                    className="text-primary-600 dark:text-primary-400"
                    onClick={() => handleTogglePopover(config.key)}
                  >
                    <InfoIcon />
                  </button>
                </PopoverTrigger>
              </div>
            </div>
            <PopoverContent
              onMouseEnter={() => handleMouseEnter(config.key)}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <div>
                  <span className="text-[14px]">Nome</span>
                  <span>{config.name}</span>
                </div>
                <div>
                  <span className="text-[14px]">Descrição</span>
                  <span>{config.description}</span>
                </div>
                <div>
                  <span className="text-[14px]">Obrigatório</span>
                  <span>{config.required ? "Sim" : "Não"}</span>
                </div>
                <div>
                  <span className="text-[14px]">Extensões permitidas</span>
                  <span>{config.allowedExtensions.join(", ")}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
};
