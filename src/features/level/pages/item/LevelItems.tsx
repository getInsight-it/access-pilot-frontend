import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../common/external/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../../common/external/ui/table.tsx";
import { Breadcrumbs } from "../../../../common/components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../common/external/ui/dialog.tsx";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Edit, EllipsisVertical, Plus, Trash } from "lucide-react";
import useAuthStore from "../../../../store/authStore.ts";
import { Input } from "../../../../common/external/ui/input.tsx";

import { motion } from "framer-motion";
import HighlightLoader from "../../../../common/components/loading/HighLightLoader.tsx";
import { levelService } from "../../common/api/level-service.ts";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { PaginationWrapper } from "../../../../common/components/PaginationWrapper.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../common/external/ui/dropdown-menu.tsx";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";

interface Item {
  id: number;
  name: string;
  description: string;
  parent?: {
    id: number
    name: string
    uuid: string
    sigla: string
    description: string
    type: string
  };
  externalCode?: string;
  status?: string;
}

interface Sphere {
  id: string;
  name: string;
  type: string;
  parent?: {
    id: number
    name: string
  } | null;
}

interface SphereHierarchy {
  id: string;
  name: string;
  parent?: {
    id: number
    name: string
  } | null;
}

export default function LevelItems() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [sphere, setSphere] = useState<Sphere | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if(isAuthenticated && id) {
      fetchSphereAndItems();
      const handleItemUpdated = () => {
        fetchSphereAndItems();
      };

      window.addEventListener("item-updated", handleItemUpdated);

      return () => {
        window.removeEventListener("item-updated", handleItemUpdated);
      };
    }
  }, [isAuthenticated, id, currentPage, pageSize, searchTerm]);

  const fetchSphereAndItems = async () => {
    if(!id) return;

    try {
      setLoading(true);

      const sphereData = await levelService.getLevelById(id);
      if(!sphereData) {
        throw new Error("Falha ao buscar dados da esfera");
      }

      const sphere: Sphere = {
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
      setSphere(sphere);

      const itemsData = await levelService.getLevelItems(id, currentPage, pageSize, "id", "ASC", searchTerm);

      if(itemsData) {
        setItems(itemsData.items || []);
        setFilteredItems(itemsData.items || []);
        setTotalItems(itemsData.total || 0);

        const totalPages = Math.ceil((itemsData.total || 0) / pageSize);
        setTotalPages(totalPages > 0 ? totalPages : 1);

        if(itemsData.items && itemsData.items.length > 0) {
          await fetchParentSpheres(itemsData.items);
        }
      } else {
        setItems([]);
        setFilteredItems([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);

      toast({
        title: "Erro ao buscar esferas e itens.",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParentSpheres = async (itemsData: Item[]) => {
    try {
      const itemsWithParent = itemsData.filter((item) => item.parent);

      if(itemsWithParent.length === 0) return;

      const uniqueParentIds = [...new Set(itemsWithParent.map((item) => item.parent?.id))];
      const parentSpheresData: Record<string, string> = {};
      const hierarchies: Record<string, SphereHierarchy[]> = {};

      for(const parentId of uniqueParentIds) {
        if(!parentId) continue;

        try {
          const itemWithThisParent = itemsWithParent.find((item) => item.parent?.id === parentId);

          if(itemWithThisParent && itemWithThisParent.parent) {
            parentSpheresData[parentId.toString()] = itemWithThisParent.parent.name || `Item ${parentId}`;

            if(sphere && sphere.parent) {
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
      const errorMessage: string = formatErrorMessages(error.error);

      toast({
        title: "Erro ao processar solicitação de acesso",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const fetchSphereHierarchy = async (sphereId: string): Promise<SphereHierarchy[]> => {
    const hierarchy: SphereHierarchy[] = [];
    let currentId = sphereId;

    while(currentId) {
      try {
        const sphere = await levelService.getLevelById(currentId);
        if(!sphere) break;

        hierarchy.unshift({
          id: sphere.id.toString(),
          name: sphere.name,
          parent: sphere.parent
            ? {
              id: sphere.parent.id,
              name: sphere.parent.name
            }
            : null
        });

        currentId = sphere.parent ? sphere.parent.id.toString() : "";
      } catch (error: any) {
        const errorMessage: string = formatErrorMessages(error.error);
        toast({
          title: "Erro ao fazer download do arquivo",
          description: errorMessage,
          variant: "destructive"
        });
        break;
      }
    }

    if(hierarchy.length === 0) {
      hierarchy.push({
        id: sphereId,
        name: `Esfera ${sphereId}`,
        parent: null
      });
    }

    return hierarchy;
  };

  const handleDelete = (item: Item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if(!itemToDelete || !sphere || !id) return;

    try {
      await levelService.deleteLevelItem(id, itemToDelete.id.toString());

      setItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id));
      setFilteredItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id));
      setTotalItems((prevTotal) => prevTotal - 1);

      const newTotalPages = Math.ceil((totalItems - 1) / pageSize);
      setTotalPages(newTotalPages > 0 ? newTotalPages : 1);

      if (filteredItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      toast({
        title: "Sucesso",
        description: "Item excluído com sucesso!"
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);

      toast({
        title: "Erro ao excluir item",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const renderParentItem = (item: Item) => {
    if(!item.parent) return "Nenhum";
    return item.parent.name || `Item ${item.parent.id}`;
  };

  const breadcrumbItems = [
    { title: "Gerenciar esferas", link: "/dashboard/levels" },
    { title: "Itens", link: `/dashboard/levels/${id}/items` }
  ];

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div className="flex-none">
        <HeaderContainer>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="pl-1 flex flex-col md:flex-row items-start justify-between gap-4">
            <Heading
              title={"Itens da esfera"}
              badgeValue={totalItems}
              returnButton={true}
              onReturnClick={() => { navigate(PRIVATE_ROUTES.LEVELS);}}
              customDescription={
                <span className="text-md">
                  Esfera: <span className="text-primary-600 cursor-pointer">{sphere?.name}</span>
                </span>
              }
            />
            <div className="flex space-x-4 items-center">
              {sphere?.type !== "BUILT_IN" && sphere?.type !== "EXTERNAL" && (
                <>
                  <Button
                    className="cursor-pointer"
                    asChild
                    onClick={() => {
                      savePreviousRoute(location.pathname + location.search);
                      navigate(`/dashboard/levels/${id}/items/create`);
                    }}>
                    <div>
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Adicionar novo item</span>
                      <span className="sm:hidden">Adicionar</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="flex-grow" viewportClassName="px-4 md:px-7">
        <div className="py-6 max-w-content-container m-auto">
          <div className="flex flex-col gap-4 lg:hidden w-full sm:w-auto">
            <div className="w-96 max-w-full">
              <Input
                variant="dark"
                placeholder="Pesquisar itens..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-10 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
              />
            </div>
            {filteredItems.length > 0 ? (
              <>
                {filteredItems.map((item, index) => (
                  <div className="table-card" key={`mobile-table-card-${index}`}>
                    <div className="table-card__header">
                      <div className="flex items-center justify-between">
                        <span className="mr-2">Ações</span>
                        {sphere?.type !== "BUILT_IN" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical size={20} className="cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  savePreviousRoute(location.pathname + location.search);
                                  navigate(
                                    PRIVATE_ROUTES.EDIT_ITEM
                                      .replace(":id", id!)
                                      .replace(":itemId", item.id.toString())
                                  );
                                }}
                                className="flex flex-row gap-2">
                                <Edit size={16} />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(item)}
                                className="flex flex-row gap-2">
                                <Trash size={16} />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    <div className="table-card__content">
                      <div className="table-card__content__row">
                        <span className="table-card__label">Nome</span>
                        <span className="table-card__value">{item.name}</span>
                      </div>
                      {sphere?.type !== "BUILT_IN" && (
                        <>
                          <div className="table-card__content__row">
                            <span className="table-card__label">Descrição</span>
                            <span className="table-card__value">{item.description || '-'}</span>
                          </div>
                          <div className="table-card__content__row">
                            <span className="table-card__label">Código externo</span>
                            <span className="table-card__value">{item.externalCode || '-'}</span>
                          </div>
                          <div className="table-card__content__row">
                            <span className="table-card__label">Item da esfera pai</span>
                            <span className="table-card__value">{renderParentItem(item)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className="p-4">
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : !loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Plus size={24} className="text-gray-400" />
                </div>
                <span className="text-sm text-gray-500">Nenhum item encontrado para esta esfera.</span>
              </div>
            ) : null}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="w-96 max-w-full">
              <Input
                placeholder="Pesquisar itens..."
                className="h-10 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  <TableHead width={sphere?.type !== "BUILT_IN" ? "calc(25% - 25px)" : "100%"}>Nome</TableHead>
                  {sphere?.type !== "BUILT_IN" && (
                    <>
                      <TableHead width="calc(25% - 25px)">Descrição</TableHead>
                      {/* nao existe se nao for negocial */}
                      <TableHead width="calc(25% - 25px)">Código externo</TableHead>
                      <TableHead width="calc(25% - 25px)">Item da esfera pai</TableHead>
                      <TableHead width="100px" className="flex align-center justify-center">Ações</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell width={sphere?.type !== "BUILT_IN" ? "calc(25% - 25px)" : "100%"}>{item.name}</TableCell>
                      {sphere?.type !== "BUILT_IN" && (
                        <>
                          <TableCell width="calc(25% - 25px)">{item.description}</TableCell>
                          <TableCell width="calc(25% - 25px)">{item.externalCode}</TableCell>
                          <TableCell width="calc(25% - 25px)">{renderParentItem(item)}</TableCell>
                          <TableCell width="100px" className="flex align-center justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <EllipsisVertical size={20} className="cursor-pointer" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    savePreviousRoute(location.pathname + location.search);
                                    navigate(
                                      PRIVATE_ROUTES.EDIT_ITEM
                                        .replace(":id", id!)
                                        .replace(":itemId", item.id.toString())
                                    );
                                  }}
                                  className="flex flex-row gap-2">
                                  <Edit size={16} />
                                  <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(item)}
                                  className="flex flex-row gap-2">
                                  <Trash size={16} />
                                  <span>Excluir</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : !loading ? (
                  <TableRow>
                    <TableCell colSpan={sphere?.type !== "BUILT_IN" ? 5 : 1} className="py-12">
                      <div className="flex flex-col items-center justify-center text-center w-full">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Plus size={24} className="text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500">Nenhum item encontrado para esta esfera.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
              <TableFooter>
                <div className="p-4">
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </TableFooter>
            </Table>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
          </DialogHeader>
          <p>
            Esta ação não pode ser desfeita. Isso irá permanentemente excluir o item
            {itemToDelete && <strong> {itemToDelete.name}</strong>}.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
