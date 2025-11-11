
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
import { Edit, EllipsisVertical, Plus, Trash } from "lucide-react";
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
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />
      </div>
    );
  }

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
              badgeValue={itemsData.totalItems}
              returnButton={true}
              onReturnClick={() => { navigate(PRIVATE_ROUTES.LEVELS);}}
              customDescription={
                <span className="text-md">
                  Esfera: <span className="text-primary-600 cursor-pointer">{itemsData.sphere?.name}</span>
                </span>
              }
            />
            <div className="flex space-x-4 items-center">
              {itemsData.sphere?.type !== "BUILT_IN" && itemsData.sphere?.type !== "EXTERNAL" && (
                <>
                  <Button
                    className="cursor-pointer"
                    asChild
                    onClick={() => {
                      savePreviousRoute(location.pathname + location.search);
                      navigate(PRIVATE_ROUTES.CREATE_ITEM.replace(':id', itemsData.id || ''));
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
                value={itemsData.searchTerm}
                onChange={operations.handleSearchChange}
                className="h-10 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
              />
            </div>
            {itemsData.filteredItems.length > 0 ? (
              <>
                {itemsData.filteredItems.map((item, index) => (
                  <div className="table-card" key={`mobile-table-card-${index}`}>
                    {itemsData.sphere?.type !== "BUILT_IN" && itemsData.sphere?.type !== 'EXTERNAL' && (
                      <div className="table-card__header">
                        <div className="flex items-center justify-between">
                          <span className="mr-2">Ações</span>
                          {itemsData.sphere?.type !== "BUILT_IN" && (
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
                                        .replace(":id", itemsData.id!)
                                        .replace(":itemId", item.id.toString())
                                    );
                                  }}
                                  className="flex flex-row gap-2">
                                  <Edit size={16} />
                                  <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => operations.handleDelete(item)}
                                  className="flex flex-row gap-2">
                                  <Trash size={16} />
                                  <span>Excluir</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
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
                            <span className="table-card__label">Código externo</span>
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
                <div className="p-4">
                  <PaginationWrapper
                    currentPage={itemsData.currentPage}
                    totalPages={itemsData.totalPages}
                    onPageChange={operations.handlePageChange}
                  />
                </div>
              </>
            ) : !itemsData.loading ? (
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
                value={itemsData.searchTerm}
                onChange={operations.handleSearchChange}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  <TableHead width={itemsData.sphere?.type !== "BUILT_IN" ? "calc(25% - 25px)" : "100%"}>Nome</TableHead>
                  {itemsData.sphere?.type !== "BUILT_IN" && (
                    <>
                      <TableHead width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>Descrição</TableHead>
                      <TableHead className="justify-center" width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>Código externo</TableHead>
                      <TableHead className="justify-center" width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>Item da esfera pai</TableHead>
                      {itemsData.sphere?.type !== 'EXTERNAL' && <TableHead width="100px" className="flex align-center justify-center">Ações</TableHead>}
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsData.filteredItems.length > 0 ? (
                  itemsData.filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell width={itemsData.sphere?.type !== "BUILT_IN" ? "calc(25% - 25px)" : "100%"} wordBreak="break-word">{item.name}</TableCell>
                      {itemsData.sphere?.type !== "BUILT_IN" && itemsData.sphere?.type !== 'EXTERNAL' && (
                        <>
                          <TableCell width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>{item.description}</TableCell>
                          <TableCell className="justify-center" width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>{item.externalCode ?? '-'}</TableCell>
                          <TableCell className="justify-center" width={itemsData.sphere?.type !== 'EXTERNAL' ? "calc(25% - 25px)" : "25%"}>{operations.renderParentItem(item)}</TableCell>
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
                                        .replace(":id", itemsData.id!)
                                        .replace(":itemId", item.id.toString())
                                    );
                                  }}
                                  className="flex flex-row gap-2">
                                  <Edit size={16} />
                                  <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => operations.handleDelete(item)}
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
                ) : !itemsData.loading ? (
                  <TableRow>
                    <TableCell { ...{colSpan: itemsData.sphere?.type !== "BUILT_IN" ? 5 : 1} } className="py-12">
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
