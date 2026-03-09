import React, { useMemo, useState } from "react";
import { Check, LaptopMinimal, Search } from "lucide-react";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import "./request-system-step.scss";

interface RequestSystemStepProps {
  clients: ClientResponseInterface[];
  selectedClientId: string | null;
  errorMessage?: string | null;
  onSelectClient: (client: ClientResponseInterface) => void;
}

export const RequestSystemStep: React.FC<RequestSystemStepProps> = ({
  clients,
  selectedClientId,
  errorMessage,
  onSelectClient
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const clientName = (client.name || "").toLowerCase();
      const clientId = (client.clientId || "").toLowerCase();
      return clientName.includes(normalizedSearch) || clientId.includes(normalizedSearch);
    });
  }, [clients, searchTerm]);

  return (
    <div className="request-system-step">
      <div className="request-system-step__filter">
        <div className="app-input-group app-input-group--icon-left">
          <Search className="app-input-group__icon" />
          <input
            className="app-input request-system-step__search-input"
            placeholder="Filtrar sistemas"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {errorMessage && (
        <p className="request-system-step__error">{errorMessage}</p>
      )}

      <div className="request-system-step__grid">
        {filteredClients.map((client) => {
          const isActive = selectedClientId === client.clientId;
          return (
            <button
              key={client.clientId}
              type="button"
              className={`request-system-step__card${isActive ? " request-system-step__card--active" : ""}`}
              onClick={() => onSelectClient(client)}
            >
              <div className="request-system-step__card-main">
                <div className="request-system-step__icon-box">
                  <LaptopMinimal className="request-system-step__icon" />
                </div>

                <div className="request-system-step__card-text">
                  <p className="request-system-step__name">{client.name || client.clientId}</p>
                  <p className="request-system-step__description">{client.description || "Sem descrição disponível."}</p>
                </div>
              </div>

              {isActive && (
                <span className="request-system-step__selected-indicator">
                  <Check className="request-system-step__selected-icon" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <p className="request-system-step__empty-state">Nenhum sistema encontrado para este filtro.</p>
      )}
    </div>
  );
};
