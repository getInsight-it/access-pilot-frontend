import { Breadcrumbs } from '../../../components/breadcrumbs';
import { RequestsTable } from '../../../components/tables/access-requests/requests';
import { columns } from '../../../components/tables/access-requests/columns';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { useLocation } from 'react-router-dom';
import localData from '../../../constants/access-requests.json';
import { Suspense } from 'react';
import { RequestAccessDrawer } from '../../../components/drawers/RequestAccessDrawer';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Solicitações de acesso', link: '/dashboard/access-requests' },
];

function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function Page() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const pageLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
  const system = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;

  const filteredData = localData.filter(item => !system || item.system.includes(system));
  const totalUsers = filteredData.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const requests = filteredData.slice(offset, offset + pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Solicitações de acesso (${totalUsers})`}
            description=""
          />

          {/* <Link
            to={'/dashboard/request-access/'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo
          </Link> */}
          
          <RequestAccessDrawer />

        </div>
        <Separator />

        <RequestsTable
          searchKey="system"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={requests}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}

export default function AccessRequests() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Page />
    </Suspense>
  );
}
