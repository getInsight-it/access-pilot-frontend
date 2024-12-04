import {Breadcrumbs} from '../../../components/breadcrumbs';
import {SystemsTable} from '../../../components/tables/systems/systems';
import {columns} from '../../../components/tables/systems/columns';
import {Heading} from '../../../components/ui/heading';
import {Separator} from '../../../components/ui/separator';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AddSystemDrawer} from '../../../components/drawers/AddSystemDrawer';
import useAuthStore from "../../../store/authStore.ts";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {clientService} from "../../../services/client";
import {SystemDetailDrawer} from "../../../components/drawers/SystemDetailDrawer.tsx";

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar sistemas', link: '/dashboard/systems' }
];

function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function SystemsPage() {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(10);
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [dataUpdated, setDataUpdated] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientDTO>();

  const init = () => {
    getData(page,pageCount);
  };

  const getData = async (page, pageCount) => {
    const pageResponse = await clientService.getClientsPaginated(page, pageCount, 'id', 'asc');
    setClients(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
  }

  useEffect(() => {
    if (!dataUpdated) {
      updatePageInfo();
      init();
      setDataUpdated(true);
      setSelectedClient(undefined);
    }
  }, [dataUpdated]);

  useEffect(() => {
    if (isAuthenticated) {
      init()
    }
  }, [isAuthenticated]);

  function updatePageInfo() {
    if (clients !== null && clients.length > 0) {

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0;
      setPage(page)
      const pageLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
      const name = searchParams.get('search') || null;
      setSearch(search || '');
      setPageCount(Math.ceil(pageLimit));

    }
  }

  useEffect(() => {
    updatePageInfo();
  }, [getData]);

  const navigate = useNavigate();

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Sistemas (${totalUsers})`}
            description=""
          />
          <AddSystemDrawer />
        </div>
        <Separator />

        <SystemsTable
          searchKey="clientId"
          pageNo={page}
          columns={columns(setDataUpdated, selectedClient, setSelectedClient)}
          totalUsers={totalUsers}
          data={clients}
          pageCount={pageCount}
          onPageChange={getData}
        />
      </div>
    </>
  );
}
