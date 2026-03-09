import { Link } from "react-router-dom";
import useAuthStore, { type AuthState } from "@store/authStore.ts";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@ui/button.tsx";
import { cn } from "@config/lib/utils.ts";
import { EllipsisVertical, RefreshCw, LaptopMinimal, Copy, Loader2, Search, Circle, Eye, PencilLine, Download, Upload, ShieldUser, RefreshCcw, Power, CirclePlus } from "lucide-react";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { motion } from "framer-motion";
import { ScrollArea } from "@ui/scroll-area.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { TablePagination } from "@components/table-pagination/TablePagination.tsx";
import { Toggle } from "@common/components/toggle/Toggle.tsx";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "@features/client/common/enum/client-status.enum";
import { useSystemListData, useSystemOperations, useSystemNavigation } from "./useSystemList.ts";
import { toast } from "@common/external/ui/use-toast.ts";
import { clientService } from "../../common/service/client-service.ts";
import type { ClientExport } from "../../common/model/client-export.model.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { ImportClientsDialog } from "./partials/ImportClientsDialog.tsx";
import "./SystemList.scss";
import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";

export default function SystemList() {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const {
    clients,
    setClients,
    totalSystems,
    pageSize,
    currentPage,
    totalPages,
    searchFilter,
    isLoading,
    handlePageChange,
    handleSearchChange,
    init
  } = useSystemListData();
  const { syncClient, syncAllClients, syncAllLoading, handlePublicationChange } = useSystemOperations(setClients, init);
  const { handleNavigateFromSystems } = useSystemNavigation();
  const [syncAllOpen, setSyncAllOpen] = useState(false);
  const [syncRoles, setSyncRoles] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importForce, setImportForce] = useState(true);
  const [importRoles, setImportRoles] = useState(true);
  const [importConfigurations, setImportConfigurations] = useState(true);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importTargetClientId, setImportTargetClientId] = useState<string | null>(null);
  const [exportAllLoading, setExportAllLoading] = useState(false);
  const startItem = totalSystems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalSystems > 0 ? Math.min(currentPage * pageSize, totalSystems) : 0;

  const renderStatusBadge = (status?: ClientStatusEnum) => {
    const statusLabel = !status
      ? "Desconhecido"
      : ClientStatusTranslationEnum[status as keyof typeof ClientStatusTranslationEnum];
    const badgeModifier = status === ClientStatusEnum.PUBLISHED
      ? "app-badge--status-published"
      : "app-badge--status-unpublished";

    return (
      <span className={cn("app-badge", badgeModifier)}>
        <Circle className="app-badge__icon" />
        <span>{statusLabel}</span>
      </span>
    );
  };

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated, currentPage, searchFilter, init]);

  const openSyncAllModal = () => {
    setSyncRoles(false);
    setSyncAllOpen(true);
  };

  const handleSyncAll = async () => {
    const summary = await syncAllClients(syncRoles);
    if (summary) {
      setSyncAllOpen(false);
    }
  };

  const openImportModal = (clientId?: string) => {
    setImportForce(true);
    setImportRoles(true);
    setImportConfigurations(true);
    setImportFile(null);
    setImportTargetClientId(clientId ?? null);
    setImportOpen(true);
  };

  const handleExportClient = async (clientId?: number, clientKey?: string) => {
    if (!clientId) {
      toast({
        title: "Erro ao exportar",
        description: "ID do sistema não encontrado",
        variant: "destructive"
      });
      return;
    }
    try {
      const response = await clientService.exportClient(clientId, true, true);
      const blob = new Blob([response.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `client_export_${clientKey ?? clientId}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Exportação concluída",
        description: "A exportação foi baixada com sucesso."
      });
    } catch (error: unknown) {
      const errorMessage = formatErrorMessages(error);
      toast({
        title: "Erro ao exportar",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleExportAllClients = async () => {
    if (!totalSystems) {
      toast({
        title: "Nada para exportar",
        description: "Nenhum sistema encontrado para exportação.",
        variant: "destructive"
      });
      return;
    }

    setExportAllLoading(true);
    try {
      const exports: ClientExport[] = [];
      for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
        const pageExports = await clientService.exportClientsPage(pageIndex, pageSize, "id", "asc", searchFilter, true, true);
        exports.push(...pageExports);
      }

      const blob = new Blob([JSON.stringify(exports)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clients_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `Exportados ${exports.length} sistemas.`
      });
    } catch (error: unknown) {
      const errorMessage = formatErrorMessages(error);
      toast({
        title: "Erro ao exportar sistemas",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setExportAllLoading(false);
    }
  };

  const handleImportExports = async () => {
    if (!importFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Selecione um arquivo JSON para continuar.",
        variant: "destructive"
      });
      return;
    }

    setImportLoading(true);
    try {
      const fileContent = await importFile.text();
      const parsed = JSON.parse(fileContent);
      let exportItems = Array.isArray(parsed) ? parsed : [parsed];

      if (importTargetClientId) {
        const target = importTargetClientId.trim().toLowerCase();
        exportItems = exportItems.filter(exportItem => (exportItem?.client?.clientId ?? "").toString().trim().toLowerCase() === target);
        if (exportItems.length === 0) {
          toast({
            title: "Cliente não encontrado no arquivo",
            description: `Nenhuma exportação corresponde ao cliente ${importTargetClientId}.`,
            variant: "destructive"
          });
          return;
        }
      }

      const summary = await clientService.importClients({
        force: importForce,
        importRoles: importRoles,
        importConfigurations: importConfigurations,
        exports: exportItems
      });

      const durationLabel = summary.duration >= 1000
        ? `${(summary.duration / 1000).toFixed(1)}s`
        : `${summary.duration}ms`;

      toast({
        title: "Importação concluída",
        description: `Criados ${summary.created} • Atualizados ${summary.updated} • Ignorados ${summary.ignored} • Erros ${summary.errors} • Duração ${durationLabel}`
      });
      init();
      setImportOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof SyntaxError
        ? "Arquivo JSON inválido."
        : formatErrorMessages(error);
      toast({
        title: "Erro ao importar exportações",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="system-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div>
          <HeaderContainer className="system-list__header-container">
            <div className="system-list__header">
              <Heading
                className="system-list__heading"
                title="Sistemas"
                badgeValue={totalSystems}
                badgeClassName="app-badge app-badge--header"
                description="Gerenciar sistemas cadastrados no ambiente."
              />
              <div className="system-list__actions">
                <div className="system-list__actions-group">
                  <Button
                    className="system-list__action-button"
                    variant="white"
                    onClick={openSyncAllModal}
                    disabled={syncAllLoading}
                    title="Sincronizar todos os sistemas do IDP">
                    <RefreshCcw />
                  </Button>
                  <Button
                    className="system-list__action-button"
                    variant="white"
                    onClick={handleExportAllClients}
                    disabled={exportAllLoading || isLoading}
                    title="Exportar todos os sistemas filtrados">
                    {exportAllLoading ? <Loader2 className="animate-spin" /> : <Download />}
                  </Button>
                  <Button
                    className="system-list__action-button"
                    variant="white"
                    onClick={() => openImportModal()}
                    title="Importar exportações de sistemas">
                    <Upload />
                  </Button>
                </div>
                <Link
                  to={PRIVATE_ROUTES.NEW_SYSTEM}
                  className={cn(buttonVariants({ variant: "default" }), "theme-button--primary", "system-list__primary-action")}
                  onClick={() => savePreviousRoute(PRIVATE_ROUTES.SYSTEMS)}>
                  <CirclePlus /> Adicionar novo sistema
                </Link>
              </div>
            </div>
          </HeaderContainer>
        </div>

        <ScrollArea className="system-list__scroll-area" viewportClassName="system-list__scroll-viewport">
          <div className="max-w-content-container system-list__content">
            <div className="system-list__mobile">
              <div>
                <div className="app-input-group app-input-group--icon-left">
                  <Search className="app-input-group__icon" />
                  <input
                    className="app-input"
                    placeholder="Filtrar..."
                    value={searchFilter}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
              {clients && clients.length > 0 ? (
                <>
                  {clients.map((client, index) => (
                    <div className="table-card" key={`mobile-table-card-${index}`}>
                      <div className="table-card__header">
                        <div>
                          <span>Ações</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical size={20} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => { navigator.clipboard?.writeText(client.id?.toString() ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                                <Copy size={16} />
                                <span>Copiar Código</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_DETAILS, client.clientId) }}>
                                <Eye size={16} />
                                <span>Detalhes</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_EDIT, client.clientId) }}>
                                <PencilLine size={16} />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { handleExportClient(client.id, client.clientId); }}>
                                <Download size={16} />
                                <span>Exportar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { openImportModal(client.clientId); }}>
                                <Upload size={16} />
                                <span>Importar</span>
                              </DropdownMenuItem>
                              {client.managed && (
                                <DropdownMenuItem
                                  onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.ROLES, client.clientId) }}>
                                  <ShieldUser size={16}/>
                                  Gerenciar Papéis
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => { syncClient(client) }}>
                                <RefreshCcw size={16}/>
                                Sincronizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { handlePublicationChange(client) }}>
                                <Power size={16}/>
                                {client.status === ClientStatusEnum.PUBLISHED ? "Despublicar" : "Publicar"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="table-card__content">
                        <div className="table-card__content__row">
                          <span className="table-card__label">Sistema</span>
                          <span className="table-card__value">{client.name}</span>
                        </div>
                        <div className="table-card__content__row">
                          <span className="table-card__label">Descrição</span>
                          <span className="table-card__value">{client.description || '-'}</span>
                        </div>
                        <div className="table-card__content__row">
                          <span className="table-card__label">Status</span>
                          <span className="table-card__value">
                            {renderStatusBadge(client.status as any)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <TablePagination
                      className="system-list__table-pagination"
                      align="end"
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => handlePageChange(page)}
                    />
                  </div>
                </>
              ) : !isLoading ? (
                <div>
                  <div>
                    <LaptopMinimal size={24} />
                  </div>
                  <span>Nenhum sistema encontrado</span>
                </div>
              ) : null}
            </div>
            <div className="system-list__desktop">
              <div className="app-table app-table--icon system-list__table">
                <div className="app-table__filter">
                  <div className="system-list__table-filter-content">
                    <div className="app-input-group app-input-group--icon-left system-list__table-filter-input">
                      <Search className="app-input-group__icon" />
                      <input
                        className="app-input"
                        placeholder="Filtrar..."
                        value={searchFilter}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="app-table__header">
                  <div className="app-table__row">
                    <div className="app-table__cell app-table__cell--content system-list__table-cell system-list__table-cell--name">
                      <span>Sistema</span>
                    </div>
                    <div className="app-table__cell app-table__cell--content system-list__table-cell system-list__table-cell--description">
                      <span>Descrição</span>
                    </div>
                    <div className="app-table__cell app-table__cell--content system-list__table-cell system-list__table-cell--status">
                      <span>Status</span>
                    </div>
                    <div className="app-table__cell app-table__cell--icon system-list__table-cell system-list__table-cell--actions">
                      <span>Ações</span>
                    </div>
                  </div>
                </div>

                <div className="app-table__body">
                  {clients && clients.length > 0 ? (
                    clients.map((client) => (
                      <div key={client.id} className="app-table__row">
                        <div className="app-table__cell app-table__cell--content system-list__table-cell system-list__table-cell--name">
                          <span>{client.name}</span>
                        </div>
                        <div className="app-table__cell app-table__cell--content system-list__table-cell system-list__table-cell--description">
                          <span>{client.description || '-'}</span>
                        </div>
                        <div className="app-table__cell app-table__cell--content system-list__table-cell system-list__table-cell--status">
                          {renderStatusBadge(client.status as any)}
                        </div>
                        <div className="app-table__cell app-table__cell--icon system-list__table-cell system-list__table-cell--actions">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="white" className="system-list__row-actions-button">
                                <EllipsisVertical size={20} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => { navigator.clipboard?.writeText(client.id?.toString() ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                                <Copy size={16} />
                                <span>Copiar Código</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_DETAILS, client.clientId) }}>
                                <Eye size={16} />
                                <span>Detalhes</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_EDIT, client.clientId) }}>
                                <PencilLine size={16} />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { handleExportClient(client.id, client.clientId); }}>
                                <Download size={16} />
                                <span>Exportar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { openImportModal(client.clientId); }}>
                                <Upload size={16} />
                                <span>Importar</span>
                              </DropdownMenuItem>
                              {client.managed && (
                                <DropdownMenuItem
                                  onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.ROLES, client.clientId) }}>
                                  <ShieldUser size={16}/>
                                  Gerenciar Papéis
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => { syncClient(client) }}>
                                <RefreshCcw size={16}/>
                                Sincronizar
                              </DropdownMenuItem>
                              {client.managed && (
                                <DropdownMenuItem onClick={() => { handlePublicationChange(client) }}>
                                  <Power size={16}/>
                                  {client.status === ClientStatusEnum.PUBLISHED ? "Despublicar" : "Publicar"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : !isLoading ? (
                    <div className="app-table__row">
                      <div className="app-table__cell system-list__table-empty-state">
                        <div>
                          <LaptopMinimal size={24} />
                        </div>
                        <span>Nenhum sistema encontrado</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="app-table__footer">
                  <div className="system-list__table-footer">
                    <div className="system-list__table-footer-info">
                      {startItem}-{endItem} de {totalSystems} itens
                    </div>
                    <div className="system-list__table-footer-pagination">
                      <TablePagination
                        className="system-list__table-pagination"
                        align="end"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => handlePageChange(page)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </motion.div>

      <ImportClientsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        importTargetClientId={importTargetClientId}
        importFile={importFile}
        importLoading={importLoading}
        importForce={importForce}
        importRoles={importRoles}
        importConfigurations={importConfigurations}
        onImportForceChange={setImportForce}
        onImportRolesChange={setImportRoles}
        onImportConfigurationsChange={setImportConfigurations}
        onImportFileChange={setImportFile}
        onImport={handleImportExports}
      />

      <Dialog open={syncAllOpen} onOpenChange={setSyncAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sincronizar sistemas</DialogTitle>
            <DialogDescription>
              Esta ação busca todos os sistemas no Keycloak e atualiza o cadastro local.
            </DialogDescription>
          </DialogHeader>

          <div className="app-dialog__body">
            <div className="app-dialog__surface">
              <div className="app-dialog__surface-main">
                <span className="app-dialog__surface-title">
                  Sincronizar papéis também?
                </span>
                <span className="app-dialog__surface-description">
                  Pode aumentar o tempo da operação.
                </span>
              </div>
              <Toggle checked={syncRoles} onCheckedChange={setSyncRoles} disabled={syncAllLoading} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncAllOpen(false)} disabled={syncAllLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSyncAll} disabled={syncAllLoading}>
              {syncAllLoading ? <Loader2 className="app-dialog__button-icon animate-spin" /> : <RefreshCw className="app-dialog__button-icon" />}
              {syncAllLoading ? "Sincronizando..." : "Sincronizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
