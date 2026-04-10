import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../../../common/external/ui/use-toast.ts";
import { levelService } from "../../../common/api/level-service.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { PAGINATION } from "../../../../../common/constants/pagination.ts";
import { useI18n } from "../../../../../common/context/i18n/I18nContext.tsx";
import { getBuiltInSphereColor } from "../../../common/constants/level-constants.ts";

export interface SphereItem {
  id: string;
  name: string;
  description: string;
  type: "negocial" | "externa" | "BUILT_IN" | "BUSINESS" | "EXTERNAL";
  parent?: {
    id: number;
    name: string;
  } | null;
  children?: SphereItem[];
  isBuiltIn?: boolean;
  sigla?: string;
  uuid?: string;
  externalUrl?: string;
  level?: number;
  color?: string | null;
}

export const BUILT_IN_SPHERES = ["FEDERAL", "ESTADUAL", "MUNICIPAL"];

export const useLevelListData = () => {
  const { t } = useI18n();
  const [spheres, setSpheres] = useState<SphereItem[]>([]);
  const [flatSpheres, setFlatSpheres] = useState<SphereItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>();
    BUILT_IN_SPHERES.forEach((sphere) => initialExpanded.add(sphere));
    return initialExpanded;
  });

  const buildTreeStructure = useCallback((items: SphereItem[]): SphereItem[] => {
    const itemMap = new Map<string, SphereItem>();

    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    const rootItems: SphereItem[] = [];

    items.forEach((item) => {
      if (!item.parent) {
        rootItems.push(itemMap.get(item.id)!);
      } else if (itemMap.has(item.parent.id.toString())) {
        const parent = itemMap.get(item.parent.id.toString())!;
        parent.children = parent.children || [];
        parent.children.push(itemMap.get(item.id)!);
      } else {
        rootItems.push(itemMap.get(item.id)!);
      }
    });

    const sortItems = (items: SphereItem[]): SphereItem[] => {
      return items
        .sort((a, b) => {
          if (a.isBuiltIn && b.isBuiltIn) {
            const aIndex = BUILT_IN_SPHERES.indexOf(a.name);
            const bIndex = BUILT_IN_SPHERES.indexOf(b.name);
            if (aIndex >= 0 && bIndex >= 0) {
              return aIndex - bIndex;
            }
            return a.name.localeCompare(b.name);
          }
          if (a.isBuiltIn) return -1;
          if (b.isBuiltIn) return 1;
          return a.name.localeCompare(b.name);
        })
        .map((item) => ({
          ...item,
          children: item.children ? sortItems(item.children) : []
        }));
    };

    return sortItems(rootItems);
  }, []);

  const flattenSpheres = useCallback((items: SphereItem[], level: number, expanded: Set<string>): SphereItem[] => {
    let result: SphereItem[] = [];

    items.forEach((item) => {
      const itemWithLevel = { ...item, level };
      result.push(itemWithLevel);

      if (item.children && item.children.length > 0 && expanded.has(item.id)) {
        result = result.concat(flattenSpheres(item.children, level + 1, expanded));
      }
    });

    return result;
  }, []);

  const fetchSpheres = useCallback(async () => {
    try {
      setLoading(true);
      const data = await levelService.getLevels(1, PAGINATION.LARGE_PAGE_SIZE, "id", "ASC");

      if (!data) {
        throw new Error(t("Falha ao carregar esferas"));
      }

      const spheresData: SphereItem[] = data.items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || "",
        type: item.type as "negocial" | "externa" | "BUILT_IN" | "BUSINESS" | "EXTERNAL",
        parent: item.parent
          ? {
              id: item.parent.id,
              name: item.parent.name
            }
          : null,
        isBuiltIn: item.type === "BUILT_IN",
        sigla: item.sigla,
        uuid: item.uuid,
        externalUrl: item.externalUrl,
        color: item.color || getBuiltInSphereColor(item.name)
      }));

      const spheresWithBuiltInFlag = spheresData.map((sphere) => ({
        ...sphere,
        isBuiltIn: sphere.type === "BUILT_IN" || BUILT_IN_SPHERES.includes(sphere.name)
      }));

      const treeStructure = buildTreeStructure(spheresWithBuiltInFlag);
      setSpheres(treeStructure);

      setExpandedItems((prev) => {
        const next = new Set(prev);
        spheresWithBuiltInFlag.forEach((sphere) => {
          if (sphere.isBuiltIn) {
            next.add(sphere.id);
          }
        });
        return next;
      });

      setError(null);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: t("Erro ao carregar esferas."),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [buildTreeStructure, t]);

  const toggleExpand = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (spheres.length > 0) {
      const flatList = flattenSpheres(spheres, 0, expandedItems);
      setFlatSpheres(flatList);
    }
  }, [expandedItems, spheres, flattenSpheres]);

  return {
    spheres,
    flatSpheres,
    loading,
    error,
    expandedItems,
    fetchSpheres,
    toggleExpand
  };
};

export const useLevelOperations = (fetchSpheres: () => Promise<void>) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const excludeItem = useCallback(async (item: SphereItem) => {
    try {
      await levelService.deleteLevel(item.id);
      await fetchSpheres();

      toast({
        title: t("Sucesso"),
        description: t("Esfera \"{{name}}\" excluída com sucesso!", { name: item.name })
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao excluir esfera"),
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [fetchSpheres, t]);

  const handleViewItems = useCallback((item: SphereItem) => {
    navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(":id", item.id));
  }, [navigate]);

  return {
    excludeItem,
    handleViewItems
  };
};

export const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case "BUSINESS":
      return "Negocial";
    case "EXTERNAL":
      return "Externa";
    case "BUILT_IN":
      return "Interna";
    default:
      return type;
  }
};
