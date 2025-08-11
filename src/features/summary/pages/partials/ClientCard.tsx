import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import { LaptopMinimal, Plus, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../../../../common/external/ui/button.tsx";
import TruncatedText from "../../../../common/components/TruncatedText.tsx";

interface ClientCardProps {
  client: ClientResponseInterface;
  hasAccess: boolean;
  onActionClick?: () => void;
}

export const ClientCard = ({ client, hasAccess, onActionClick }: ClientCardProps) => (
  <div className={`bg-white border border-md flex flex-${hasAccess ? 'row' : 'col'} justify-between p-3 hover:bg-gray-50 max-w-96 rounded-lg mb-${hasAccess ? '2' : '4'} ${!hasAccess ? 'gap-3' : ''} ${hasAccess ? 'items-center' : ''}`}>
    <div className="flex flex-row gap-3 items-center">
      <div className={`min-w-9 min-h-9 max-h-9 flex items-center justify-center ${hasAccess ? 'bg-success-100' : 'bg-warning-100'} rounded-full`}>
        <LaptopMinimal size={16} className={hasAccess ? 'text-success-600' : 'text-warning-600'} />
      </div>
      <div className="flex flex-col justify-between">
        <span className="text-xs font-medium text-gray-900">
          {client.name}
        </span>
        <span className="text-xs text-gray-500">
          <TruncatedText
            text={client.description || 'Sistema disponível'}
            autoManage={true}
            maxLines={2}
            fontSize="text-sm font-normal text-gray-600 dark:text-gray-400"
          />
        </span>
      </div>
    </div>
    {hasAccess ? (
      <div onClick={onActionClick} className="flex items-center justify-center border border-blue-500 rounded-md min-h-[28px] min-w-[28px] max-h-[28px] cursor-pointer">
        <SquareArrowOutUpRight size={16} className="text-blue-500" />
      </div>
    ) : (
      <div className="flex w-full justify-end items-center">
        <Button variant="ghost" className="flex items-center gap-2" onClick={onActionClick}>
          <Plus size={16} className="text-blue-500" />
          <span className="text-primary-600">Solicitar acesso</span>
        </Button>
      </div>
    )}
  </div>
);
