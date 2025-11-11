import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { Link } from "react-router-dom";
import useAuthStore, { type AuthState } from "../../../../store/authStore.ts";
import { useEffect } from "react";
import { buttonVariants } from "../../../../common/external/ui/button.tsx";
import { cn } from "../../../../config/lib/utils.ts";
import { EllipsisVertical, Plus, Edit, MonitorCog, RefreshCw, UserCog, Cog, LaptopMinimal, Info } from "lucide-react";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";

import { motion } from "framer-motion";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Input } from "../../../../common/external/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../../common/external/ui/table.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../common/external/ui/dropdown-menu.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../common/external/ui/popover.tsx";
import { PaginationWrapper } from "../../../../common/components/PaginationWrapper.tsx";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "../../common/enum/client-status.enum.ts";
import { Badge } from "../../../../common/external/ui/badge.tsx";
import {
  useSystemListData,
  useSystemOperations,
  useSystemNavigation,
  usePopoverState
} from "./useSystemList.ts";

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
  const { openPopoverId, handleMouseEnter, handleMouseLeave } = usePopoverState();

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
                          <Popover open={openPopoverId === client.clientId}>
                            <PopoverTrigger asChild>
                              <button
                                className="inline-flex items-center justify-center rounded-sm p-0.5 transition-colors"
                                onMouseEnter={() => handleMouseEnter(client.clientId)}
                                onMouseLeave={handleMouseLeave}
                              >
                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-3"
                              align="start"
                              onMouseEnter={() => handleMouseEnter(client.clientId)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div className="text-sm">
                                <span className="font-medium">Client ID:</span> {client.clientId}
                              </div>
                            </PopoverContent>
                          </Popover>
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
