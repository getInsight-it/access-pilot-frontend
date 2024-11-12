import { Breadcrumbs } from '../../../components/breadcrumbs';
import { RequestsTable } from '../../../components/tables/my-access-requests/requests';
import { columns } from '../../../components/tables/my-access-requests/columns';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { cn } from '../../../lib/utils';
import { Plus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from "../../../store/authStore.ts";
import { RequestDTO } from "../../../services/request/request-dto.ts";
import { requestService } from "../../../services/request";
import { useEffect, useState } from 'react';
import EmptyState from '../../../components/canvas/empty/EmptyState.tsx';
import { RequestAccessDrawer } from '../../../components/drawers/RequestAccessDrawer.tsx';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações', link: '/dashboard/my-access-requests' },
];

function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function MyAccessRequests() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [requests, setRequests] = useState<RequestDTO[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(10);
  const [page, setPage] = useState(1); // Ajustado para começar em 1, conforme esperado pela API
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');

  const init = () => {
    getData(page, pageCount);
  };

  const getData = async (page, pageCount) => {
    // Chamando a API com a página e contagem conforme esperado pela API (início em 1)
    const pageResponse = await requestService.getRequestsPaginated(page, pageCount, 'id', 'asc');
    setRequests(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
    // setRequests([]);
    // setTotalUsers(0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      init();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (requests !== null && requests.length > 0) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pageFromParams = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1; // Ajustado para começar em 1
      setPage(pageFromParams);
      const pageLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
      const name = searchParams.get('search') || null;
      setSearch(name || '');
      setPageCount(Math.ceil(totalUsers / pageLimit));
    }
  }, [totalUsers, searchParams]);

  const navigate = useNavigate();

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Minhas solicitações (${totalUsers})`}
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

        {requests.length <= 0 &&
          <EmptyState />
        }

        {requests.length > 0 &&
          <RequestsTable
            searchKey="system"
            pageNo={page} // Passa o valor da página que começa em 1
            columns={columns}
            totalUsers={totalUsers}
            data={requests}
            pageCount={pageCount}
            onPageChange={(newPage, pageSize) => {
              setPage(newPage); // Atualiza o estado local da página com a contagem começando em 1
              getData(newPage, pageSize); // Chama a API com a nova página
            }}
          />
        }
        
      </div>
    </>
  );
}
