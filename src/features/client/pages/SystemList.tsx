import { HeaderContainer, Heading } from "../../../common/components/heading.tsx";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import { useEffect, useState } from "react";
import { buttonVariants } from "../../../common/external/ui/button.tsx";
import { cn } from "../../../config/lib/utils.ts";
import { EllipsisVertical, Plus, Edit, MonitorCog, RefreshCw, UserCog, Cog } from "lucide-react";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";

import { motion } from "framer-motion";
import { clientService } from "../common/service/client-service.ts";
import { ClientResponseInterface } from "../common/model/client.model.ts";
import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";
import { Input } from "../../../common/external/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../common/external/ui/table.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../common/external/ui/dropdown-menu.tsx";
import { PaginationWrapper } from "../../../common/components/PaginationWrapper.tsx";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import { toast } from "../../../common/external/ui/use-toast.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "../common/enum/client-status.enum.ts";
import { Badge } from "../../../common/external/ui/badge.tsx";
import { formatErrorMessages } from "../../../common/utils/error-utils.ts";

export default function SystemList() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [clients, setClients] = useState<ClientResponseInterface[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");

  const init = () => {
    getData(currentPage, pageSize, searchFilter);
  };

  const getData = async (page: number, size: number, searchFilter: string = "") => {
    try {
      const pageResponse = await clientService.getClientsPaginated(page, size, "id", "asc", searchFilter);
      setClients(pageResponse?.items || []);
      setTotalUsers(pageResponse?.total ?? 0);
      setTotalPages(Math.ceil((pageResponse?.total ?? 0) / size));
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao carregar sistemas",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const syncClient = async (client: ClientResponseInterface) => {
    try {
      await clientService.syncClient(client.clientId);
      toast({
        title: "Sistema sincronizado",
        description: "O sistema foi sincronizado com sucesso"
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao sincronizar sistema",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }

  const handlePublicationChange = async (client: ClientResponseInterface) => {
    const newStatus = client.status === ClientStatusEnum.PUBLISHED ? ClientStatusEnum.UNPUBLISHED : ClientStatusEnum.PUBLISHED;
    const toastMessage = client.status === ClientStatusEnum.PUBLISHED ? "despublicado" : "publicado";

    try {
      const updatedClient = await clientService.updateSystemPublication(client.id!, newStatus);

      setClients(prevClients =>
        prevClients.map(c => c.id === updatedClient.id ? updatedClient : c)
      );

      toast({
        title: "Sistema atualizado",
        description: `O sistema foi ${toastMessage} com sucesso!`
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: `Erro ao ${toastMessage} sistema`,
        description: errorMessage,
        variant: "destructive"
      });
    }
  }

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated, currentPage, searchFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchFilter(value);
    setCurrentPage(1);
  };

  const navigate = useNavigate();
  const handleNavigateFromSystems = (route: string, clientId: string) => {
    savePreviousRoute(PRIVATE_ROUTES.SYSTEMS);
    navigate(route.replace(":clientId", clientId));
  }

  return (
    <>
      <motion.div
        className="flex flex-col h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div className="flex-none">
          <HeaderContainer>
            {/* <Breadcrumbs items={breadcrumbItems} /> */}

            <div className="pl-1 flex flex-col md:flex-row items-start justify-between gap-4">
              <Heading
                title="Sistemas"
                badgeValue={totalUsers}
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

        <ScrollArea className="flex-grow" viewportClassName="px-7">
          <div className="py-6 max-w-content-container m-auto">
            <div className="flex flex-col gap-4 lg:hidden w-full sm:w-auto">
              <div className="w-96">
                <Input
                  variant="dark"
                  placeholder="Filtrar por Sistema..."
                  value={searchFilter}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
                />
              </div>
              {clients && clients.map((client, index) => (
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
                            {client.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
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
                  totalItems={totalUsers}
                  onPageChange={(page) => handlePageChange(page)}
                />
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4">
              <div className="w-96">
                <Input
                  placeholder="Filtrar por Sistema..."
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
                {clients && clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell width="calc(40% - 33px)">{client.clientId}</TableCell>
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
                              {client.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <div className="p-4">
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalUsers}
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
