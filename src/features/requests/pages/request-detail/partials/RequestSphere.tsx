import { ChevronRight, Globe } from "lucide-react";
import { ItemHierarchyInterface } from "../../../../level/common/types/item-hierarchy.model.ts";

interface RequestSphereProps {
  itemHierarchy?: ItemHierarchyInterface[];
}

const RequestSphere = ({ itemHierarchy }: RequestSphereProps) => {
  return (
    <div>
      <div>
        <Globe size={20} />
      </div>
      <div>
        <p>
          Hierarquia
        </p>
        <div>
          {!itemHierarchy || itemHierarchy.length === 0 ? (
            <span>
              Nenhuma hierarquia encontrada para esta solicitação
            </span>
          ) : (
            <div>
              {itemHierarchy.map((item, index) => (
                <div key={item.id || index}>
                  <span>
                    {item.name}
                  </span>
                  {index < itemHierarchy.length - 1 && (
                    <ChevronRight />
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
