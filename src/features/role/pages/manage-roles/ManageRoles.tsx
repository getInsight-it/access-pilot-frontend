import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { motion } from "framer-motion";
import { CirclePlus, KeyRound, Server } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../../../common/external/ui/button.tsx";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../common/external/ui/tabs.tsx";
import useAuthStore, { AuthState } from "../../../../store/authStore.ts";
import RoleHierarchy from "./partials/RoleHierarchy.tsx";
import { RolesTable } from "./partials/roles-table/RolesTable.tsx";
import { useManageRolesData, useRoleNavigation } from "./useManageRoles.ts";
import "./ManageRoles.scss";

export default function ManageRoles() {
  const { clientId } = useParams<{ clientId: string }>();
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);

  const {
    allRoles,
    paginatedRoles,
    loading,
    currentPage,
    totalPages,
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
  }, [allRoles.length, currentPage, getData]);

  return (
    <motion.div
      className="manage-roles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div>
        <HeaderContainer className="manage-roles__header-container">
          <div className="manage-roles__header">
            <Heading
              className="manage-roles__heading"
              title="Gerenciar papéis"
              badgeValue={allRoles.length}
              badgeClassName="app-badge app-badge--header"
              customDescription={(
                <div className="manage-roles__meta">
                  <button
                    type="button"
                    onClick={navigateToSystemDetails}
                    className="manage-roles__meta-card"
                  >
                    <KeyRound className="manage-roles__meta-icon" />
                    <span className="manage-roles__meta-content">
                      <span className="manage-roles__meta-label">Client-id</span>
                      <span className="manage-roles__meta-value">{clientId}</span>
                    </span>
                  </button>
                  {client?.name && (
                    <button
                      type="button"
                      onClick={navigateToSystemDetails}
                      className="manage-roles__meta-card"
                    >
                      <Server className="manage-roles__meta-icon" />
                      <span className="manage-roles__meta-content">
                        <span className="manage-roles__meta-label">Sistema</span>
                        <span className="manage-roles__meta-value">{client.name}</span>
                      </span>
                    </button>
                  )}
                </div>
              )}
            />

            <div className="manage-roles__actions">
              <Button
                className="theme-button--primary manage-roles__primary-action"
                onClick={navigateToNewRole}
              >
                <CirclePlus /> Novo papel
              </Button>
            </div>
          </div>
        </HeaderContainer>
        <Separator className="manage-roles__separator" />
      </div>

      <ScrollArea className="manage-roles__scroll-area" viewportClassName="manage-roles__scroll-viewport">
        <div className="max-w-content-container manage-roles__content">
          <Tabs defaultValue="roles" className="manage-roles__tabs">
            <TabsList className="app-tabs">
              <TabsTrigger value="roles" asChild>
                <button type="button" className="app-tabs__trigger">Papéis</button>
              </TabsTrigger>
              <TabsTrigger value="roles_hierarchy" asChild>
                <button type="button" className="app-tabs__trigger">Hierarquia de papéis</button>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="roles" className="manage-roles__tabs-content">
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
            <TabsContent value="roles_hierarchy" className="manage-roles__tabs-content">
              <div className="manage-roles__hierarchy">
                <h2 className="manage-roles__hierarchy-title">Arraste para organizar a hierarquia.</h2>
                {!loading && <RoleHierarchy data={allRoles} onSuccess={() => getData()} />}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
