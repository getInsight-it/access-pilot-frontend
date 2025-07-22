import { ChevronRight, Globe } from "lucide-react";
import { ItemHierarchyInterface } from "../../../../level/common/types/item-hierarchy.model.ts";

interface RequestSphereProps {
  itemHierarchy?: ItemHierarchyInterface[];
}

const RequestSphere = ({ itemHierarchy }: RequestSphereProps) => {
  return (
    <div className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
      <div className="flex-shrink-0 mr-4">
        <Globe size={20} className="text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex flex-col">
        <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
          Hierarquia
        </p>
        <div className="mt-1">
          {!itemHierarchy || itemHierarchy.length === 0 ? (
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
              Hierarquia não disponível
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              {itemHierarchy.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-1">
                  <span
                    className={`text-sm font-normal ${
                      index === itemHierarchy.length - 1
                        ? "text-primary-600 dark:text-primary-400 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {item.name}
                  </span>
                  {index < itemHierarchy.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestSphere;
