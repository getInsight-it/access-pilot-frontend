import { InfoIcon } from "lucide-react";
import { AttachmentConfigurationInterface } from "../../../common/model/configuration.model.ts";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { useState } from "react";

interface ClientDetailConfigurationsProps {
  configurations: AttachmentConfigurationInterface[];
  truncateText: (text: string, maxLength: number) => string;
}

export const ClientDetailConfigurations = ({
  configurations
}: ClientDetailConfigurationsProps) => {
  if(!configurations || configurations.length === 0) {
    return null;
  }

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

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {configurations.map((config: AttachmentConfigurationInterface) => (
          <Popover key={config.key} open={openPopoverId === config.key}>
            <div
              className="flex flex-row items-start border bg-zebra-background-2 rounded-[12px] p-4 relative">
              <div className="flex flex-col flex-grow">
                <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300 line-clamp-1 pr-8">
                  {config.name}
                </p>
                <div className="mt-1">
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 line-clamp-2">
                    {config.description}
                  </span>
                </div>
                {config.required && (
                  <div>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                      Obrigatório
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <PopoverTrigger asChild>
                  <button
                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                    onClick={() => handleTogglePopover(config.key)}
                  >
                    <InfoIcon className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
              </div>
            </div>
            <PopoverContent
              className="w-100 max-w-[500px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
              onMouseEnter={() => handleMouseEnter(config.key)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Nome</span>
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{config.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Descrição</span>
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{config.description}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Obrigatório</span>
                  <span
                    className="text-sm font-normal text-gray-600 dark:text-gray-400">{config.required ? "Sim" : "Não"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Extensões permitidas</span>
                  <span
                    className="text-sm font-normal text-gray-600 dark:text-gray-400">{config.allowedExtensions.join(", ")}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
};
