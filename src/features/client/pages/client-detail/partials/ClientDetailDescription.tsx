
import { MonitorIcon } from "lucide-react";
import TruncatedText from "../../../../../common/components/TruncatedText.tsx";

interface ClientDetailDescriptionProps {
  clientId: string;
  description?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ClientDetailDescription = ({ clientId, description }: ClientDetailDescriptionProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-start border bg-zebra-background-2 rounded-[12px] p-4">
        <div className="flex-shrink-0 mr-4">
          <MonitorIcon size={20} />
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
            {clientId}
          </p>
          <div className="mt-1 relative">
            <TruncatedText
              text={description}
              autoManage={true}
              maxLines={3}
              fontSize="text-sm font-normal text-gray-600 dark:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
