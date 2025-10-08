import { Breadcrumbs } from "../../../common/components/breadcrumbs.tsx";
import TreeRole from "./partials/TreeRole.tsx";
import { Separator } from "../../../common/external/ui/separator.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore.ts";
import { motion } from "framer-motion";
import { roleService } from "../common/service/role-service.ts";
import { RoleResponseInterface } from "../common/types/role.model.ts";
import { HeaderContainer, Heading } from "../../../common/components/heading.tsx";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { Button } from "../../../common/external/ui/button.tsx";
import { Edit, EllipsisVertical, Plus } from "lucide-react";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../common/external/ui/table.tsx";
import { Input } from "../../../common/external/ui/input.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../common/external/ui/dropdown-menu.tsx";
import { PaginationWrapper } from "../../../common/components/PaginationWrapper.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/external/ui/tabs.tsx";
import { toast } from "../../../common/external/ui/use-toast.ts";

const breadcrumbItems = [
  { title: "Gerenciar Sistemas", link: "/dashboard/systems" },
  { title: "Gerenciar papéis", link: "/dashboard/:client" }
];

export default function ManageRoles() {
  const { clientId } = useParams<{ clientId: string }>();
  const [allRoles, setAllRoles] = useState<RoleResponseInterface[]>([]);
  const [paginatedRoles, setPaginatedRoles] = useState<RoleResponseInterface[]>([]);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getData = async () => {
    try {
      if(clientId) {
        const roles = await roleService.getRolesByClientId(clientId);
        setAllRoles(roles || []);

        const totalPages = Math.ceil((roles?.length || 0) / pageSize);
        setTotalPages(totalPages);
        updatePaginatedRoles(roles || [], currentPage);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar papéis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaginatedRoles = (roles: RoleResponseInterface[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = roles.slice(startIndex, endIndex);
    setPaginatedRoles(paginatedData);
  };

  const init = () => {
    getData();
  };

  useEffect(() => {
    if(isAuthenticated)
      init();
  }, [isAuthenticated, clientId]);

  useEffect(() => {
    if(allRoles.length > 0) {
      updatePaginatedRoles(allRoles, currentPage);
    }
  }, [currentPage, allRoles]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

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
                title="Gerenciar papéis"
                badgeValue={allRoles.length.toString() || "0"}
                customDescription={
                  <span className="text-md">
                    Sistema: <span
                      onClick={() => {
                        navigate(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", clientId!));
                      }}
                      className="text-primary-600 cursor-pointer underline">app-gerenciado-accesspilot-1</span>
                  </span>
                }
              />
              <Button onClick={() => {
                savePreviousRoute(location.pathname + location.search);
                navigate(PRIVATE_ROUTES.NEW_ROLE.replace(":clientId", clientId!));
              }}>
                <Plus className="mr-2 h-4 w-4" /> Novo papel
              </Button>
            </div>
          </HeaderContainer>
          <Separator></Separator>
        </div>

        <ScrollArea className="px-6 flex-grow">
          <div className="py-6 max-w-content-container m-auto">
            <Tabs defaultValue="roles">
              <TabsList className="mb-4">
                <TabsTrigger value="roles">Papéis</TabsTrigger>
                <TabsTrigger value="roles_hierarchy">Hierarquia de papéis</TabsTrigger>
              </TabsList>
              <TabsContent value="roles" className="flex flex-col gap-4">
                <div className="w-96">
                  <Input
                    placeholder="Buscar solicitação..."
                    className="h-10 w-full"
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead width="calc(25% - 25px)">Label</TableHead>
                      <TableHead width="calc(25% - 25px)">Label papel pai</TableHead>
                      <TableHead width="calc(25% - 25px)">Descrição</TableHead>
                      <TableHead width="calc(25% - 25px)">Esfera</TableHead>
                      <TableHead className="flex align-center justify-center" width="100px">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRoles && paginatedRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell width="calc(25% - 25px)">{role.label}</TableCell>
                        <TableCell width="calc(25% - 25px)">
                          {role.roleParent?.label || <span className="text-gray-400">Não informado</span>}
                        </TableCell>
                        <TableCell width="calc(25% - 25px)">{role.description}</TableCell>
                        <TableCell width="calc(25% - 25px)">
                          {role.level?.name || <span className="text-gray-400">Não informado</span>}
                        </TableCell>
                        <TableCell className="flex align-center justify-center" width="100px">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical size={20} className="cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex flex-row gap-2">
                                <Edit size={16} />
                                <span onClick={() => {
                                  savePreviousRoute(location.pathname + location.search);
                                  navigate(
                                    PRIVATE_ROUTES.ROLES_EDIT
                                      .replace(":clientId", clientId!)
                                      .replace(":id", role.id.toString())
                                  );
                                }}>Editar</span>
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
              </TabsContent>
              <TabsContent value="roles_hierarchy">
                <div>
                  <h2 className="text-xl mb-4">Arraste para organizar a hierarquia.</h2>
                  {!loading && <TreeRole data={allRoles} onSuccess={() => getData()} />}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </motion.div>
    </>
  );
}
