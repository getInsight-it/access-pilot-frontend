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
import { Input } from "../../../../common/external/ui/input.tsx";
import { Search } from "lucide-react";

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
  onHierarchyComplete?: (id: number, externalCode?: string) => void;
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
  const [searchTerms, setSearchTerms] = useState<Map<number, string>>(new Map());
  const [isSearching, setIsSearching] = useState<Map<number, boolean>>(new Map());

  const contentRefs = useRef<Map<number, HTMLElement | null>>(new Map());
  const lastItemRefs = useRef<Map<number, HTMLElement | null>>(new Map());
  const observersRef = useRef<Map<number, IntersectionObserver>>(new Map());
  const searchTimeoutRefs = useRef<Map<number, any>>(new Map());

  const handleSearch = useCallback((index: number, searchTerm: string) => {
    const existingTimeout = searchTimeoutRefs.current.get(index);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    setSearchTerms(prev => {
      const newMap = new Map(prev);
      newMap.set(index, searchTerm);
      return newMap;
    });

    setIsSearching(prev => {
      const newMap = new Map(prev);
      newMap.set(index, true);
      return newMap;
    });

    const timeout = setTimeout(async () => {
      try {
        if (index === 0) {
          const pageableItems = await levelService.getLevelItems(
            spheresData[index].sphere.id.toString(),
            1,
            subItemPageSize,
            "id",
            "ASC",
            searchTerm
          );

          setSpheresData(prev => {
            const data = [...prev];
            let items = pageableItems?.items || [];
            const total = pageableItems?.total || 0;

            const selectedValue = selectedValues[index];
            if (selectedValue && !items.some(item => item.name === selectedValue)) {
              const selectedItem = data[index].items.find(item => item.name === selectedValue);
              if (selectedItem) {
                items = [selectedItem as any, ...items];
              }
            }

            data[index] = {
              ...data[index],
              items: items,
              totalItems: total,
              hasMoreItems: total > items.length,
              actualPage: 1
            };
            return data;
          });
        } else if (index > 0 && spheresData[index - 1]?.selectedItemId) {
          const parentItemId = spheresData[index - 1].selectedItemId as number;
          const subitems = await levelService.getItemSubItems(
            spheresData[index].sphere.id,
            parentItemId,
            subItemPageSize,
            1,
            searchTerm
          );

          setSpheresData(prev => {
            const data = [...prev];
            let items = subitems?.items || [];
            const total = subitems?.total || 0;

            const selectedValue = selectedValues[index];
            if (selectedValue && !items.some(item => item.name === selectedValue)) {
              const selectedItem = data[index].items.find(item => item.name === selectedValue);
              if (selectedItem) {
                items = [selectedItem as any, ...items];
              }
            }

            data[index] = {
              ...data[index],
              items: items,
              totalItems: total,
              hasMoreItems: total > items.length,
              actualPage: 1
            };
            return data;
          });
        }
      } catch (error: any) {
        const errorMessage: string = formatErrorMessages(error.error);
        toast({
          title: "Erro ao buscar itens",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsSearching(prev => {
          const newMap = new Map(prev);
          newMap.set(index, false);
          return newMap;
        });
      }
    }, 500);

    searchTimeoutRefs.current.set(index, timeout);
  }, [spheresData, subItemPageSize, selectedValues]);

  const fetchInitialData = async () => {
    try {
      const spheres = await levelService.getLevelHierarchy(initialId);
      const fetchedSpheresData: DynamicSphereInterface[] = await Promise.all(
        spheres.map(async (sphere: any, index: number) => {
          if (index === 0) {
            const pageableItems = await levelService.getLevelItems(sphere.id);
            const items = pageableItems?.items || [];
            const total = pageableItems?.total || 0;
            return {
              sphere,
              items: items,
              hasMoreItems: total > items.length,
              actualPage: 1,
              totalItems: total,
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
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao buscar esferas",
        description: errorMessage,
        variant: "destructive"
      });
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
          tempItems = firstLevelItems?.items || [];
          totalItems = firstLevelItems?.total || 0;
        } else if (index > 0 && hierarchyMap.get(spheres[index - 1].id)) {
          const parentItem = hierarchyMap.get(spheres[index - 1].id);
          const subitems = await levelService.getItemSubItems(
            sphere.id,
            parentItem!.id,
            subItemPageSize
          );
          tempItems = subitems?.items || [];
          totalItems = subitems?.total || 0;
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

    if (!allFilled && hasEmittedValue) {
      onHierarchyNotCompleted?.();
      return;
    }

    if (onHierarchyComplete && allFilled && selectedValues.length) {

      const lastIdx = spheresData.length - 1;
      const selectedItem = spheresData[lastIdx]
        .items
        .find(item => item.name === selectedValues[spheresData.length - 1]);

      if (selectedItem) {
        setHasEmittedValue(true);
        onHierarchyComplete(selectedItem.id, selectedItem.externalCode || undefined);

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
      for (let i = index + 1; i < data.length; i++) {
        data[i] = "";
      }
      return data;
    });

    setSpheresData(prev => {
      const data = [...prev];
      for (let i = index + 1; i < data.length; i++) {
        data[i] = { ...data[i], items: [] };
      }
      return data;
    });

    if (hasError && onErrorClear) {
      onErrorClear();
    }

    if (index < spheresData.length - 1) {
      const currentSphereData = spheresData[index];
      const selectedItem = currentSphereData.items.find((item: any) => item.name === newValue);
      if (selectedItem) {
        try {
          const newPageableItems = await levelService.getItemSubItems(
            spheresData[index + 1].sphere.id,
            selectedItem.id,
            subItemPageSize
          );
          const items = newPageableItems?.items || [];
          const total = newPageableItems?.total || 0;
          setSpheresData(prev => {
            const data = [...prev];
            data[index] = { ...data[index], selectedItemId: selectedItem.id };
            data[index + 1] = {
              ...data[index + 1],
              items: items,
              totalItems: total,
              hasMoreItems: total > items.length,
              actualPage: 1
            };
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

    const currentSearchTerm = searchTerms.get(index) || "";

    if (spheresData[index].hasMoreItems) {
      if (index === 0) {
        if (index > 0 && !spheresData[index - 1]) return;

        const actualSphereData = spheresData[index];
        const actualSphereNextItemPage = actualSphereData.actualPage + 1;

        try {
          let itemResponse;
          if (index === 0) {
            itemResponse = await levelService.getLevelItems(
              actualSphereData.sphere.id.toString(),
              actualSphereNextItemPage,
              subItemPageSize,
              "id",
              "ASC",
              currentSearchTerm
            );
          } else {
            const parentSphereData = spheresData[index - 1];
            if (!parentSphereData.selectedItemId) return;

            itemResponse = await levelService.getItemSubItems(
              actualSphereData.sphere.id,
              parentSphereData.selectedItemId as number,
              subItemPageSize,
              actualSphereNextItemPage,
              currentSearchTerm
            );
          }

          const responseItems = itemResponse?.items || [];
          const responseTotal = itemResponse?.total || 0;

          setSpheresData(prev => {
            const data = [...prev];
            const existingIds = new Set(data[index].items.map(item => item.id));
            const newItems = responseItems.filter(item => !existingIds.has(item.id));

            data[index] = {
              ...data[index],
              actualPage: actualSphereNextItemPage,
              items: [...data[index].items, ...newItems] as any,
              hasMoreItems: (data[index].items.length + newItems.length) < responseTotal,
              totalItems: responseTotal
            };
            return data;
          });
        } catch (error: unknown) {
          const errorMessage: string = formatErrorMessages(error);
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
          actualSphere.id,
          selectedItem.id,
          subItemPageSize,
          actualSpherePageNextPage,
          currentSearchTerm
        );

        const resItems = res?.items || [];
        const resTotal = res?.total || 0;

        if (resItems.length > 0) {
          setSpheresData(prev => {
            const data = [...prev];
            const indexNumber = index;
            const actualSphereData = data[indexNumber];
            const existingIds = new Set(actualSphereData.items.map(item => item.id));
            const newItems = resItems.filter(item => !existingIds.has(item.id));

            data[indexNumber] = {
              ...actualSphereData,
              items: [...actualSphereData.items, ...newItems] as LevelSubItemInterface[],
              actualPage: actualSpherePageNextPage,
              hasMoreItems: (actualSphereData.items.length + newItems.length) < resTotal,
              totalItems: resTotal
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

      searchTimeoutRefs.current.forEach(timeout => {
        if (timeout) {
          clearTimeout(timeout);
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

  const handleSelectOpen = (index: number, isOpen: boolean) => {
    if (isOpen) {
      setActiveSelectIndex(index);
    } else {
      setSearchTerms(prev => {
        const newMap = new Map(prev);
        newMap.delete(index);
        return newMap;
      });
      if (searchTerms.get(index)) {
        handleSearch(index, "");
      }
    }
  };

  if (loading) {
    return <div>Carregando esferas...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const lastActiveSelectIndex = findLastActiveSelectIndex();

  return (
    <div className="flex flex-col space-y-8">
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
              onOpenChange={(open) => handleSelectOpen(index, open)}
            >
              <SelectTrigger className={cn(
                "w-full",
                shouldShowError && "border-red-500 ring-red-500"
              )}>
                <SelectValue className="text-black" placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent ref={setContentRef(index)}>
                <div className="px-2 py-2 border-b border-select-search-container-border sticky top-0 bg-select-search-container-background z-10">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Pesquisar..."
                      value={searchTerms.get(index) || ""}
                      onChange={(e) => handleSearch(index, e.target.value)}
                      className="pl-8 h-8 text-sm"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </div>
                </div>
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
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-gray-500">
                    {isSearching.get(index) ? "Buscando..." : "Nenhum item encontrado"}
                  </div>
                )}
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
