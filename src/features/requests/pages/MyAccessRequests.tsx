import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { Heading } from "../../../components/ui/heading.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import { RequestModel } from "../common/types/request.model.ts";
import { useEffect, useState } from "react";
import { columns } from "../common/components/request-table/columns.tsx";
import { buttonVariants } from "../../../components/ui/button.tsx";
import { cn } from "../../../config/lib/utils.ts";
import { Plus } from "lucide-react";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";

import { motion } from "framer-motion";
import { requestService } from "../common/api/request-service.ts";
import { RequestsTable } from "../common/components/request-table/RequestsTable.tsx";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Minhas solicitações", link: "/dashboard/my-access-requests" }
];

function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function MyAccessRequests() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [requests, setRequests] = useState<RequestModel[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(10);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();

  const init = () => {
    getData(page, pageCount, "");
  };

  const getData = async (page: number, pageCount: number, filter: string) => {
    console.log(filter);
    const pageResponse = await requestService.getRequestsMePaginated(page, pageCount, "id", "desc", "created", filter);
    setRequests(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
  };

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if(requests !== null && requests.length > 0) {
      const pageFromParams = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
      setPage(pageFromParams);
      const pageLimit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
      setPageCount(Math.ceil(totalUsers / pageLimit));
    }
  }, [totalUsers, searchParams]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Minhas solicitações (${totalUsers})`}
            description=""
          />
          <Link to={PRIVATE_ROUTES.REQUEST_ACCESS} className={cn(buttonVariants({ variant: "default" }))}>
            <Plus className="mr-2 h-4 w-4" /> Solicitar novo acesso
          </Link>
        </div>

        <Separator />
        <RequestsTable
          pageNo={page}
          columns={columns("created")}
          totalUsers={totalUsers}
          data={requests}
          pageCount={pageCount}
          onPageChange={(newPage, pageSize, filter) => {
            setPage(newPage);
            getData(newPage, pageSize, filter);
          }}
        />
      </motion.div>
    </>
  );
}
