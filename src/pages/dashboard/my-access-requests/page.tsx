import { Breadcrumbs } from '@/components/breadcrumbs';
import { RequestsTable } from '@/components/tables/my-access-requests/requests';
import { columns } from '@/components/tables/my-access-requests/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import localData from '@/constants/access-requests.json';
import { Suspense } from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações', link: '/dashboard/my-access-requests' },
];

// Função auxiliar para usar os parâmetros de busca com React Router
function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function MyAccessRequestsPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const pageLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
  const system = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;

  // Filtrar os dados do JSON local de acordo com os parâmetros de pesquisa
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
            title={`Minhas solicitações (${totalUsers})`}
            description=""
          />

          <Link
            to={'/dashboard/request-access/'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo
          </Link>
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

// Usando Suspense para lidar com a renderização do componente
export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MyAccessRequestsPage />
    </Suspense>
  );
}
