import { TablePagination } from "@components/table-pagination/TablePagination.tsx";
import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { toast } from "@common/external/ui/use-toast.ts";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { motion } from "framer-motion";
import { ArrowLeft, CirclePlus, Copy, EllipsisVertical, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../../common/external/ui/dialog.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../../common/external/ui/dropdown-menu.tsx";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { SectionLoader } from "../../../../../common/components/loading/section-loader/SectionLoader.tsx";
import { type Item, useLevelItemsData, useLevelItemsOperations } from "./useLevelItems.ts";
import "./LevelItems.scss";

export default function LevelItems() {
  const location = useLocation();
  const navigate = useNavigate();

  const itemsData = useLevelItemsData();
  const operations = useLevelItemsOperations(itemsData);

  const isBuiltIn = itemsData.sphere?.type === "BUILT_IN";
  const isExternal = itemsData.sphere?.type === "EXTERNAL";
  const showExtendedColumns = !isBuiltIn;
  const showActions = !isExternal;

  const tableModeClass = isBuiltIn
    ? "level-items__table--built-in"
    : isExternal
      ? "level-items__table--external"
      : "level-items__table--default";

  const startItem = itemsData.totalItems > 0 ? (itemsData.currentPage - 1) * itemsData.pageSize + 1 : 0;
  const endItem = itemsData.totalItems > 0 ? Math.min(itemsData.currentPage * itemsData.pageSize, itemsData.totalItems) : 0;

  const handleNavigateToCreate = () => {
    savePreviousRoute(location.pathname + location.search);
    navigate(PRIVATE_ROUTES.CREATE_ITEM.replace(":id", itemsData.id || ""));
  };

  const handleNavigateToEdit = (itemId: number) => {
    savePreviousRoute(location.pathname + location.search);
    navigate(
      PRIVATE_ROUTES.EDIT_ITEM
        .replace(":id", itemsData.id || "")
        .replace(":itemId", itemId.toString())
    );
  };

  const renderActionsMenu = (item: Item) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="white" className="level-items__row-actions-button">
          <EllipsisVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard?.writeText(item.externalCode ?? "");
            toast({ title: "Copiado", description: "Código copiado para a área de transferência." });
          }}
        >
          <Copy size={16} />
          <span>Copiar código</span>
        </DropdownMenuItem>
        {!isBuiltIn && (
          <>
            <DropdownMenuItem onClick={() => handleNavigateToEdit(item.id)}>
              <PencilLine size={16} />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => operations.handleDelete(item)}>
              <Trash2 size={16} />
              <span>Excluir</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (itemsData.loading && !itemsData.sphere) {
    return (
      <div className="level-items__loader">
        <SectionLoader />
      </div>
    );
  }

  return (
    <motion.div
      className="level-items"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div>
        <HeaderContainer className="level-items__header-container">
          <div className="level-items__header">
            <div className="level-items__heading-main">
              <button
                type="button"
                className="level-items__back-button"
                onClick={() => {
                  navigate(PRIVATE_ROUTES.LEVELS);
                }}
              >
                <ArrowLeft size={18} />
              </button>
              <Heading
                className="level-items__heading"
                title="Itens da esfera"
                badgeValue={itemsData.totalItems}
                badgeClassName="app-badge app-badge--header"
                customDescription={(
                  <span className="level-items__heading-description">
                    Esfera: <span className="level-items__heading-description-value">{itemsData.sphere?.name}</span>
                  </span>
                )}
              />
            </div>

            <div className="level-items__actions">
              {!isBuiltIn && !isExternal && (
                <button
                  type="button"
                  className="ui-button ui-button--primary theme-button--primary level-items__primary-action"
                  onClick={handleNavigateToCreate}
                >
                  <CirclePlus /> Adicionar novo item
                </button>
              )}
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="level-items__scroll-area" viewportClassName="level-items__scroll-viewport">
        <div className="max-w-content-container level-items__content">
          <div className="level-items__mobile">
            <div className="level-items__mobile-filter">
              <div className="app-input-group app-input-group--icon-left level-items__mobile-filter-input">
                <Search className="app-input-group__icon" />
                <input
                  className="app-input"
                  placeholder="Pesquisar itens..."
                  value={itemsData.searchTerm}
                  onChange={operations.handleSearchChange}
                />
              </div>
            </div>

            {itemsData.filteredItems.length > 0 ? (
              <>
                <div className="level-items__cards">
                  {itemsData.filteredItems.map((item) => (
                    <div className="level-items__card" key={item.id}>
                      {showActions && (
                        <div className="level-items__card-header">
                          <span>Ações</span>
                          {renderActionsMenu(item)}
                        </div>
                      )}
                      <div className="level-items__card-content">
                        <div className="level-items__card-row">
                          <span className="level-items__card-label">Nome</span>
                          <span className="level-items__card-value">{item.name}</span>
                        </div>
                        {showExtendedColumns && (
                          <>
                            <div className="level-items__card-row">
                              <span className="level-items__card-label">Descrição</span>
                              <span className="level-items__card-value">{item.description || "-"}</span>
                            </div>
                            <div className="level-items__card-row">
                              <span className="level-items__card-label">Código</span>
                              <span className="level-items__card-value">{item.externalCode || "-"}</span>
                            </div>
                            <div className="level-items__card-row">
                              <span className="level-items__card-label">Item da esfera pai</span>
                              <span className="level-items__card-value">{operations.renderParentItem(item)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="level-items__mobile-pagination">
                  <TablePagination
                    className="level-items__pagination"
                    align="end"
                    currentPage={itemsData.currentPage}
                    totalPages={itemsData.totalPages}
                    onPageChange={operations.handlePageChange}
                  />
                </div>
              </>
            ) : !itemsData.loading ? (
              <div className="level-items__empty-state">
                <div>
                  <Plus size={24} />
                </div>
                <span>Nenhum item encontrado para esta esfera.</span>
              </div>
            ) : null}
          </div>

          <div className="level-items__desktop">
            <div className={`app-table ${showActions ? "app-table--icon" : ""} ${tableModeClass} level-items__table`}>
              <div className="app-table__filter">
                <div className="level-items__table-filter-content">
                  <div className="app-input-group app-input-group--icon-left level-items__table-filter-input">
                    <Search className="app-input-group__icon" />
                    <input
                      className="app-input"
                      placeholder="Pesquisar itens..."
                      value={itemsData.searchTerm}
                      onChange={operations.handleSearchChange}
                    />
                  </div>
                </div>
              </div>

              <div className="app-table__header">
                <div className="app-table__row">
                  <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--name">
                    <span>Nome</span>
                  </div>
                  {showExtendedColumns && (
                    <>
                      <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--description">
                        <span>Descrição</span>
                      </div>
                      <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--code">
                        <span>Código</span>
                      </div>
                      <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--parent-item">
                        <span>Item da esfera pai</span>
                      </div>
                    </>
                  )}
                  {showActions && (
                    <div className="app-table__cell app-table__cell--icon level-items__table-cell level-items__table-cell--actions">
                      <span>Ações</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="app-table__body">
                {itemsData.filteredItems.length > 0 ? (
                  itemsData.filteredItems.map((item) => (
                    <div key={item.id} className="app-table__row">
                      <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--name">
                        <span>{item.name}</span>
                      </div>
                      {showExtendedColumns && (
                        <>
                          <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--description">
                            <span>{item.description || "-"}</span>
                          </div>
                          <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--code">
                            <span>{item.externalCode || "-"}</span>
                          </div>
                          <div className="app-table__cell app-table__cell--content level-items__table-cell level-items__table-cell--parent-item">
                            <span>{operations.renderParentItem(item)}</span>
                          </div>
                        </>
                      )}
                      {showActions && (
                        <div className="app-table__cell app-table__cell--icon level-items__table-cell level-items__table-cell--actions">
                          {renderActionsMenu(item)}
                        </div>
                      )}
                    </div>
                  ))
                ) : !itemsData.loading ? (
                  <div className="app-table__row">
                    <div className="app-table__cell level-items__empty-state">
                      <div>
                        <Plus size={24} />
                      </div>
                      <span>Nenhum item encontrado para esta esfera.</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="app-table__footer">
                <div className="level-items__table-footer">
                  <div className="level-items__table-footer-info">
                    {startItem}-{endItem} de {itemsData.totalItems} itens
                  </div>
                  <div className="level-items__table-footer-pagination">
                    <TablePagination
                      className="level-items__pagination"
                      align="end"
                      currentPage={itemsData.currentPage}
                      totalPages={itemsData.totalPages}
                      onPageChange={operations.handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={operations.deleteModalOpen} onOpenChange={operations.setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
          </DialogHeader>
          <p className="app-dialog__text">
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
