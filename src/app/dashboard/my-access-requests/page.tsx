import { Breadcrumbs } from '@/components/breadcrumbs';
import { MyAcessRequests } from '@/components/tables/access-requests-tables/my-requests';
import { accessRequests } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações de acesso', link: '/dashboard/my-access-requests' }
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <MyAcessRequests data={accessRequests} />
      </div>
    </>
  );
}
