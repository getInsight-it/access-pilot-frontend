import { Card } from "../../../../../components/ui/card.tsx";
import { ChevronRight, Globe } from "lucide-react";
import { ItemHierarchyInterface } from "../../../../level/common/types/item-hierarchy.model.ts";

interface RequestSphereProps {
  itemHierarchy?: ItemHierarchyInterface[];
}

const RequestSphere = ({ itemHierarchy }: RequestSphereProps) => {
  return (
    <div className="w-full">
      <p className="font-bold mb-3 text-lg md:text-xl">Esfera:</p>
      <Card
        className="bg-[(--system-card)] border-primary flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)] min-h-[170px]">
        <div className="flex flex-row items-center">
          <Globe className="w-6 h-6 mr-4" />
          <p className="font-bold text-lg md:text-xl">
            Educacional
          </p>
        </div>
        <div className="mt-2">
          {!itemHierarchy || itemHierarchy.length === 0 ? (
            <p className="text-base md:text-lg text-muted-foreground">
              Hierarquia de esferas não disponível.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {itemHierarchy.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-2">
                  <span
                    className={`text-base md:text-lg font-medium rounded px-2 py-1 ${
                      index === itemHierarchy.length - 1
                        ? "bg-primary/5 text-primary"
                        : "hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    }`}
                  >
                    {item.name}
                  </span>
                  {index < itemHierarchy.length - 1 && (
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RequestSphere;
