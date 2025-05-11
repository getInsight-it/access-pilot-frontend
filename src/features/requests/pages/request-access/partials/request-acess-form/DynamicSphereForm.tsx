import { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select.tsx";
import { levelService } from "../../../../../level/common/api/level-service.ts";
import { LevelInterface } from "../../../../../level/common/types/level.model.ts";
import { LevelItemInterface } from "../../../../../level/common/types/level-item.model.ts";
import { LevelSubItemInterface } from "../../../../../level/common/types/level-subitem.model.ts";
import { Label } from "@radix-ui/react-label";

interface DynamicSphereInterface {
  sphere: LevelInterface;
  items: LevelItemInterface[] | LevelSubItemInterface[];
  hasMoreItems: boolean;
  actualPage: number;
  totalItems: number;
}

interface DynamicSphereFormProps {
  initialId: any;
  onHierarchyComplete?: (complete: number) => void;
  limitFirst?: boolean
}

const DynamicSphereForm = ({ initialId, onHierarchyComplete }: DynamicSphereFormProps) => {
  const subItemPageSize = 10;
  const [spheresData, setSpheresData] = useState<DynamicSphereInterface[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              totalItems: pageableItems.total
            };
          } else {
            return { sphere, items: [], hasMoreItems: true, actualPage: 1, totalItems: 0 };
          }
        })
      );
      setSpheresData(fetchedSpheresData);
      setSelectedValues(new Array(fetchedSpheresData.length).fill(""));
    } catch (err: any) {
      setError("Erro ao buscar esferas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [initialId]);

  useEffect(() => {
    const allFilled = selectedValues.every(val => val !== "");
    if(onHierarchyComplete && allFilled && selectedValues.length) {
      const lastIdx = spheresData.length - 1
      const itemId = spheresData[lastIdx]
        .items
        .find(item => item.name === selectedValues[spheresData.length - 1])!
        .id
      onHierarchyComplete(itemId);
    }
  }, [selectedValues, onHierarchyComplete]);

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

    if(index < spheresData.length - 1) {
      const currentSphereData = spheresData[index];
      const selectedItem = currentSphereData.items.find((item: any) => item.name === newValue);
      if(selectedItem) {
        try {
          const newPageableItems = await levelService.getItemSubItems(
            currentSphereData.sphere.id,
            selectedItem.id,
            subItemPageSize
          );
          setSpheresData(prev => {
            const data = [...prev];
            data[index + 1] = { ...data[index + 1], items: newPageableItems.items, totalItems: newPageableItems.total };
            return data;
          });
        } catch (err) {
          console.error("Erro ao buscar subitems:", err);
        }
      }
    }
  };

  const loadMoreSubItems = async (index: number) => {
    if(spheresData[index].hasMoreItems) {
      if(index === 0) {
        const actualSphereData = spheresData[index];
        const actualSphereNextItemPage = actualSphereData.actualPage + 1;
        const itemResponse = await levelService.getLevelItems(
          actualSphereData.sphere.id.toString(),
          actualSphereNextItemPage
        );
        setSpheresData(prev => {
          const data = [...prev];
          data[index] = {
            ...data[index],
            actualPage: actualSphereNextItemPage,
            items: [...data[index].items, ...itemResponse.items],
            hasMoreItems: (data[index].items.length + itemResponse.items.length) < itemResponse.totalItems,
            totalItems: itemResponse.totalItems
          };
          return data;
        });

        return;
      }

      try {
        const { sphere, items } = spheresData[index - 1];
        const parentSelecetedItemName = selectedValues[index - 1];
        const selectedItem = items.find(i => i.name === parentSelecetedItemName);
        const actualSpherePageNextPage = spheresData[index].actualPage + 1;
        const res = await levelService.getItemSubItems(sphere.id, selectedItem!.id, subItemPageSize, actualSpherePageNextPage);

        setSpheresData(prev => {
          const data = [...prev];
          const indexNumber = index;
          const actualSphereData = data[indexNumber];

          data[indexNumber] = {
            ...actualSphereData,
            items: [...actualSphereData.items, ...res.items] as LevelSubItemInterface[],
            actualPage: actualSpherePageNextPage,
            hasMoreItems: (actualSphereData.items.length + res.items.length) < res.total,
            totalItems: res.total
          };
          return data;
        });
      } catch (err) {
        console.error("Erro ao buscar subitems:", err);
      }
    }
  };

  const [contentNode, setContentNode] = useState<HTMLElement | null>(null);
  const [lastSelectItemNode, setLastSelectItemNode] = useState<HTMLElement | null>(null);
  const contentRef = useCallback((node: HTMLElement | null) => { setContentNode(node) }, []);
  const lastSelectItemNodeRef = useCallback((node: HTMLElement | null) => { setLastSelectItemNode(node) }, []);

  useEffect(() => {
    if(!contentNode || !lastSelectItemNode) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting) {
          loadMoreSubItems(Number(lastSelectItemNode.dataset.levelIndex));
        }
      },
      { root: contentNode, threshold: 1.0 }
    );
    observer.observe(lastSelectItemNode);
    return () => observer.disconnect();
  }, [contentNode, lastSelectItemNode]);

  if(loading) {
    return <div>Carregando esferas...</div>;
  }

  if(error) {
    return <div>Erro: {error}</div>;
  }

  //TODO ao retornar com o estado adicionar value ao select e nas opções adicionar apenas a opção selecionada
  return (
    <div className="flex flex-col space-y-4">
      {spheresData.map(({ sphere, items, totalItems }, index) => (
        <div key={sphere.id} className="flex flex-col gap-1">
          <Label className="flex flex-row justify-between">
            <span className="text-sm font-medium">Selecione um item para a esfera de nível {sphere.name}:</span>
            <span className="text-xs font-normal text-gray-500">({totalItems} itens encontrados)</span>
          </Label>
          <Select
            disabled={index > 0 && !selectedValues[index - 1]}
            onValueChange={(value: string) => handleSelectChange(index, value)}>
            <SelectTrigger className="w-full">
              <SelectValue className="text-black" placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent ref={contentRef}>
              {items.length > 0 ? (
                items.map((item, idx) => {
                  return (
                    <SelectItem
                      key={item.id}
                      value={item.name}
                      data-level-index={index}
                      ref={idx === items.length - 1 ? lastSelectItemNodeRef : null}>{item.name}
                    </SelectItem>
                  );
                })
              ) : (<SelectItem value="empty">Carregando itens...</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default DynamicSphereForm;
