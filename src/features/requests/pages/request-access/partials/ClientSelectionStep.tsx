import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { CustomInput } from "../../../../../common/external/ui/custom-input.tsx";
import { TruncatedDescription } from "../../../../../common/components/TruncateDescription.tsx";
import { Check, MonitorIcon, Plus } from "lucide-react";
import { cn } from "../../../../../config/lib/utils.ts";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { ClientResponseInterface } from "../../../../client/common/model/client.model.ts";
import { useEffect, useState } from "react";
import { BasicFormFieldInterface, RequestFormFieldType } from "../RequestAccess.tsx";

interface ClientStepProps {
  form: BasicFormFieldInterface;
  clients: ClientResponseInterface[];
  selectedClient: string | null;
  handlerSelectedClient: (client: ClientResponseInterface) => void;
  isLargeScreen: boolean;
  isFormSubmitted?: boolean;
}

export const ClientStep = ({
  form,
  clients,
  handlerSelectedClient,
  isLargeScreen
}: ClientStepProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showError, setShowError] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const field: RequestFormFieldType = "clientId";
  const selectedClient = form[field].value;

  useEffect(() => {
    setShowError(!!form[field].error);
  }, [form[field].error]);

  const handleClientSelection = (client: ClientResponseInterface) => {
    setIsPopoverOpen(false);
    handlerSelectedClient(client);
  };

  return (
    <>
      <div className="space-y-1">
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Escolha o sistema que você precisa de acesso:</h4>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className={`max-w-full sm:max-w-md lg:max-w-96 w-full cursor-pointer ${selectedClient ? " text-primary " : ""}`}>

              <div
                className={cn(
                  "border border-dashed p-3 sm:p-4 lg:p-5 grid items-center min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] h-auto transition-all rounded-[var(--card-border-radius)] relative shadow-md",
                  selectedClient && "border-2 border-primary border-double rounded-[var(--card-border-radius)]",
                  showError && "border border-dashed border-red-500 rounded-[var(--card-border-radius)]"
                )}>
                {!selectedClient && !showError && <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-1 sm:mt-2 mx-auto text-gray-400" />}
                {!selectedClient && showError && <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-1 sm:mt-2 mx-auto text-red-500" />}
                {selectedClient && <Check className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
                {selectedClient &&
                  <>
                    <div className="flex flex-row items-center">
                      {selectedClient && <MonitorIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />}
                      <p className="font-bold text-sm sm:text-base lg:text-lg break-words">
                        {clients.find(client => client.clientId === selectedClient)?.name || selectedClient}
                      </p>
                    </div>

                    <TruncatedDescription
                      description={clients.find(client => client.clientId === selectedClient)?.description || "Sem função atribuída"} />
                  </>
                }
              </div>

              {showError && !selectedClient && (
                <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-4">Por favor, selecione um sistema</p>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isLargeScreen ? "right" : "bottom"}
            align={isLargeScreen ? "start" : "end"}
            className={cn(
              "w-[calc(100vw-2rem)] sm:w-[26em] p-3 sm:p-6",
              isLargeScreen && "ml-[20px]",
              !isLargeScreen && "mb-10"
            )}>
            <div className="relative">
              <CustomInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
                className="pl-10 pr-10 text-sm sm:text-base h-10"
              />
              {searchTerm && (
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm">
                  Você está pesquisando por: <strong>{searchTerm}</strong>
                </p>
              )}
            </div>

            <ScrollArea className="h-[250px] sm:h-[340px] mt-3 sm:mt-4 has-[>[data-state=visible]]:pr-4">
              <div className="space-y-2 grid grid-cols-1 gap-2">
                {clients
                  .filter((client) =>
                    (client.name || client.clientId).toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((client) => (
                    <div
                      key={client.id}
                      className={cn(
                        "border p-3 sm:p-5 grid items-center min-h-[80px] sm:min-h-[106px] h-auto cursor-pointer transition-all rounded-[var(--card-border-radius)] shadow-md",
                        selectedClient === client.clientId && "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
                      )}
                      onClick={() => handleClientSelection(client)}>

                      <div className="flex flex-row items-center">
                        <MonitorIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-4 flex-shrink-0" />
                        <p className="font-bold text-sm sm:text-lg break-words flex-1 min-w-0">
                          {client.name || client.clientId}
                        </p>
                        {selectedClient === client.clientId && <Check className="ml-2 flex-shrink-0 w-4 h-4 sm:w-6 sm:h-6" />}
                      </div>

                      <TruncatedDescription description={client.description} />
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
