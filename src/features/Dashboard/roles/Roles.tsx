// import App from '@/components/arvore/Arvore';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import { UserRole } from '../../../components/tables/role-tables/role';
import Arvore from '../../../components/tree/Arvore';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { roles } from '../../../constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar funções', link: '/dashboard/roles' }
];
export default function Roles() {
  return (
    <>
      <ScrollArea className="h-screen">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <UserRole data={roles} />
        </div>
        <Separator className="mb-6" />
        <div className="px-8">
          <h2 className="text-xl">Arraste para organizar a hierarquia.</h2>
          <div className="">
            {/* <App /> */}
            <Arvore />
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
