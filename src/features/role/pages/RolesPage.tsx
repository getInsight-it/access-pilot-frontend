import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { UserRole } from "../../../components/tables/role-tables/role.tsx";
import TreeRole from "../../../components/tree/TreeRole.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore.ts";
import { motion } from "framer-motion";
import { roleService } from "../common/service/role-service.ts";
import { RoleResponseInterface } from "../common/types/role.model.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Gerenciar Sistemas", link: "/dashboard/systems" },
  { title: "Gerenciar papéis", link: "/dashboard/:client" }
];

export default function RolesPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [roles, setRoles] = useState<RoleResponseInterface[]>([]);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      if(clientId) {
        const roles = await roleService.getRolesByClientId(clientId);
        setRoles(roles || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  const init = () => {
    getData();
  };

  useEffect(() => {
    if(isAuthenticated)
      init();
  }, [isAuthenticated, clientId]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}>
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <UserRole data={roles} onSuccess={() => getData()} />
        </div>
        <Separator className="mb-6" />
        <div className="px-8">
          <h2 className="text-xl mb-4">Arraste para organizar a hierarquia.</h2>
          <div className="border-2 rounded-[var(--card-border-radius)]">
            {!loading && <TreeRole data={roles} onSuccess={() => getData()} />}
          </div>
        </div>
      </motion.div>
    </>
  );
}
