
import { MonitorIcon } from "lucide-react";
import TruncatedText from "@components/TruncatedText.tsx";

interface ClientDetailDescriptionProps {
  clientId: string;
  description?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ClientDetailDescription = ({ clientId, description }: ClientDetailDescriptionProps) => {
  return (
    <div>
      <div className="bg-zebra-background-2">
        <div>
          <MonitorIcon size={20} />
        </div>
        <div>
          <p className="text-[14px]">
            {clientId}
          </p>
          <div>
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
