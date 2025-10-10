import { useCallback, useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/external/ui/select.tsx";
import { levelService } from "../api/level-service.ts";
import { LevelInterface } from "../types/level.model.ts";
import { LevelItemInterface } from "../types/level-item.model.ts";
import { LevelSubItemInterface } from "../types/level-subitem.model.ts";
import { ItemHierarchyInterface } from "../types/item-hierarchy.model.ts";
import { Label } from "@radix-ui/react-label";
import { cn } from "../../../../config/lib/utils.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";
import { toast } from "../../../../common/external/ui/use-toast.ts";

interface DynamicSphereInterface {
  sphere: LevelInterface;
  items: LevelItemInterface[] | LevelSubItemInterface[];
  hasMoreItems: boolean;
  actualPage: number;
  totalItems: number;
  selectedItemId: string | number
}

interface DynamicSphereFormProps {
  initialId: any;
  onHierarchyComplete?: (complete: number) => void;
  onHierarchyNotCompleted?: () => void;
  limitFirst?: boolean;
  hasError?: boolean;
  onErrorClear?: () => void;
  simpleLabel?: boolean;
  codeItem?: string;
}

const DynamicSphereForm = ({
  initialId,
  onHierarchyComplete,
  onHierarchyNotCompleted,
  hasError = false,
  onErrorClear,
  simpleLabel = false,
  codeItem
}: DynamicSphereFormProps) => {
  const subItemPageSize = 25;
  const [spheresData, setSpheresData] = useState<DynamicSphereInterface[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHierarchyLoaded, setIsHierarchyLoaded] = useState(false);
  const [activeSelectIndex, setActiveSelectIndex] = useState<number | null>(null);
  const [hasEmittedValue, setHasEmittedValue] = useState(false);

  const contentRefs = useRef<Map<number, HTMLElement | null>>(new Map());
  const lastItemRefs = useRef<Map<number, HTMLElement | null>>(new Map());
  const observersRef = useRef<Map<number, IntersectionObserver>>(new Map());

  const fetchInitialData = async () => {
    try {
      const spheres = await levelService.getLevelHierarchy(initialId);
      const fetchedSpheresData: DynamicSphereInterface[] = await Promise.all(
        spheres.map(async (sphere: any, index: number) => {
          if(index === 0) {
            const pageableItems = await levelService.getLevelItems(sphere.id);
            return {
              sphere,
              items: pageableItems.items,
              hasMoreItems: pageableItems.total > pageableItems.items.length,
              actualPage: 1,
              totalItems: pageableItems.total,
              selectedItemId: ""
            };
          } else {
            return { sphere, items: [], hasMoreItems: true, actualPage: 1, totalItems: 0, selectedItemId: "" };
          }
        })
      );
      setSpheresData(fetchedSpheresData);
      setSelectedValues(new Array(fetchedSpheresData.length).fill(""));

      if (codeItem) {
        await loadItemHierarchy(codeItem, spheres);
      }
    } catch (err: any) {
      setError("Erro ao buscar esferas");
    } finally {
      setLoading(false);
    }
  };

  const loadItemHierarchy = async (itemCode: string, spheres: LevelInterface[]) => {
    try {
      if (!spheres || spheres.length === 0) return;

      const lastSphereId = spheres[spheres.length - 1].id;
      const hierarchyItems = await levelService.getItemHierarchy(lastSphereId, itemCode);

      if (!hierarchyItems || hierarchyItems.length === 0) return;

      const newSelectedValues = [...selectedValues];
      const hierarchyMap: Map<number, ItemHierarchyInterface> = new Map();

      hierarchyItems.forEach(item => {
        hierarchyMap.set(item.level.id, item);
      });

      const newSpheresData = await Promise.all(spheres.map(async (sphere: LevelInterface, index: number) => {
        const hierarchyItem = hierarchyMap.get(sphere.id);
        let tempItems: any[] = [];
        let totalItems = 0;
        let selectedId = "";

        if (index === 0) {
          const firstLevelItems = await levelService.getLevelItems(sphere.id.toString());
          tempItems = firstLevelItems.items;
          totalItems = firstLevelItems.total;
        } else if (index > 0 && hierarchyMap.get(spheres[index - 1].id)) {
          const parentItem = hierarchyMap.get(spheres[index - 1].id);
          const subitems = await levelService.getItemSubItems(
            sphere.id,
            parentItem!.id,
            subItemPageSize
          );
          tempItems = subitems.items;
          totalItems = subitems.total;
        }

        if (hierarchyItem) {
          const itemAlreadyExists = tempItems.some(item => item.id === hierarchyItem.id);
          if (!itemAlreadyExists) {
            tempItems = [...tempItems, {
              id: hierarchyItem.id,
              uuid: hierarchyItem.uuid,
              name: hierarchyItem.name,
              externalCode: hierarchyItem.externalCode
            }];
          }
          selectedId = hierarchyItem.id.toString();
          newSelectedValues[index] = hierarchyItem.name;
        }

        return {
          sphere,
          items: tempItems,
          hasMoreItems: tempItems.length < totalItems,
          actualPage: 1,
          totalItems,
          selectedItemId: selectedId
        };
      }));

      setSpheresData(newSpheresData);
      setSelectedValues(newSelectedValues);
      setIsHierarchyLoaded(true);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao carregar hierarquia de itens",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [initialId, codeItem]);

  useEffect(() => {
    const allFilled = selectedValues.every(val => val !== "");

    if(!allFilled && hasEmittedValue) {
      onHierarchyNotCompleted?.();
      return;
    }

    if(onHierarchyComplete && allFilled && selectedValues.length) {

      const lastIdx = spheresData.length - 1;
      const selectedItem = spheresData[lastIdx]
        .items
        .find(item => item.name === selectedValues[spheresData.length - 1]);

      if (selectedItem) {
        setHasEmittedValue(true);
        onHierarchyComplete(selectedItem.id);

        if (hasError && onErrorClear) {
          onErrorClear();
        }
      }
    }
  }, [selectedValues, onHierarchyComplete, hasError, onErrorClear, isHierarchyLoaded, spheresData]);

  const findLastActiveSelectIndex = () => {
    for (let i = spheresData.length - 1; i >= 0; i--) {
      if (i === 0 || (i > 0 && selectedValues[i - 1] !== "")) {
        return i;
      }
    }
    return 0;
  };

  const handleSelectChange = async (index: number, newValue: string) => {
    setSelectedValues(prev => {
      const data = [...prev];
      data[index] = newValue;
      for(let i = index + 1; i < data.length; i++) {
        data[i] = "";
      }
      return data;
    });

    setSpheresData(prev => {
      const data = [...prev];
      for(let i = index + 1; i < data.length; i++) {
        data[i] = { ...data[i], items: [] };
      }
      return data;
    });

    if (hasError && onErrorClear) {
      onErrorClear();
    }

    if(index < spheresData.length - 1) {
      const currentSphereData = spheresData[index];
      const selectedItem = currentSphereData.items.find((item: any) => item.name === newValue);
      if(selectedItem) {
        try {
          const newPageableItems = await levelService.getItemSubItems(
            spheresData[index + 1].sphere.id,
            selectedItem.id,
            subItemPageSize
          );
          setSpheresData(prev => {
            const data = [...prev];
            data[index] = { ...data[index], selectedItemId: selectedItem.id };
            data[index + 1] = { ...data[index + 1], items: newPageableItems.items, totalItems: newPageableItems.total };
            return data;
          });
        } catch (error: any) {
          const errorMessage: string = formatErrorMessages(error.error);
          toast({
            title: "Erro ao buscar itens filho",
            description: errorMessage,
            variant: "destructive"
          });
        }
      }
    }
  };

  const loadMoreSubItems = async (index: number) => {
    if (!spheresData || index < 0 || index >= spheresData.length) return;

    if(spheresData[index].hasMoreItems) {
      if(index === 0) {
        if (index > 0 && !spheresData[index - 1]) return;

        const actualSphereData = spheresData[index];
        const actualSphereNextItemPage = actualSphereData.actualPage + 1;

        try {
          let itemResponse;
          if (index === 0) {
            itemResponse = await levelService.getLevelItems(
              actualSphereData.sphere.id.toString(),
              actualSphereNextItemPage
            );
          } else {
            const parentSphereData = spheresData[index - 1];
            if (!parentSphereData.selectedItemId) return;

            itemResponse = await levelService.getItemSubItems(
              actualSphereData.sphere.id,
              parentSphereData.selectedItemId as number,
              actualSphereNextItemPage
            );
          }

          setSpheresData(prev => {
            const data = [...prev];
            const existingIds = new Set(data[index].items.map(item => item.id));
            const newItems = itemResponse.items.filter(item => !existingIds.has(item.id));

            data[index] = {
              ...data[index],
              actualPage: actualSphereNextItemPage,
              items: [...data[index].items, ...newItems] as any,
              hasMoreItems: (data[index].items.length + newItems.length) < itemResponse.total,
              totalItems: itemResponse.total
            };
            return data;
          });
        } catch (error: any) {
          const errorMessage: string = formatErrorMessages(error.error);
          toast({
            title: "Erro ao buscar mais itens",
            description: errorMessage,
            variant: "destructive"
          });
        }

        return;
      }

      try {
        if (!spheresData[index - 1] || !spheresData[index]) return;

        const { items } = spheresData[index - 1];
        const { sphere: actualSphere } = spheresData[index];
        const parentSelecetedItemName = selectedValues[index - 1];

        if (!parentSelecetedItemName || !items || items.length === 0) return;

        const selectedItem = items.find(i => i.name === parentSelecetedItemName);

        if (!selectedItem) return;

        const actualSpherePageNextPage = spheresData[index].actualPage + 1;
        const res = await levelService.getItemSubItems(
          actualSphere.id, selectedItem.id, subItemPageSize, actualSpherePageNextPage
        );

        if(res.items?.length > 0) {
          setSpheresData(prev => {
            const data = [...prev];
            const indexNumber = index;
            const actualSphereData = data[indexNumber];
            const existingIds = new Set(actualSphereData.items.map(item => item.id));
            const newItems = res.items.filter(item => !existingIds.has(item.id));

            data[indexNumber] = {
              ...actualSphereData,
              items: [...actualSphereData.items, ...newItems] as LevelSubItemInterface[],
              actualPage: actualSpherePageNextPage,
              hasMoreItems: (actualSphereData.items.length + newItems.length) < res.total,
              totalItems: res.total
            };
            return data;
          });
        }
      } catch (error: any) {
        const errorMessage: string = formatErrorMessages(error.error);
        toast({
          title: "Erro ao buscar itens filho",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const setupObserver = (index: number) => {
    if (observersRef.current.has(index)) {
      observersRef.current.get(index)?.disconnect();
    }

    const contentElement = contentRefs.current.get(index);
    const lastItemElement = lastItemRefs.current.get(index);

    if (!contentElement || !lastItemElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && spheresData && index < spheresData.length) {
          loadMoreSubItems(index);
        }
      },
      { root: contentElement, threshold: 1.0 }
    );

    observer.observe(lastItemElement);
    observersRef.current.set(index, observer);
  };

  useEffect(() => {
    return () => {
      observersRef.current.forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);

  useEffect(() => {
    if (activeSelectIndex !== null && spheresData && spheresData.length > 0) {
      setupObserver(activeSelectIndex);
    }
  }, [spheresData, activeSelectIndex]);
  const setContentRef = useCallback((index: number) => (node: HTMLElement | null) => {
    contentRefs.current.set(index, node);

    if (node && spheresData && index < spheresData.length) {
      setupObserver(index);
    }
  }, [spheresData]);

  const setLastItemRef = useCallback((index: number, isLastItem: boolean) => (node: HTMLElement | null) => {
    if (isLastItem) {
      lastItemRefs.current.set(index, node);

      if (node && contentRefs.current.get(index) && spheresData && index < spheresData.length) {
        setupObserver(index);
      }
    }
  }, [spheresData]);

  const handleSelectOpen = (index: number) => {
    setActiveSelectIndex(index);
  };

  if(loading) {
    return <div>Carregando esferas...</div>;
  }

  if(error) {
    return <div>Erro: {error}</div>;
  }

  const lastActiveSelectIndex = findLastActiveSelectIndex();

  return (
    <div className="flex flex-col space-y-4">
      {spheresData.map(({ sphere, items, totalItems }, index) => {
        const isLastActiveSelect = index === lastActiveSelectIndex;
        const shouldShowError = hasError && isLastActiveSelect;

        return (
          <div key={sphere.id} className="flex flex-col gap-1">
            <Label className={cn(
              "flex flex-row justify-between",
              shouldShowError && "text-red-500"
            )}>
              <span className="text-sm font-medium">
                {!simpleLabel && 'Selecione um item para a esfera de nível'} {sphere.name}:
                {shouldShowError && <span className="text-red-500 ml-1">*</span>}
              </span>
              <span className="text-xs font-normal text-gray-500">({totalItems} itens encontrados)</span>
            </Label>
            <Select
              disabled={index > 0 && !selectedValues[index - 1]}
              onValueChange={(value: string) => handleSelectChange(index, value)}
              value={selectedValues[index]}
              onOpenChange={(open) => {
                if (open) {
                  handleSelectOpen(index);
                }
              }}
            >
              <SelectTrigger className={cn(
                "w-full",
                shouldShowError && "border-red-500 ring-red-500"
              )}>
                <SelectValue className="text-black" placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent ref={setContentRef(index)}>
                {items?.length > 0 ? (
                  items.map((item, idx) => {
                    const isLastItem = idx === items.length - 1;
                    return (
                      <SelectItem
                        key={item.id}
                        value={item.name}
                        data-level-index={index}
                        ref={setLastItemRef(index, isLastItem)}>
                        {item.name}
                      </SelectItem>
                    );
                  })
                ) : null}
              </SelectContent>
            </Select>
            {shouldShowError && (
              <p className="text-red-500 text-xs mt-1">Este campo é obrigatório</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicSphereForm;
