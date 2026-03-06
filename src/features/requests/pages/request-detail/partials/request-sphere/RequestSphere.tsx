import { ChevronRight, Globe } from "lucide-react";
import { ItemHierarchyInterface } from "../../../../../level/common/types/item-hierarchy.model.ts";
import "./request-sphere.scss";

interface RequestSphereProps {
  itemHierarchy?: ItemHierarchyInterface[];
}

const RequestSphere = ({ itemHierarchy }: RequestSphereProps) => {
  const hasHierarchy = Boolean(itemHierarchy && itemHierarchy.length > 0);

  return (
    <div className="request-sphere">
      <div className="request-sphere__header">
        <div className="request-sphere__icon-box">
          <Globe className="request-sphere__icon" />
        </div>
        <h3 className="request-sphere__title">Hierarquia</h3>
      </div>

      <div className="request-sphere__content">
        {!hasHierarchy ? (
          <div className="request-sphere__empty-state">
            Nenhuma hierarquia encontrada para esta solicitação
          </div>
        ) : (
          <div className="request-sphere__trail">
            {itemHierarchy?.map((item, index) => (
              <div key={item.id || index} className="request-sphere__trail-item">
                <span className="request-sphere__trail-label">{item.name}</span>
                {index < itemHierarchy.length - 1 && (
                  <ChevronRight className="request-sphere__trail-separator" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestSphere;
