import { ClientResponseInterface } from "../../../common/model/client.model.ts";
import { ActivityIcon, FileTextIcon, GlobeIcon, SettingsIcon } from "lucide-react";
import { ClientStatusBadgeFactory } from "../../../common/components/ClientStatusBadgeFactory.tsx";

interface ClientDetailGeneralInformationProps {
  client: ClientResponseInterface;
}

export const ClientDetailGeneralInformation = ({
  client
}: ClientDetailGeneralInformationProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <FileTextIcon size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              Nome
            </p>
            <div className="mt-1 relative">
              <div className="break-words">
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  {client?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <GlobeIcon size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              URL
            </p>
            <div className="mt-1 relative">
              <div className="break-words">
                <a
                  href={client?.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-normal text-blue-500 underline hover:text-blue-600"
                >
                  {client?.baseUrl || "-"}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <SettingsIcon size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              Gerenciado
            </p>
            <div className="mt-1">
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {client?.managed ? "Sim" : "Não"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <ActivityIcon size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              Status
            </p>
            <div className="mt-1">
              {ClientStatusBadgeFactory(client.status!)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
