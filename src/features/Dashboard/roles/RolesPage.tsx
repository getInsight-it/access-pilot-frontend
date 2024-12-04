// import App from '@/components/arvore/Arvore';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import { UserRole } from '../../../components/tables/role-tables/role';
import TreeRole from '../../../components/tree/TreeRole.tsx';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import {useParams} from "react-router-dom";
import {roleService} from "../../../services/role";
import {useEffect, useState} from "react";
import {RoleDTO} from "../../../services/role/role-dto.ts";
import useAuthStore from "../../../store/authStore.ts";

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar Sistemas', link: '/dashboard/systems' },
  { title: 'Gerenciar funções', link: '/dashboard/:client' }
];
export default function RolesPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      if (clientId) {
        const roles = await roleService.getRolesByClientId(clientId)
        setRoles(roles || [])
      }
    }catch (e) {
      console.error(e)
    }finally {
      setLoading(false)
    }
  }


  const init = () => {
    getData();
  }

  useEffect(() => {
    if (isAuthenticated)
      init();
  }, [ isAuthenticated, clientId]);

  return (
    <>
      <ScrollArea className="h-screen">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems}/>
          <UserRole data={roles} onSuccess={() => getData()}/>
        </div>
        <Separator className="mb-6"/>
        <div className="px-8">
          <h2 className="text-xl">Arraste para organizar a hierarquia.</h2>
          <div className="">
            {!loading && <TreeRole data={roles} onSuccess={() => getData()}/>}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
