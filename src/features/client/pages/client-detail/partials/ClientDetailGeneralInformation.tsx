import { Card } from "../../../../../components/ui/card";
import { ClientResponseInterface } from "../../../common/model/client.model.ts";
import TrafficLight from "../../../../../components/TrafficLights.tsx";

interface ClientDetailGeneralInformationProps {
  client: ClientResponseInterface;
  expandedFields: Set<string>;
  onToggleExpand: (key: string) => void;
}

export const ClientDetailGeneralInformation = ({
  client,
  expandedFields,
  onToggleExpand
}: ClientDetailGeneralInformationProps) => {
  return (
    <div>
      <p className="font-bold mb-3 text-lg">Informações gerais:</p>
      <Card className="border-primary p-6 bg-[var(--system-card)] max-h-[240px] overflow-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">Nome:</p>
              <div className="truncate overflow-hidden">
                <p className={expandedFields.has('name') ? '' : 'truncate'}>
                  {client?.name}
                </p>
                {client?.name && client.name.length > 30 && (
                  <span
                    className="text-xs text-primary cursor-pointer"
                    onClick={() => onToggleExpand('name')}>
                    {expandedFields.has('name') ? 'Ver menos' : 'Ver mais'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">URL:</p>
              <div className="truncate overflow-hidden">
                <p className={expandedFields.has('url') ? '' : 'truncate'}>
                  {client?.baseUrl ? client?.baseUrl : "-"}
                </p>
                {client?.baseUrl && client.baseUrl.length > 30 && (
                  <span
                    className="text-xs text-primary cursor-pointer"
                    onClick={() => onToggleExpand('url')}>
                    {expandedFields.has('url') ? 'Ver menos' : 'Ver mais'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">Gerenciado:</p>
              <p>{client?.managed ? "Sim" : "Não"}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">Status:</p>
              <TrafficLight managed={client?.managed ?? false} published={client?.status === "PUBLISHED"} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
