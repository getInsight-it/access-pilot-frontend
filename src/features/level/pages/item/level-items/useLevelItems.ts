import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "../../../../../common/external/ui/use-toast.ts";
import { levelService } from "../../../common/api/level-service.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { PAGINATION } from "../../../../../common/constants/pagination.ts";

export interface Sphere {
  id: string;
  name: string;
  type: string;
  parent: {
    id: number;
    name: string;
  } | null;
}

export interface Item {
  externalCode: any;
  id: number;
  name: string;
  description: string;
  parent?: {
    id: number;
    name: string;
  } | null;
}

export interface SphereHierarchy {
  id: string;
  name: string;
  parent: {
    id: number;
    name: string;
  } | null;
}

export const useLevelItemsData = () => {
  const { id } = useParams<{ id: string }>();

  const [sphere, setSphere] = useState<Sphere | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSphereHierarchy = useCallback(async (sphereId: string): Promise<SphereHierarchy[]> => {
    const hierarchy: SphereHierarchy[] = [];
    let currentId = sphereId;

    while (currentId) {
      try {
        const sphereData = await levelService.getLevelById(currentId);
        if (!sphereData) break;

        hierarchy.unshift({
          id: sphereData.id.toString(),
          name: sphereData.name,
          parent: sphereData.parent
            ? {
                id: sphereData.parent.id,
                name: sphereData.parent.name
              }
            : null
        });

        currentId = sphereData.parent ? sphereData.parent.id.toString() : "";
      } catch (error: any) {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: "Erro ao buscar hierarquia",
          description: errorMessage,
          variant: "destructive"
        });
        break;
      }
    }

    if (hierarchy.length === 0) {
      hierarchy.push({
        id: sphereId,
        name: `Esfera ${sphereId}`,
        parent: null
      });
    }

    return hierarchy;
  }, []);

  const fetchParentSpheres = useCallback(async (itemsData: Item[]) => {
    try {
      const itemsWithParent = itemsData.filter((item) => item.parent);

      if (itemsWithParent.length === 0) return;

      const uniqueParentIds = [...new Set(itemsWithParent.map((item) => item.parent?.id))];
      const parentSpheresData: Record<string, string> = {};
      const hierarchies: Record<string, SphereHierarchy[]> = {};

      for (const parentId of uniqueParentIds) {
        if (!parentId) continue;

        try {
          const itemWithThisParent = itemsWithParent.find((item) => item.parent?.id === parentId);

          if (itemWithThisParent && itemWithThisParent.parent) {
            parentSpheresData[parentId.toString()] = itemWithThisParent.parent.name || `Item ${parentId}`;

            if (sphere && sphere.parent) {
              try {
                hierarchies[parentId.toString()] = await fetchSphereHierarchy(sphere.parent.id.toString());
              } catch (hierarchyError) {
                console.error(`Erro ao buscar hierarquia para esfera pai:`, hierarchyError);
                hierarchies[parentId.toString()] = [
                  {
                    id: sphere.parent.id.toString(),
                    name: sphere.parent.name,
                    parent: null
                  }
                ];
              }
            } else {
              hierarchies[parentId.toString()] = [
                {
                  id: parentId.toString(),
                  name: itemWithThisParent.parent.name,
                  parent: null
                }
              ];
            }
          } else {
            parentSpheresData[parentId.toString()] = `Item ${parentId}`;
            hierarchies[parentId.toString()] = [
              {
                id: parentId.toString(),
                name: `Item ${parentId}`,
                parent: null
              }
            ];
          }
        } catch (error) {
          console.error(`Erro ao processar item pai ${parentId}:`, error);
          parentSpheresData[parentId.toString()] = `Item ${parentId}`;
          hierarchies[parentId.toString()] = [
            {
              id: parentId.toString(),
              name: `Item ${parentId}`,
              parent: null
            }
          ];
        }
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao processar solicitação de acesso",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [sphere, fetchSphereHierarchy]);

  const fetchSphereAndItems = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const sphereData = await levelService.getLevelById(id);
      if (!sphereData) {
        throw new Error("Falha ao buscar dados da esfera");
      }

      const sphereObj: Sphere = {
        id: sphereData.id.toString(),
        name: sphereData.name,
        type: sphereData.type,
        parent: sphereData.parent
          ? {
              id: sphereData.parent.id,
              name: sphereData.parent.name
            }
          : null
      };
      setSphere(sphereObj);

      const itemsData = await levelService.getLevelItems(id, currentPage, pageSize, "id", "ASC", searchTerm);

      if (itemsData) {
        setItems(itemsData.items || []);
        setFilteredItems(itemsData.items || []);
        setTotalItems(itemsData.total || 0);

        const totalPagesCount = Math.ceil((itemsData.total || 0) / pageSize);
        setTotalPages(totalPagesCount > 0 ? totalPagesCount : 1);

        if (itemsData.items && itemsData.items.length > 0) {
          await fetchParentSpheres(itemsData.items);
        }
      } else {
        setItems([]);
        setFilteredItems([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao buscar esferas e itens.",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id, currentPage, pageSize, searchTerm, fetchParentSpheres]);

  return {
    id,
    sphere,
    items,
    setItems,
    filteredItems,
    setFilteredItems,
    loading,
    currentPage,
    setCurrentPage,
    pageSize,
    totalItems,
    setTotalItems,
    totalPages,
    setTotalPages,
    searchTerm,
    setSearchTerm,
    fetchSphereAndItems,
    fetchSphereHierarchy
  };
};

export const useLevelItemsOperations = (itemsData: ReturnType<typeof useLevelItemsData>) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const handleDelete = useCallback((item: Item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete || !itemsData.sphere || !itemsData.id) return;

    try {
      await levelService.deleteLevelItem(itemsData.id, itemToDelete.id.toString());

      itemsData.setItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id));
      itemsData.setFilteredItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id));
      itemsData.setTotalItems((prevTotal) => prevTotal - 1);

      const newTotalPages = Math.ceil((itemsData.totalItems - 1) / itemsData.pageSize);
      itemsData.setTotalPages(newTotalPages > 0 ? newTotalPages : 1);

      if (itemsData.filteredItems.length === 1 && itemsData.currentPage > 1) {
        itemsData.setCurrentPage(itemsData.currentPage - 1);
      }

      toast({
        title: "Sucesso",
        description: "Item excluído com sucesso!"
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao excluir item",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, itemsData]);

  const handlePageChange = useCallback((page: number) => {
    itemsData.setCurrentPage(page);
  }, [itemsData]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    itemsData.setSearchTerm(e.target.value);
    itemsData.setCurrentPage(1);
  }, [itemsData]);

  const renderParentItem = useCallback((item: Item): string => {
    if (!item.parent) return "Nenhum";
    return item.parent.name || `Item ${item.parent.id}`;
  }, []);

  return {
    deleteModalOpen,
    setDeleteModalOpen,
    itemToDelete,
    handleDelete,
    confirmDelete,
    handlePageChange,
    handleSearchChange,
    renderParentItem
  };
};

