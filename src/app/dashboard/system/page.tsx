import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserSystem } from '@/components/tables/system-tables/system';
import { systems } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar sistemas', link: '/dashboard/system' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <UserSystem data={systems} />
      </div>
    </>
  );
}
