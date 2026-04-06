import React, { useMemo, useState } from "react";
import { Check, LaptopMinimal, Search } from "lucide-react";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./request-system-step.scss";

interface RequestSystemStepProps {
  clients: ClientResponseInterface[];
  selectedClientId: string | null;
  errorMessage?: string | null;
  onSelectClient: (client: ClientResponseInterface) => void;
  readOnly?: boolean;
}

export const RequestSystemStep: React.FC<RequestSystemStepProps> = ({
  clients,
  selectedClientId,
  errorMessage,
  onSelectClient,
  readOnly = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useI18n();

  const filteredClients = useMemo(() => {
    if (readOnly) {
      return clients;
    }

    return clients.filter((client) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const clientName = (client.name || "").toLowerCase();
      const clientId = (client.clientId || "").toLowerCase();
      return clientName.includes(normalizedSearch) || clientId.includes(normalizedSearch);
    });
  }, [clients, readOnly, searchTerm]);

  return (
    <div className="request-system-step">
      {!readOnly && (
        <div className="request-system-step__filter">
          <div className="app-input-group app-input-group--icon-left">
            <Search className="app-input-group__icon" />
            <input
              className="app-input request-system-step__search-input"
              placeholder={t("Filtrar sistemas")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      )}

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
              className={`request-system-step__card${isActive ? " request-system-step__card--active" : ""}${readOnly ? " request-system-step__card--locked" : ""}`}
              onClick={() => onSelectClient(client)}
              disabled={readOnly}
            >
              <div className="request-system-step__card-main">
                <div className="request-system-step__icon-box">
                  <LaptopMinimal className="request-system-step__icon" />
                </div>

                <div className="request-system-step__card-text">
                  <p className="request-system-step__name">{client.name || client.clientId}</p>
                  <p className="request-system-step__description">{client.description || t("Sem descrição disponível.")}</p>
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
        <p className="request-system-step__empty-state">{t("Nenhum sistema encontrado para este filtro.")}</p>
      )}
    </div>
  );
};
