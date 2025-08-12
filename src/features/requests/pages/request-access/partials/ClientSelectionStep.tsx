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
        <h4 className="text-lg font-semibold mb-4">Escolha o sistema que você precisa de acesso:</h4>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className={`max-w-96 w-full cursor-pointer ${selectedClient ? " text-primary " : ""}`}>

              <div
                className={cn(
                  "border border-dashed p-5 grid items-center min-h-[120px] h-auto transition-all rounded-[var(--card-border-radius)] relative shadow-md",
                  selectedClient && "border-2 border-primary border-double rounded-[var(--card-border-radius)]",
                  showError && "border border-dashed border-red-500 rounded-[var(--card-border-radius)]"
                )}>
                {!selectedClient && !showError && <Plus className="w-8 h-8 mt-2 mx-auto text-gray-400" />}
                {!selectedClient && showError && <Plus className="w-8 h-8 mt-2 mx-auto text-red-500" />}
                {selectedClient && <Check className="absolute top-4 right-4 flex-shrink-0" />}
                {selectedClient &&
                  <>
                    <div className="flex flex-row items-center">
                      {selectedClient && <MonitorIcon className="w-6 h-6 mr-4" />}
                      <p className="font-bold text-lg">
                        {selectedClient}
                      </p>
                    </div>

                    <TruncatedDescription
                      description={clients.find(client => client.clientId === selectedClient)?.description || "Sem função atribuída"} />
                  </>
                }
              </div>

              {showError && !selectedClient && (
                <p className="text-red-500 text-sm mt-4">Por favor, selecione um sistema</p>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isLargeScreen ? "right" : "bottom"}
            align={isLargeScreen ? "start" : "end"}
            className={`
                  w-[26em]
                  ${isLargeScreen ? "ml-[20px]" : ""}
                  ${isLargeScreen ? "" : " mb-10"}
                `}>
            <div className="relative">
              <CustomInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <p className="mt-4">
                  Você está pesquisando por: <strong>{searchTerm}</strong>
                </p>
              )}
            </div>

            <ScrollArea className="h-[340px] mt-4 px-2">
              <div className="space-y-2 grid grid-cols-1 gap-2 px-2">
                {clients
                  .filter((client) =>
                    client.clientId.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((client) => (
                    <div
                      key={client.id}
                      className={cn(
                        "border p-5 grid items-center min-h-[106px] h-auto cursor-pointer transition-all rounded-[var(--card-border-radius)] shadow-md",
                        selectedClient === client.clientId && "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
                      )}
                      onClick={() => handleClientSelection(client)}>

                      <div className="flex flex-row items-center">
                        <MonitorIcon className="w-6 h-6 mr-4" />
                        <p className="font-bold text-lg">
                          {client.clientId}
                        </p>
                        {selectedClient === client.clientId && <Check className="ml-auto top-4 right-4 flex-shrink-0" />}
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
