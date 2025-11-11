import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "../../../../../common/external/ui/use-toast.ts";
import { levelService } from "../../../common/api/level-service.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { PAGINATION } from "../../../../../common/constants/pagination.ts";
import { useDebounce } from "../../../../../common/hooks/use-debounce.ts";

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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchItemsRequestIdRef = useRef(0);

  const fetchSphere = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      const sphereData = await levelService.getLevelById(id);

      const sphereObj: Sphere = {
        id: sphereData.id.toString(),
        name: sphereData.name,
        type: sphereData.type,
        parent: sphereData.parent? { id: sphereData.parent.id, name: sphereData.parent.name }: null
      };
      setSphere(sphereObj);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao buscar dados da esfera.",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchItems = useCallback(async () => {
    if (!id) return;

    const currentRequestId = ++fetchItemsRequestIdRef.current;

    try {
      setLoading(true);

      const itemsData = await levelService.getLevelItems(id, currentPage, pageSize, "id", "ASC", debouncedSearchTerm);

      if (currentRequestId !== fetchItemsRequestIdRef.current) {
        return;
      }

      if (itemsData) {
        setItems(itemsData.items || []);
        setFilteredItems(itemsData.items || []);
        setTotalItems(itemsData.total || 0);

        const totalPagesCount = Math.ceil((itemsData.total || 0) / pageSize);
        setTotalPages(totalPagesCount > 0 ? totalPagesCount : 1);
      } else {
        setItems([]);
        setFilteredItems([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      if (currentRequestId !== fetchItemsRequestIdRef.current) {
        return;
      }

      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao buscar itens.",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      if (currentRequestId === fetchItemsRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [id, currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    if (id) {
      fetchSphere();
    }
  }, [id, fetchSphere]);

  useEffect(() => {
    if (id && sphere) {
      fetchItems();
    }
  }, [id, sphere, debouncedSearchTerm, currentPage, pageSize, fetchItems]);

  useEffect(() => {
    const handleItemUpdated = () => {
      fetchItems();
    };

    window.addEventListener("item-updated", handleItemUpdated);

    return () => {
      window.removeEventListener("item-updated", handleItemUpdated);
    };
  }, [fetchItems]);

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
    fetchSphere,
    fetchItems
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

