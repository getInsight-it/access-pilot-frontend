import { MonitorIcon as MonitorCog } from "lucide-react";
import { ShuffleLoader } from "../../../../../components/shuffle-loader/ShuffleLoader.tsx";
import TruncatedText from "../../../../../common/components/TruncatedText.tsx";

interface RequestSystemDescriptionProps {
  clientName?: string;
  clientDescription?: string;
  isContentLoading: boolean;
}

const RequestSystemDescription = ({
  clientName,
  clientDescription,
  isContentLoading
}: RequestSystemDescriptionProps) => {
  if (isContentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <ShuffleLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
      <div className="flex-shrink-0 mr-4">
        <MonitorCog size={20} className="text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex flex-col">
        <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
          {clientName || "Sistema não informado"}
        </p>
        <div className="mt-1 relative">
          <TruncatedText
            text={clientDescription}
            autoManage={true}
            maxLines={3}
            fontSize="text-sm font-normal text-gray-600 dark:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default RequestSystemDescription;
