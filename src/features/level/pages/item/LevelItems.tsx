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
import { Separator } from "../../../../common/external/ui/separator.tsx";
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
        console.log("Detectada atualização de item, recarregando lista...");
        fetchSphereAndItems();
      };

      window.addEventListener("item-updated", handleItemUpdated);

      return () => {
        window.removeEventListener("item-updated", handleItemUpdated);
      };
    }
  }, [isAuthenticated, id, currentPage, pageSize]);

  useEffect(() => {
    if(searchTerm.trim() === "") {
      setFilteredItems(items);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseSearchTerm) ||
          item.description?.toLowerCase().includes(lowercaseSearchTerm) ||
          item.externalCode?.toLowerCase().includes(lowercaseSearchTerm)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

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

      const itemsData = await levelService.getLevelItems(id, currentPage, pageSize, "id", "ASC");

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
    } catch (err) {
      console.error("Erro ao buscar esfera e itens:", err);
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
    } catch (error) {
      console.error("Erro ao buscar esferas pais:", error);
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
      } catch (error) {
        console.error(`Erro ao buscar esfera ${currentId}:`, error);
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
      const success = await levelService.deleteLevelItem(id, itemToDelete.id.toString());

      if(success) {
        toast({
          title: "Sucesso",
          description: "Item excluído com sucesso!"
        });

        fetchSphereAndItems();
      } else {
        throw new Error("Falha ao excluir o item");
      }
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir o item. Por favor, tente novamente.",
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
  };

  const renderParentItem = (item: Item) => {
    if(!item.parent) return "Nenhum";
    return item.parent.name || `Item ${item.parent.id}`;
  };

  const breadcrumbItems = [
    { title: "Gerenciar esferas", link: "/dashboard/levels" },
    { title: "Itens", link: `/dashboard/levels/${id}/items` }
  ];

  if(loading) return (
    <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
      <HighlightLoader />
    </div>
  );

  const location = useLocation();

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div className="flex-none">
        <HeaderContainer>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="pl-1 flex items-start justify-between">
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
                      <span>Adicionar novo item</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="px-6 flex-grow">
        <div className="py-6 max-w-content-container m-auto flex flex-col gap-4">
          <div className="w-96">
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
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6">
                    Nenhum item encontrado para esta esfera.
                  </TableCell>
                </TableRow>
              ) : (
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
              )}
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
