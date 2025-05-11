import { MonitorIcon } from "lucide-react";
import { CardShine } from "../../../../../components/CardShine.tsx";
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
      <p className="font-bold mb-3 text-lg">Sistema:</p>
      <CardShine>
        <div className="ring-2 ring-primary p-5 grid items-center h-auto max-h-[240px] transition-all rounded-[var(--card-border-radius)]">
          <div className="flex flex-row items-center">
            <MonitorIcon className="w-6 h-6 mr-4 flex-shrink-0" />
            <p className="font-bold text-lg truncate">
              {clientId}
            </p>
          </div>
          <div className="mt-1 text-sm relative">
            {description ? (
              <TruncatedText
                text={description}
                autoManage={true}
                maxLines={3}
                fontSize="text-sm"
              />
            ) : (
              "Sem função atribuída"
            )}
          </div>
        </div>
      </CardShine>
    </div>
  );
};
