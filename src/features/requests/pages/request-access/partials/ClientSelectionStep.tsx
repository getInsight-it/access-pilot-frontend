import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { CustomInput } from "../../../../../common/external/ui/custom-input.tsx";
import { TruncatedDescription } from "../../../../../common/components/TruncateDescription.tsx";
import { Check, MonitorIcon, Plus } from "lucide-react";
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
      <div>
        <h4>Escolha o sistema que você precisa de acesso:</h4>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div>

              <div>
                {!selectedClient && !showError && <Plus />}
                {!selectedClient && showError && <Plus />}
                {selectedClient && <Check />}
                {selectedClient &&
                  <>
                    <div>
                      {selectedClient && <MonitorIcon />}
                      <p>
                        {clients.find(client => client.clientId === selectedClient)?.name || selectedClient}
                      </p>
                    </div>

                    <TruncatedDescription
                      description={clients.find(client => client.clientId === selectedClient)?.description || "Sem função atribuída"} />
                  </>
                }
              </div>

              {showError && !selectedClient && (
                <p>Por favor, selecione um sistema</p>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isLargeScreen ? "right" : "bottom"}
            align={isLargeScreen ? "start" : "end"}>
            <div>
              <CustomInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
              />
              {searchTerm && (
                <p>
                  Você está pesquisando por: <strong>{searchTerm}</strong>
                </p>
              )}
            </div>

            <ScrollArea>
              <div>
                {clients
                  .filter((client) =>
                    (client.name || client.clientId).toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleClientSelection(client)}>

                      <div>
                        <MonitorIcon />
                        <p>
                          {client.name || client.clientId}
                        </p>
                        {selectedClient === client.clientId && <Check />}
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
