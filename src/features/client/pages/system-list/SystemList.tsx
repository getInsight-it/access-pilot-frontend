import { HeaderContainer, Heading } from "@components/heading.tsx";
import { Link } from "react-router-dom";
import useAuthStore, { type AuthState } from "@store/authStore.ts";
import { useEffect } from "react";
import { buttonVariants } from "@ui/button.tsx";
import { cn } from "@config/lib/utils.ts";
import { EllipsisVertical, Plus, Edit, MonitorCog, RefreshCw, UserCog, Cog, LaptopMinimal, Copy } from "lucide-react";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { motion } from "framer-motion";
import { ScrollArea } from "@ui/scroll-area.tsx";
import { Input } from "@ui/input.tsx";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@ui/table.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu.tsx";
import { PaginationWrapper } from "@components/PaginationWrapper.tsx";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "@features/client/common/enum/client-status.enum";
import { Badge } from "@ui/badge.tsx";
import { useSystemListData, useSystemOperations, useSystemNavigation } from "./useSystemList.ts";
import { toast } from "@common/external/ui/use-toast.ts";

export default function SystemList() {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const {
    clients,
    setClients,
    totalSystems,
    currentPage,
    totalPages,
    searchFilter,
    isLoading,
    handlePageChange,
    handleSearchChange,
    init
  } = useSystemListData();
  const { syncClient, handlePublicationChange } = useSystemOperations(setClients);
  const { handleNavigateFromSystems } = useSystemNavigation();

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated, currentPage, searchFilter, init]);

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
              <Link
                to={PRIVATE_ROUTES.NEW_SYSTEM}
                className={cn(buttonVariants({ variant: "default" }))}
                onClick={() => savePreviousRoute(PRIVATE_ROUTES.SYSTEMS)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar novo sistema
              </Link>
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
                          <span className="table-card__value">{client.clientId}</span>
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
    </>
  );
}
