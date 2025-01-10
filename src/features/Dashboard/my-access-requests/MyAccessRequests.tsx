import { Breadcrumbs } from '../../../components/breadcrumbs';
import { RequestsTable } from '../../../components/tables/my-access-requests/requests';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import useAuthStore from "../../../store/authStore.ts";
import { RequestDTO } from "../../../services/request/request-d-t-o.ts";
import { requestService } from "../../../services/request";
import React, { useEffect, useState } from 'react';
import {columns} from "../../../components/tables/my-access-requests/columns.tsx";
import {buttonVariants} from "../../../components/ui/button.tsx";
import {cn} from "../../../lib/utils.ts";
import {Plus} from "lucide-react";
import {PRIVATE_ROUTES} from "../../../constants/routes.ts";

import { motion } from 'framer-motion'

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
  const [selectedRequest, setSelectedRequest] = useState<RequestDTO>();

  const init = () => {
    getData(page, pageCount);
  };

  const getData = async (page, pageCount) => {
    const pageResponse = await requestService.getRequestsMePaginated(page, pageCount, 'id', 'desc', 'created');
    setRequests(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
  };

  const updateTable = () => {
      init();
  }



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
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8"
      >
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Minhas solicitações (${totalUsers})`}
            description=""
          />
        <Link
          to={PRIVATE_ROUTES.REQUEST_ACCESS}
          className={cn(buttonVariants({variant: 'default'}))}
        >
          <Plus className="mr-2 h-4 w-4"/> Solicitar novo acesso
        </Link>
        </div>

        <Separator />

        {/* {requests.length <= 0 &&
          <EmptyState />
        } */}

        {/* {requests.length > 0 && */}
        
          <RequestsTable
            searchKey="clientId"
            pageNo={page} // Passa o valor da página que começa em 1
            columns={columns('created')}
            totalUsers={totalUsers}
            data={requests}
            pageCount={pageCount}
            onPageChange={(newPage, pageSize) => {
              setPage(newPage);
              getData(newPage, pageSize);
            }}
          />
        {/* } */}
      </motion.div>
    </>
  );
}
