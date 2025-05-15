import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { SystemsTable } from "../../../components/tables/systems/systems.tsx";
import { columns } from "../../../components/tables/systems/columns.tsx";
import { Heading } from "../../../components/ui/heading.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import { motion } from "framer-motion";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { cn } from "../../../config/lib/utils.ts";
import { buttonVariants } from "../../../components/ui/button.tsx";
import { Plus } from "lucide-react";
import { clientService } from "../common/service/client-service.ts";
import { ClientResponseInterface } from "../common/model/client.model.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Gerenciar sistemas", link: "/dashboard/systems" }
];

function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function SystemsPage() {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [clients, setClients] = useState<ClientResponseInterface[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [dataUpdated, setDataUpdated] = useState(true);

  const init = () => {
    getData(page, pageLimit);
  };

  const getData = async (page: number, pageSize: number, searchFilter: string = "") => {
    const pageResponse = await clientService.getClientsPaginated(page, pageSize, "id", "asc", searchFilter);
    setClients(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
  };

  useEffect(() => {
    if(!dataUpdated) {
      updatePageInfo();
      init();
      setDataUpdated(true);
    }
  }, [dataUpdated]);

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated]);

  function updatePageInfo() {
    if(clients !== null && clients.length > 0) {
      const pageSizeOptions = [10, 20, 30, 40, 50];
      const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 0;
      setPage(page);
      const pageLimitReal = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
      const pageCount = pageSizeOptions.filter(o => o >= pageLimitReal)[0] ?? 10;
      setSearch(search || "");
      setPageCount(Math.ceil(totalUsers / pageCount));
      setPageLimit(pageSizeOptions.filter(o => o >= pageLimitReal)[0] ?? 10);
    }
  }

  useEffect(() => {
    updatePageInfo();
  }, [getData]);

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
          <Heading title={`Sistemas (${totalUsers})`} description="" />
          <Link
            to={PRIVATE_ROUTES.NEW_SYSTEM}
            className={cn(buttonVariants({ variant: "default" }))}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo
          </Link>
        </div>
        <Separator />
        <div className="max-w-content-container m-auto">
          <SystemsTable
            searchKey="clientId"
            pageNo={page}
            columns={columns(setDataUpdated)}
            totalUsers={totalUsers}
            data={clients}
            pageCount={pageCount}
            onPageChange={getData}
          />
        </div>
      </motion.div>
    </>
  );
}
