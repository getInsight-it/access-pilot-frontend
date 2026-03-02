import { Breadcrumbs } from "../../../../common/components/breadcrumbs.tsx";
import RoleHierarchy from "./partials/RoleHierarchy.tsx";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore, { AuthState } from "../../../../store/authStore.ts";
import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { Button } from "../../../../common/external/ui/button.tsx";
import { Plus } from "lucide-react";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../common/external/ui/tabs.tsx";
import { useManageRolesData, useRoleNavigation } from "./useManageRoles.ts";
import { RolesTable } from "./partials/RolesTable.tsx";

const breadcrumbItems = [
  { title: "Gerenciar Sistemas", link: PRIVATE_ROUTES.SYSTEMS },
  { title: "Gerenciar papéis", link: PRIVATE_ROUTES.ROLES }
];

export default function ManageRoles() {
  const { clientId } = useParams<{ clientId: string }>();
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);

  const {
    allRoles,
    paginatedRoles,
    loading,
    currentPage,
    totalPages,
    systemName,
    handlePageChange,
    getData,
    client,
    getClientData
  } = useManageRolesData(clientId);

  const {
    navigateToNewRole,
    navigateToEditRole,
    navigateToSystemDetails
  } = useRoleNavigation(clientId);

  useEffect(() => {
    if (isAuthenticated) {
      getData();
      getClientData();
    }
  }, [isAuthenticated, getData, getClientData]);

  useEffect(() => {
    if (allRoles.length > 0) {
      getData();
    }
  }, [currentPage]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div>
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div>
              <Heading
                title="Gerenciar papéis"
                badgeValue={allRoles.length.toString() || "0"}
                customDescription={
                  <div>
                    <span>
                      Client-id: <span
                        onClick={navigateToSystemDetails}
                        className="text-primary-600">{clientId}</span>
                    </span>
                    {client?.name && (
                      <span>
                        Sistema: <span
                          onClick={navigateToSystemDetails}
                          className="text-primary-600">{client.name}</span>
                      </span>
                    )}
                  </div>
                }
              />
              <Button onClick={navigateToNewRole}>
                <Plus /> Novo papel
              </Button>
            </div>
          </HeaderContainer>
          <Separator></Separator>
        </div>

        <ScrollArea viewportClassName="px-4 md:px-6">
          <div className="max-w-content-container m-auto">
            <Tabs defaultValue="roles">
              <TabsList>
                <TabsTrigger value="roles">Papéis</TabsTrigger>
                <TabsTrigger value="roles_hierarchy">Hierarquia de papéis</TabsTrigger>
              </TabsList>
              <TabsContent value="roles">
                <RolesTable
                  roles={paginatedRoles}
                  allRoles={allRoles}
                  loading={loading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onEditRole={navigateToEditRole}
                />
              </TabsContent>
              <TabsContent value="roles_hierarchy">
                <div>
                  <h2>Arraste para organizar a hierarquia.</h2>
                  {!loading && <RoleHierarchy data={allRoles} onSuccess={() => getData()} />}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </motion.div>
    </>
  );
}

