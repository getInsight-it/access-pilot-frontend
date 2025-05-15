import { Card } from "../../../../../components/ui/card.tsx";
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
  return (
    <div className="w-full">
      <p className="font-bold mb-3 text-lg md:text-xl">Sistema:</p>
      <Card
        className="border-primary bg-[(--system-card)] p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] min-h-[170px]">
        <div className="flex flex-row items-center">
          <MonitorCog className="w-6 h-6 mr-4" />
          <p className="font-bold text-lg md:text-xl">
            {clientName}
          </p>
        </div>

        {isContentLoading ? (
          <div className="grid justify-center items-center">
            <ShuffleLoader />
          </div>
        ) : (
          <div className="mt-2 h-auto">
            <TruncatedText
              text={clientDescription}
              maxChars={150}
              fontSize="text-sm md:text-base"
              autoManage={true}
              maxLines={3}
              className="h-auto"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default RequestSystemDescription;