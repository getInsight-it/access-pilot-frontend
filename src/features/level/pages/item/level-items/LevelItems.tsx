
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../../../common/external/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../../../common/external/ui/table.tsx";
import { Breadcrumbs } from "../../../../../common/components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "../../../../../common/components/heading.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../../common/external/ui/dialog.tsx";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { Copy, Edit, EllipsisVertical, Plus, Trash } from "lucide-react";
import { Input } from "../../../../../common/external/ui/input.tsx";
import { motion } from "framer-motion";
import HighlightLoader from "../../../../../common/components/loading/HighLightLoader.tsx";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../../common/utils/NavigationStateManager.ts";
import { PaginationWrapper } from "../../../../../common/components/PaginationWrapper.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../../common/external/ui/dropdown-menu.tsx";
import { useLevelItemsData, useLevelItemsOperations } from "./useLevelItems.ts";
import { toast } from "@common/external/ui/use-toast.ts";


export default function LevelItems() {
  const location = useLocation();
  const navigate = useNavigate();

  const itemsData = useLevelItemsData();
  const operations = useLevelItemsOperations(itemsData);

  const breadcrumbItems = [
    { title: "Gerenciar esferas", link: PRIVATE_ROUTES.LEVELS },
    { title: "Itens", link: PRIVATE_ROUTES.LEVEL_ITEMS.replace(':id', itemsData.id || '') }
  ];

  if (itemsData.loading && !itemsData.sphere) {
    return (
      <div>
        <HighlightLoader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div>
        <HeaderContainer>
          <Breadcrumbs items={breadcrumbItems} />

          <div>
            <Heading
              title={"Itens da esfera"}
              badgeValue={itemsData.totalItems}
              returnButton={true}
              onReturnClick={() => { navigate(PRIVATE_ROUTES.LEVELS);}}
              customDescription={
                <span>
                  Esfera: <span>{itemsData.sphere?.name}</span>
                </span>
              }
            />
            <div>
              {itemsData.sphere?.type !== "BUILT_IN" && itemsData.sphere?.type !== "EXTERNAL" && (
                <>
                  <Button
                    asChild
                    onClick={() => {
                      savePreviousRoute(location.pathname + location.search);
                      navigate(PRIVATE_ROUTES.CREATE_ITEM.replace(':id', itemsData.id || ''));
                    }}>
                    <div>
                      <Plus />
                      <span>Adicionar novo item</span>
                      <span>Adicionar</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea viewportClassName="px-4 md:px-7">
        <div className="max-w-content-container">
          <div>
            <div>
              <Input
                variant="dark"
                placeholder="Pesquisar itens..."
                value={itemsData.searchTerm}
                onChange={operations.handleSearchChange}
              />
            </div>
            {itemsData.filteredItems.length > 0 ? (
              <>
                {itemsData.filteredItems.map((item, index) => (
                  <div className="table-card" key={`mobile-table-card-${index}`}>
                    {itemsData.sphere?.type !== 'EXTERNAL' && (
                      <div className="table-card__header">
                        <div>
                          <span>Ações</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical size={20} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => { navigator.clipboard?.writeText(item.externalCode ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                                <Copy size={16} />
                                <span>Copiar Código</span>
                              </DropdownMenuItem>
                              {itemsData.sphere?.type !== "BUILT_IN" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      savePreviousRoute(location.pathname + location.search);
                                      navigate(
                                        PRIVATE_ROUTES.EDIT_ITEM
                                          .replace(":id", itemsData.id!)
                                          .replace(":itemId", item.id.toString())
                                      );
                                    }}>
                                    <Edit size={16} />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => operations.handleDelete(item)}>
                                    <Trash size={16} />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                    <div className="table-card__content">
                      <div className="table-card__content__row">
                        <span className="table-card__label">Nome</span>
                        <span className="table-card__value">{item.name}</span>
                      </div>
                      {itemsData.sphere?.type !== "BUILT_IN" && (
                        <>
                          <div className="table-card__content__row">
                            <span className="table-card__label">Descrição</span>
                            <span className="table-card__value">{item.description || '-'}</span>
                          </div>
                          <div className="table-card__content__row">
                            <span className="table-card__label">Código</span>
                            <span className="table-card__value">{item.externalCode || '-'}</span>
                          </div>
                          <div className="table-card__content__row">
                            <span className="table-card__label">Item da esfera pai</span>
                            <span className="table-card__value">{operations.renderParentItem(item)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div>
                  <PaginationWrapper
                    currentPage={itemsData.currentPage}
                    totalPages={itemsData.totalPages}
                    onPageChange={operations.handlePageChange}
                  />
                </div>
              </>
            ) : !itemsData.loading ? (
              <div>
                <div>
                  <Plus size={24} />
                </div>
                <span>Nenhum item encontrado para esta esfera.</span>
              </div>
            ) : null}
          </div>

          {/* Desktop View */}
          <div>
            <div>
              <Input
                placeholder="Pesquisar itens..."
                value={itemsData.searchTerm}
                onChange={operations.handleSearchChange}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead width={itemsData.sphere?.type !== "BUILT_IN" ? "calc(25% - 25px)" : "calc(100% - 100px)"}>Nome</TableHead>
                  {itemsData.sphere?.type !== "BUILT_IN" && (
                    <>
                      <TableHead width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>Descrição</TableHead>
                      <TableHead width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>Código</TableHead>
                      <TableHead width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>Item da esfera pai</TableHead>
                    </>
                  )}
                  {itemsData.sphere?.type !== 'EXTERNAL' && <TableHead width="100px">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsData.filteredItems.length > 0 ? (
                  itemsData.filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell width={itemsData.sphere?.type !== "BUILT_IN" ? "calc(25% - 25px)" : "calc(100% - 100px)"} wordBreak="break-word">{item.name}</TableCell>
                      {itemsData.sphere?.type !== "BUILT_IN" && (
                        <>
                          <TableCell width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>{item.description}</TableCell>
                          <TableCell width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>{item.externalCode ?? '-'}</TableCell>
                          <TableCell width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>{operations.renderParentItem(item)}</TableCell>
                        </>
                      )}
                      {itemsData.sphere?.type !== 'EXTERNAL' && (
                        <TableCell width="100px">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical size={20} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => { navigator.clipboard?.writeText(item.externalCode ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                                <Copy size={16} />
                                <span>Copiar código</span>
                              </DropdownMenuItem>
                              {itemsData.sphere?.type !== "BUILT_IN" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      savePreviousRoute(location.pathname + location.search);
                                      navigate(
                                        PRIVATE_ROUTES.EDIT_ITEM
                                          .replace(":id", itemsData.id!)
                                          .replace(":itemId", item.id.toString())
                                      );
                                    }}>
                                    <Edit size={16} />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => operations.handleDelete(item)}>
                                    <Trash size={16} />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : !itemsData.loading ? (
                  <TableRow>
                    <TableCell { ...{colSpan: itemsData.sphere?.type !== "BUILT_IN" ? 5 : 1} }>
                      <div>
                        <div>
                          <Plus size={24} />
                        </div>
                        <span>Nenhum item encontrado para esta esfera.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
              <TableFooter>
                <div>
                  <PaginationWrapper
                    currentPage={itemsData.currentPage}
                    totalPages={itemsData.totalPages}
                    onPageChange={operations.handlePageChange}
                  />
                </div>
              </TableFooter>
            </Table>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={operations.deleteModalOpen} onOpenChange={operations.setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
          </DialogHeader>
          <p>
            Esta ação não pode ser desfeita. Isso irá permanentemente excluir o item
            {operations.itemToDelete && <strong> {operations.itemToDelete.name}</strong>}.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => operations.setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={operations.confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
