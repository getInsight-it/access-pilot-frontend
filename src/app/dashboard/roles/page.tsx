import App from '@/components/arvore/Arvore';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserRole } from '@/components/tables/role-tables/role';
import { ScrollArea } from '@/components/ui/scroll-area';
import { roles } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar funções', link: '/dashboard/roles' }
];
export default function page() {
  return (
    <>
      <ScrollArea className="h-screen">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <UserRole data={roles} />
          <h2 className="text-xl">Arraste para organizar a hierarquia.</h2>
          <div className=" row-span-1 rounded-xl group/bento transition duration-200
            shadow-input dark:shadow-none dark:bg-gray-500 dark:border-white/[0.2]
            border border-transparent justify-between flex flex-col"
          >
            <App />
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
