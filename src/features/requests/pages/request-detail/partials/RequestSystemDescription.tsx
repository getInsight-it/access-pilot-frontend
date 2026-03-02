import { MonitorIcon as MonitorCog } from "lucide-react";
import { ShuffleLoader } from "../../../../../common/components/loading/ShuffleLoader.tsx";
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
      <div>
        <ShuffleLoader />
      </div>
    );
  }

  return (
    <div>
      <div>
        <MonitorCog size={20} />
      </div>
      <div>
        <p>
          {clientName || "Sistema não informado"}
        </p>
        <div>
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
