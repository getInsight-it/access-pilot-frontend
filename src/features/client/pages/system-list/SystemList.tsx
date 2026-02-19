import { HeaderContainer, Heading } from "@components/heading.tsx";
import { Link } from "react-router-dom";
import useAuthStore, { type AuthState } from "@store/authStore.ts";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@ui/button.tsx";
import { cn } from "@config/lib/utils.ts";
import { EllipsisVertical, Plus, Edit, MonitorCog, RefreshCw, UserCog, Cog, LaptopMinimal, Copy, Loader2, FileUp, FileDown } from "lucide-react";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { motion } from "framer-motion";
import { ScrollArea } from "@ui/scroll-area.tsx";
import { Input } from "@ui/input.tsx";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@ui/table.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui/dialog.tsx";
import { Switch } from "@ui/switch.tsx";
import { PaginationWrapper } from "@components/PaginationWrapper.tsx";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "@features/client/common/enum/client-status.enum";
import { Badge } from "@ui/badge.tsx";
import { useSystemListData, useSystemOperations, useSystemNavigation } from "./useSystemList.ts";
import { toast } from "@common/external/ui/use-toast.ts";
import { clientService } from "../../common/service/client-service.ts";
import type { ClientExport } from "../../common/model/client-export.model.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { ImportClientsDialog } from "./partials/ImportClientsDialog.tsx";

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
        className="flex flex-col h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div className="flex-none">
          <HeaderContainer>
            <div className="pl-1 flex flex-col md:flex-row items-start justify-between gap-4">
              <Heading
                title="Sistemas"
                badgeValue={totalSystems}
                description="Gerenciar sistemas cadastrados no ambiente."
              />
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={openSyncAllModal}
                  disabled={syncAllLoading}
                  className="w-full sm:w-auto flex items-center justify-center"
                  title="Sincronizar todos os sistemas do IDP">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportAllClients}
                  disabled={exportAllLoading || isLoading}
                  className="w-full sm:w-auto flex items-center justify-center"
                  title="Exportar todos os sistemas filtrados">
                  {exportAllLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openImportModal()}
                  className="w-full sm:w-auto flex items-center justify-center"
                  title="Importar exportações de sistemas">
                  <FileUp className="h-4 w-4" />
                </Button>
                <Link
                  to={PRIVATE_ROUTES.NEW_SYSTEM}
                  className={cn(buttonVariants({ variant: "default" }))}
                  onClick={() => savePreviousRoute(PRIVATE_ROUTES.SYSTEMS)}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar novo sistema
                </Link>
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
                  placeholder="Filtrar..."
                  value={searchFilter}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
                />
              </div>
              {clients && clients.length > 0 ? (
                <>
                  {clients.map((client, index) => (
                    <div className="table-card" key={`mobile-table-card-${index}`}>
                      <div className="table-card__header">
                        <div className="flex items-center justify-between">
                          <span className="mr-2">Ações</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical size={20} className="cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="flex flex-row gap-2"
                                onClick={() => { navigator.clipboard?.writeText(client.id?.toString() ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                                <Copy size={16} />
                                <span>Copiar Código</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex flex-row gap-2"
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_DETAILS, client.clientId) }}>
                                <MonitorCog size={16} />
                                <span>Detalhes</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex flex-row gap-2"
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_EDIT, client.clientId) }}>
                                <Edit size={16} />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex flex-row gap-2"
                                onClick={() => { handleExportClient(client.id, client.clientId); }}>
                                <FileDown size={16} />
                                <span>Exportar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex flex-row gap-2"
                                onClick={() => { openImportModal(client.clientId); }}>
                                <FileUp size={16} />
                                <span>Importar</span>
                              </DropdownMenuItem>
                              {client.managed && (
                                <DropdownMenuItem
                                  className="flex flex-row gap-2"
                                  onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.ROLES, client.clientId) }}>
                                  <UserCog size={16}/>
                                  Gerenciar Papéis
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => { syncClient(client) }} className="flex flex-row gap-2">
                                <RefreshCw size={16}/>
                                Sincronizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { handlePublicationChange(client) }} className="flex flex-row gap-2">
                                <Cog size={16}/>
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
                            {!client.status
                              ? (<Badge variant="secondary">Desconhecido</Badge>)
                              : (client.status === ClientStatusEnum.PUBLISHED
                                ? (<Badge variant="info">{ClientStatusTranslationEnum[client.status as keyof typeof ClientStatusTranslationEnum]}</Badge>)
                                : (<Badge variant="warning">{ClientStatusTranslationEnum[client.status as keyof typeof ClientStatusTranslationEnum]}</Badge>))
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-4">
                    <PaginationWrapper
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalSystems}
                      onPageChange={(page) => handlePageChange(page)}
                    />
                  </div>
                </>
              ) : !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <LaptopMinimal size={24} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">Nenhum sistema encontrado</span>
                </div>
              ) : null}
            </div>
            <div className="hidden lg:flex flex-col gap-4">
              <div className="w-96 max-w-full">
                <Input
                  placeholder="Filtrar..."
                  value={searchFilter}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 w-full"
                />
              </div>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead width="calc(40% - 33px)">Sistema</TableHead>
                  <TableHead width="calc(40% - 33px)">Descrição</TableHead>
                  <TableHead width="calc(20% - 34px)">Status</TableHead>
                  <TableHead className="flex align-center justify-center" width="100px">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients && clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell width="calc(40% - 33px)">
                        <div className="flex items-center gap-2">
                          <span>{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell width="calc(40% - 33px)">{client.description || '-'}</TableCell>
                      <TableCell width="calc(20% - 34px)">
                        {!client.status
                          ? (<Badge variant="secondary">Desconhecido</Badge>)
                          : (client.status === ClientStatusEnum.PUBLISHED
                            ? (<Badge variant="info">{ClientStatusTranslationEnum[client.status as keyof typeof ClientStatusTranslationEnum]}</Badge>)
                            : (<Badge variant="warning">{ClientStatusTranslationEnum[client.status as keyof typeof ClientStatusTranslationEnum]}</Badge>))
                        }
                      </TableCell>
                      <TableCell className="flex align-center justify-center" width="100px">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical size={20} className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => { navigator.clipboard?.writeText(client.id?.toString() ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                              <Copy size={16} />
                              <span>Copiar Código</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_DETAILS, client.clientId) }}>
                              <MonitorCog size={16} />
                              <span>Detalhes</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.SYSTEMS_EDIT, client.clientId) }}>
                              <Edit size={16} />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => { handleExportClient(client.id, client.clientId); }}>
                              <FileDown size={16} />
                              <span>Exportar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => { openImportModal(client.clientId); }}>
                              <FileUp size={16} />
                              <span>Importar</span>
                            </DropdownMenuItem>
                            {client.managed && (
                              <DropdownMenuItem
                                className="flex flex-row gap-2"
                                onClick={() => { handleNavigateFromSystems(PRIVATE_ROUTES.ROLES, client.clientId) }}>
                                <UserCog size={16}/>
                                Gerenciar Papéis
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => { syncClient(client) }} className="flex flex-row gap-2">
                              <RefreshCw size={16}/>
                              Sincronizar
                            </DropdownMenuItem>
                            {client.managed && (
                              <DropdownMenuItem onClick={() => { handlePublicationChange(client) }} className="flex flex-row gap-2">
                                <Cog size={16}/>
                                {client.status === ClientStatusEnum.PUBLISHED ? "Despublicar" : "Publicar"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : !isLoading ? (
                  <TableRow>
                    <TableCell {...{ colSpan: 2 }} className="py-12">
                      <div className="flex flex-col items-center justify-center text-center w-full">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <LaptopMinimal size={24} className="text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500">Nenhum sistema encontrado</span>
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
                    totalItems={totalSystems}
                    onPageChange={(page) => handlePageChange(page)}
                  />
                </div>
              </TableFooter>
            </Table>
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
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Sincronizar sistemas</DialogTitle>
            <DialogDescription>
              Esta ação busca todos os sistemas no Keycloak e atualiza o cadastro local.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-4 rounded-md border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Sincronizar papéis também?
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Pode aumentar o tempo da operação.
              </span>
            </div>
            <Switch checked={syncRoles} onCheckedChange={setSyncRoles} disabled={syncAllLoading} />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSyncAllOpen(false)} disabled={syncAllLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSyncAll} disabled={syncAllLoading}>
              {syncAllLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {syncAllLoading ? "Sincronizando..." : "Sincronizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
