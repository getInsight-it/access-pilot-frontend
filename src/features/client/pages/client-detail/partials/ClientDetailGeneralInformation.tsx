import { ClientStatusBadgeFactory } from "@features/client/common/components/ClientStatusBadgeFactory";
import { ClientResponseInterface } from "@features/client/common/model/client.model";
import { ActivityIcon, FileTextIcon, GlobeIcon, SettingsIcon } from "lucide-react";


interface ClientDetailGeneralInformationProps {
  client: ClientResponseInterface;
}

export const ClientDetailGeneralInformation = ({
  client
}: ClientDetailGeneralInformationProps) => {
  return (
    <div>
      <div>
        <div className="bg-zebra-background-1">
          <div>
            <FileTextIcon size={20} />
          </div>
          <div>
            <p className="text-[14px]">
              Nome
            </p>
            <div>
              <div>
                <span>
                  {client?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zebra-background-1">
          <div>
            <GlobeIcon size={20} />
          </div>
          <div>
            <p className="text-[14px]">
              URL
            </p>
            <div>
              <div>
                <a
                  href={client?.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {client?.baseUrl || "-"}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zebra-background-1">
          <div>
            <SettingsIcon size={20} />
          </div>
          <div>
            <p className="text-[14px]">
              Gerenciado
            </p>
            <div>
              <span>
                {client?.managed ? "Sim" : "Não"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zebra-background-1">
          <div>
            <ActivityIcon size={20} />
          </div>
          <div>
            <p className="text-[14px]">
              Status
            </p>
            <div>
              {ClientStatusBadgeFactory(client.status!)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
