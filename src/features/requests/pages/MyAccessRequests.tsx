import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "../../../common/components/header/heading.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import { useEffect, useState } from "react";
import { buttonVariants } from "../../../components/ui/button.tsx";
import { cn } from "../../../config/lib/utils.ts";
import { EllipsisVertical, Plus, ReceiptText } from "lucide-react";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";

import { motion } from "framer-motion";
import { requestService } from "../common/api/request-service.ts";
import { RequestInterface } from "../common/types/request.model.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../components/ui/table.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { RequestStatusBadge } from "../common/components/RequestStatusBadge.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu.tsx";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import { PaginationWrapper } from "../../../common/components/PaginationWrapper.tsx";

const breadcrumbItems = [
  { title: "Minhas solicitações", link: "/dashboard/my-access-requests" }
];

export default function MyAccessRequests() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const init = () => {
    getData(currentPage, pageSize, "");
  };

  const getData = async (page: number, size: number, filter: string) => {
    const pageResponse = await requestService.getRequestsMePaginated(page, size, "id", "desc", "created", filter);
    setRequests(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
    setTotalPages(Math.ceil((pageResponse?.total ?? 0) / size));
  };

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(page);
  };

  return (
    <>
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div className="flex-none">
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div className="pl-1 flex items-start justify-between">
              <Heading
                title="Minhas Solicitações"
                badgeValue={totalUsers}
                description="Gerenciar suas solicitações de acesso."
              />
              <Link to={PRIVATE_ROUTES.REQUEST_ACCESS} className={cn(buttonVariants({ variant: "default" }))}>
                <Plus className="mr-2 h-4 w-4" /> Solicitar novo acesso
              </Link>
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea className="px-6 flex-grow">
          <div className="py-6 max-w-content-container m-auto">
            <Table auxiliaryHeader={
              <div className="p-4 w-96">
                <Input
                  variant="dark"
                  placeholder="Filtrar por Sistema..."
                  className="h-8 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
                />
              </div>
            }>
              <TableHeader>
                <TableRow>
                  <TableHead width="calc(20% - 20px)">Protocolo</TableHead>
                  <TableHead width="calc(20% - 20px)">Sistema</TableHead>
                  <TableHead width="calc(20% - 20px)">Papel</TableHead>
                  <TableHead width="calc(20% - 20px)">Data de submissão</TableHead>
                  <TableHead width="calc(20% - 20px)">Status</TableHead>
                  <TableHead className="flex align-center justify-center" width="100px">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests && requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell width="calc(20% - 20px)">{request.protocolCode}</TableCell>
                    <TableCell width="calc(20% - 20px)">{request.role!.client!.name}</TableCell>
                    <TableCell width="calc(20% - 20px)">{request.role.label}</TableCell>
                    <TableCell width="calc(20% - 20px)">{new Date(request.criacao).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }).replace(",", " -")}</TableCell>
                    <TableCell width="calc(20% - 20px)">{RequestStatusBadge(request.status)}</TableCell>
                    <TableCell className="flex align-center justify-center" width="100px">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical size={20} className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex flex-row gap-2">
                            <ReceiptText size={16} />
                            <span onClick={() => {
                              savePreviousRoute(PRIVATE_ROUTES.ACCESS_REQUESTS);
                              navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", request.id.toString()));
                            }}>Detalhes</span>
                          </DropdownMenuItem>
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
                    onPageChange={(page) => handlePageChange(page)}
                  />
                </div>
              </TableFooter>
            </Table>
          </div>
        </ScrollArea>
      </motion.div>
    </>
  );
}
