import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { ChevronDown, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../../common/external/ui/dropdown-menu.tsx";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { cn } from "../../../../config/lib/utils.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";
import { useI18n } from "../../../../common/context/i18n/I18nContext.tsx";
import { levelService } from "../api/level-service.ts";
import { ItemHierarchyInterface } from "../types/item-hierarchy.model.ts";
import { LevelInterface } from "../types/level.model.ts";
import { LevelItemInterface } from "../types/level-item.model.ts";
import { LevelSubItemInterface } from "../types/level-subitem.model.ts";
import "./dynamic-sphere-form.scss";

interface DynamicSphereInterface {
  sphere: LevelInterface;
  items: LevelItemInterface[] | LevelSubItemInterface[];
  hasMoreItems: boolean;
  actualPage: number;
  totalItems: number;
  selectedItemId: string | number;
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
  const { t } = useI18n();
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
  const [isLoadingMore, setIsLoadingMore] = useState<Map<number, boolean>>(new Map());

  const contentRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const searchTimeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const autoScrollRefs = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map());

  const setLoadingMoreState = (index: number, value: boolean) => {
    setIsLoadingMore((prev) => {
      const next = new Map(prev);
      next.set(index, value);
      return next;
    });
  };

  const stopAutoScroll = useCallback((index: number) => {
    const autoScrollInterval = autoScrollRefs.current.get(index);
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollRefs.current.delete(index);
    }
  }, []);

  const handleSearch = useCallback((index: number, searchTerm: string) => {
    const existingTimeout = searchTimeoutRefs.current.get(index);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    setSearchTerms((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, searchTerm);
      return newMap;
    });

    setIsSearching((prev) => {
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

          setSpheresData((prev) => {
            const data = [...prev];
            let items = pageableItems?.items || [];
            const total = pageableItems?.total || 0;

            const selectedValue = selectedValues[index];
            if (selectedValue && !items.some((item) => item.name === selectedValue)) {
              const selectedItem = data[index].items.find((item) => item.name === selectedValue);
              if (selectedItem) {
                items = [selectedItem as any, ...items];
              }
            }

            data[index] = {
              ...data[index],
              items,
              totalItems: total,
              hasMoreItems: total > items.length,
              actualPage: 1
            };
            return data;
          });
        } else if (index > 0 && spheresData[index - 1]?.selectedItemId) {
          const parentItemId = Number(spheresData[index - 1].selectedItemId);
          if (!Number.isFinite(parentItemId)) {
            return;
          }

          const subitems = await levelService.getItemSubItems(
            spheresData[index].sphere.id,
            parentItemId,
            subItemPageSize,
            1,
            searchTerm
          );

          setSpheresData((prev) => {
            const data = [...prev];
            let items = subitems?.items || [];
            const total = subitems?.total || 0;

            const selectedValue = selectedValues[index];
            if (selectedValue && !items.some((item) => item.name === selectedValue)) {
              const selectedItem = data[index].items.find((item) => item.name === selectedValue);
              if (selectedItem) {
                items = [selectedItem as any, ...items];
              }
            }

            data[index] = {
              ...data[index],
              items,
              totalItems: total,
              hasMoreItems: total > items.length,
              actualPage: 1
            };
            return data;
          });
        }
      } catch (searchError: any) {
        const errorMessage: string = formatErrorMessages(searchError.error);
        toast({
          title: t("Erro ao buscar itens"),
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsSearching((prev) => {
          const newMap = new Map(prev);
          newMap.set(index, false);
          return newMap;
        });
      }
    }, 500);

    searchTimeoutRefs.current.set(index, timeout);
  }, [spheresData, subItemPageSize, selectedValues]);

  const loadItemHierarchy = useCallback(async (itemCode: string, spheres: LevelInterface[]) => {
    try {
      if (!spheres || spheres.length === 0) {
        return;
      }

      const lastSphereId = spheres[spheres.length - 1].id;
      const hierarchyItems = await levelService.getItemHierarchy(lastSphereId, itemCode);

      if (!hierarchyItems || hierarchyItems.length === 0) {
        return;
      }

      const newSelectedValues = new Array(spheres.length).fill("");
      const hierarchyMap: Map<number, ItemHierarchyInterface> = new Map();

      hierarchyItems.forEach((item) => {
        hierarchyMap.set(item.level.id, item);
      });

      const newSpheresData = await Promise.all(
        spheres.map(async (sphere: LevelInterface, index: number) => {
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
            const itemAlreadyExists = tempItems.some((item) => item.id === hierarchyItem.id);
            if (!itemAlreadyExists) {
              tempItems = [
                ...tempItems,
                {
                  id: hierarchyItem.id,
                  uuid: hierarchyItem.uuid,
                  name: hierarchyItem.name,
                  externalCode: hierarchyItem.externalCode
                }
              ];
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
        })
      );

      setSpheresData(newSpheresData);
      setSelectedValues(newSelectedValues);
      setIsHierarchyLoaded(true);
    } catch (hierarchyError: any) {
      const errorMessage: string = formatErrorMessages(hierarchyError.error);
      toast({
        title: t("Erro ao carregar hierarquia de itens"),
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [subItemPageSize]);

  const fetchInitialData = useCallback(async () => {
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
              items,
              hasMoreItems: total > items.length,
              actualPage: 1,
              totalItems: total,
              selectedItemId: ""
            };
          }

          return {
            sphere,
            items: [],
            hasMoreItems: true,
            actualPage: 1,
            totalItems: 0,
            selectedItemId: ""
          };
        })
      );

      setSpheresData(fetchedSpheresData);
      setSelectedValues(new Array(fetchedSpheresData.length).fill(""));

      if (codeItem) {
        await loadItemHierarchy(codeItem, spheres);
      }
    } catch (fetchError: any) {
      const errorMessage: string = formatErrorMessages(fetchError.error);
      toast({
        title: t("Erro ao buscar esferas"),
        description: errorMessage,
        variant: "destructive"
      });
      setError(t("Erro ao buscar esferas"));
    } finally {
      setLoading(false);
    }
  }, [codeItem, initialId, loadItemHierarchy]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const allFilled = selectedValues.every((val) => val !== "");

    if (!allFilled && hasEmittedValue) {
      onHierarchyNotCompleted?.();
      return;
    }

    if (onHierarchyComplete && allFilled && selectedValues.length) {
      const lastIdx = spheresData.length - 1;
      const selectedItem = spheresData[lastIdx]
        .items
        .find((item) => item.name === selectedValues[spheresData.length - 1]);

      if (selectedItem) {
        setHasEmittedValue(true);
        onHierarchyComplete(selectedItem.id, selectedItem.externalCode || undefined);

        if (hasError && onErrorClear) {
          onErrorClear();
        }
      }
    }
  }, [selectedValues, onHierarchyComplete, hasError, onErrorClear, isHierarchyLoaded, spheresData, hasEmittedValue, onHierarchyNotCompleted]);

  const findLastActiveSelectIndex = () => {
    for (let i = spheresData.length - 1; i >= 0; i -= 1) {
      if (i === 0 || (i > 0 && selectedValues[i - 1] !== "")) {
        return i;
      }
    }

    return 0;
  };

  const handleSelectChange = async (index: number, newValue: string) => {
    stopAutoScroll(index);
    setActiveSelectIndex(null);

    setSelectedValues((prev) => {
      const data = [...prev];
      data[index] = newValue;
      for (let i = index + 1; i < data.length; i += 1) {
        data[i] = "";
      }
      return data;
    });

    setSpheresData((prev) => {
      const data = [...prev];
      const selectedItem = data[index]?.items.find((item: any) => item.name === newValue);
      data[index] = {
        ...data[index],
        selectedItemId: selectedItem?.id || ""
      };

      for (let i = index + 1; i < data.length; i += 1) {
        data[i] = {
          ...data[i],
          items: [],
          selectedItemId: "",
          actualPage: 1,
          totalItems: 0,
          hasMoreItems: true
        };
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

          setSpheresData((prev) => {
            const data = [...prev];
            data[index] = { ...data[index], selectedItemId: selectedItem.id };
            data[index + 1] = {
              ...data[index + 1],
              items,
              totalItems: total,
              hasMoreItems: total > items.length,
              actualPage: 1
            };
            return data;
          });
        } catch (childError: any) {
          const errorMessage: string = formatErrorMessages(childError.error);
          toast({
            title: t("Erro ao buscar itens filho"),
            description: errorMessage,
            variant: "destructive"
          });
        }
      }
    }
  };

  const loadMoreSubItems = useCallback(async (index: number) => {
    if (!spheresData || index < 0 || index >= spheresData.length) {
      return;
    }

    if (!spheresData[index].hasMoreItems || isLoadingMore.get(index)) {
      return;
    }

    const currentSearchTerm = searchTerms.get(index) || "";
    const nextPage = spheresData[index].actualPage + 1;

    setLoadingMoreState(index, true);

    try {
      let response;

      if (index === 0) {
        response = await levelService.getLevelItems(
          spheresData[index].sphere.id.toString(),
          nextPage,
          subItemPageSize,
          "id",
          "ASC",
          currentSearchTerm
        );
      } else {
        const parentSphereData = spheresData[index - 1];
        const parentSelectedItemId = parentSphereData?.selectedItemId;
        const parentItems = parentSphereData?.items;
        const parentSelectedItemName = selectedValues[index - 1];

        if (!parentItems || parentItems.length === 0) {
          return;
        }

        const selectedParentItem = parentSelectedItemId
          ? parentItems.find((item) => item.id.toString() === parentSelectedItemId.toString())
          : parentItems.find((item) => item.name === parentSelectedItemName);

        if (!selectedParentItem?.id) {
          return;
        }

        response = await levelService.getItemSubItems(
          spheresData[index].sphere.id,
          selectedParentItem.id,
          subItemPageSize,
          nextPage,
          currentSearchTerm
        );
      }

      const responseItems = response?.items || [];
      const responseTotal = response?.total || 0;

      setSpheresData((prev) => {
        const data = [...prev];
        const existingIds = new Set(data[index].items.map((item) => item.id));
        const newItems = responseItems.filter((item) => !existingIds.has(item.id));

        data[index] = {
          ...data[index],
          actualPage: nextPage,
          items: [...data[index].items, ...newItems] as LevelSubItemInterface[],
          hasMoreItems: (data[index].items.length + newItems.length) < responseTotal,
          totalItems: responseTotal
        };

        return data;
      });
    } catch (loadError: unknown) {
      const errorMessage: string = formatErrorMessages(loadError);
      toast({
        title: t("Erro ao buscar mais itens"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoadingMoreState(index, false);
    }
  }, [isLoadingMore, searchTerms, selectedValues, spheresData, subItemPageSize]);

  const handleOptionsScroll = useCallback((index: number) => {
    const contentElement = contentRefs.current.get(index);
    if (!contentElement) {
      return;
    }

    const distanceToBottom = contentElement.scrollHeight - contentElement.scrollTop - contentElement.clientHeight;
    if (distanceToBottom <= 12) {
      void loadMoreSubItems(index);
    }
  }, [loadMoreSubItems]);

  const startAutoScroll = useCallback((index: number) => {
    const contentElement = contentRefs.current.get(index);
    if (!contentElement) {
      return;
    }

    stopAutoScroll(index);

    const intervalId = setInterval(() => {
      const previousTop = contentElement.scrollTop;
      const nextTop = previousTop + (contentElement.clientHeight / 2);
      contentElement.scrollTop = nextTop;

      const distanceToBottom = contentElement.scrollHeight - contentElement.scrollTop - contentElement.clientHeight;
      if (distanceToBottom <= 0 || contentElement.scrollTop === previousTop) {
        stopAutoScroll(index);
      }
    }, 120);

    autoScrollRefs.current.set(index, intervalId);
  }, [stopAutoScroll]);

  useEffect(() => {
    const searchTimeouts = searchTimeoutRefs.current;
    const autoScrollIntervals = autoScrollRefs.current;

    return () => {
      searchTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });

      autoScrollIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
  }, []);

  const setContentRef = useCallback((index: number) => (node: HTMLDivElement | null) => {
    contentRefs.current.set(index, node);
  }, []);

  const handleSelectOpen = (index: number, isOpen: boolean) => {
    if (isOpen) {
      setActiveSelectIndex(index);
      return;
    }

    stopAutoScroll(index);
    setActiveSelectIndex((currentIndex) => (currentIndex === index ? null : currentIndex));
    setSearchTerms((prev) => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });

    if (searchTerms.get(index)) {
      handleSearch(index, "");
    }
  };

  if (loading) {
    return <div className="dynamic-sphere-form__status">{t("Carregando esferas...")}</div>;
  }

  if (error) {
    return <div className="dynamic-sphere-form__status">{t("Erro")}: {error}</div>;
  }

  const lastActiveSelectIndex = findLastActiveSelectIndex();

  return (
    <div className="dynamic-sphere-form">
      {spheresData.map(({ sphere, items, totalItems, hasMoreItems }, index) => {
        const isLastActiveSelect = index === lastActiveSelectIndex;
        const shouldShowError = hasError && isLastActiveSelect;
        const selectedValue = selectedValues[index];
        const isSelectDisabled = index > 0 && !selectedValues[index - 1];

        return (
          <div key={sphere.id} className="dynamic-sphere-form__field">
            <Label className={cn("dynamic-sphere-form__label", shouldShowError && "dynamic-sphere-form__label--error")}>
              <span className="dynamic-sphere-form__label-main">
                {!simpleLabel && t("Selecione um item para a esfera de nível ")}
                {sphere.name}:
                {shouldShowError && <span className="dynamic-sphere-form__required">*</span>}
              </span>
              <span className="dynamic-sphere-form__label-total">({t("{{count}} itens encontrados", { count: totalItems })})</span>
            </Label>

            <DropdownMenu
              open={activeSelectIndex === index}
              onOpenChange={(open) => handleSelectOpen(index, open)}
              modal={false}
            >
              <DropdownMenuTrigger asChild disabled={isSelectDisabled}>
                <button
                  type="button"
                  className={cn(
                    "app-input dynamic-sphere-form__select-trigger",
                    shouldShowError && "dynamic-sphere-form__select-trigger--error"
                  )}
                >
                  <span className={cn(
                    "dynamic-sphere-form__trigger-value",
                    !selectedValue && "dynamic-sphere-form__trigger-value--placeholder"
                  )}
                  >
                    {selectedValue || t("Selecionar...")}
                  </span>
                  <ChevronDown className="dynamic-sphere-form__trigger-icon" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="dynamic-sphere-form__dropdown-content"
                sideOffset={4}
                onCloseAutoFocus={(event) => event.preventDefault()}
              >
                <div className="dynamic-sphere-form__search-container" onClick={(event) => event.stopPropagation()}>
                  <div className="app-input-group app-input-group--icon-left">
                    <Search className="app-input-group__icon" />
                    <input
                      className="app-input dynamic-sphere-form__search-input"
                      placeholder={t("Pesquisar...")}
                      value={searchTerms.get(index) || ""}
                      onChange={(event) => handleSearch(index, event.target.value)}
                      onKeyDown={(event) => event.stopPropagation()}
                    />
                  </div>
                </div>

                <div
                  className="dynamic-sphere-form__options"
                  onScroll={() => handleOptionsScroll(index)}
                  ref={setContentRef(index)}
                  role="listbox"
                >
                  {items?.length > 0 ? (
                    items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          "dropdown-menu__item dynamic-sphere-form__option",
                          selectedValue === item.name && "dynamic-sphere-form__option--selected"
                        )}
                        onClick={() => {
                          void handleSelectChange(index, item.name);
                        }}
                      >
                        {item.name}
                      </button>
                    ))
                  ) : (
                    <div className="dynamic-sphere-form__empty-state">
                      {isSearching.get(index) ? t("Buscando...") : t("Nenhum item encontrado")}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="dynamic-sphere-form__scroll-action"
                  onMouseEnter={() => startAutoScroll(index)}
                  onMouseLeave={() => stopAutoScroll(index)}
                  disabled={!hasMoreItems && !isLoadingMore.get(index)}
                >
                  <ChevronDown className="dynamic-sphere-form__scroll-action-icon" />
                  <span className="dynamic-sphere-form__scroll-action-text">
                    {isLoadingMore.get(index)
                      ? t("Carregando mais itens...")
                      : hasMoreItems
                        ? t("Passe o mouse para rolar e carregar mais")
                        : t("Fim da lista")}
                  </span>
                </button>
              </DropdownMenuContent>
            </DropdownMenu>

            {shouldShowError && (
              <p className="dynamic-sphere-form__error-message">{t("Este campo é obrigatório")}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicSphereForm;
