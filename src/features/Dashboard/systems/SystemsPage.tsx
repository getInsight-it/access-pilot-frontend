import {Breadcrumbs} from '../../../components/breadcrumbs';
import {SystemsTable} from '../../../components/tables/systems/systems';
import {columns} from '../../../components/tables/systems/columns';
import {Heading} from '../../../components/ui/heading';
import {Separator} from '../../../components/ui/separator';
import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import useAuthStore from "../../../store/authStore.ts";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {clientService} from "../../../services/client";
import { motion } from 'framer-motion';
import {PRIVATE_ROUTES} from "../../../constants/routes.ts";
import {cn} from "../../../lib/utils.ts";
import {buttonVariants} from "../../../components/ui/button.tsx";
import {Plus} from "lucide-react";
import TablePaginationSearch from '../../../components/TablePaginationSearch.tsx';

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
  const [pageCount, setPageCount] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [dataUpdated, setDataUpdated] = useState(true);

  const init = () => {
    getData(page,pageLimit);
  };

  const getData = async (page, pageSize) => {
    const pageResponse = await clientService.getClientsPaginated(page, pageSize, 'id', 'asc');
    setClients(pageResponse?.items || []);
    setTotalUsers(pageResponse?.total ?? 0);
  }

  useEffect(() => {
    if (!dataUpdated) {
      updatePageInfo();
      init();
      setDataUpdated(true);
    }
  }, [dataUpdated]);

  useEffect(() => {
    if (isAuthenticated) {
      init()
    }
  }, [isAuthenticated]);

  function updatePageInfo() {
    if (clients !== null && clients.length > 0) {
      const pageSizeOptions = [10, 20, 30, 40, 50]
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0;
      setPage(page)
      const pageLimitReal = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
      const pageCount = pageSizeOptions.filter(o => o >= pageLimitReal)[0] ?? 10;
      const name = searchParams.get('search') || null;
      setSearch(search || '');
      setPageCount(Math.ceil(totalUsers / pageCount));
      setPageLimit(pageSizeOptions.filter(o => o >= pageLimitReal)[0] ?? 10);

    }
  }

  useEffect(() => {
    updatePageInfo();
  }, [getData]);

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
            title={`Sistemas (${totalUsers})`}
            description=""
          />
          <Link
            to={PRIVATE_ROUTES.NEW_SYSTEM}
            className={cn(buttonVariants({variant: 'default'}))}
          >
            <Plus className="mr-2 h-4 w-4"/> Adicionar novo
          </Link>
        </div>
        <Separator />

        <TablePaginationSearch />

        <SystemsTable
          searchKey="clientId"
          pageNo={page}
          columns={columns(setDataUpdated)}
          totalUsers={totalUsers}
          data={clients}
          pageCount={pageCount}
          onPageChange={getData}
        />
      </motion.div>
    </>
  );
}


// import { useEffect, useState, useCallback } from "react"
// import { Breadcrumbs } from "../../../components/breadcrumbs"
// import { SystemsTable } from "../../../components/tables/systems/systems"
// import { columns } from "../../../components/tables/systems/columns"
// import { Heading } from "../../../components/ui/heading"
// import { Separator } from "../../../components/ui/separator"
// import { Link } from "react-router-dom"
// import useAuthStore from "../../../store/authStore.ts"
// import type { ClientDTO } from "../../../services/client/client-dto.ts"
// import { clientService } from "../../../services/client"
// import { motion } from "framer-motion"
// import { PRIVATE_ROUTES } from "../../../constants/routes.ts"
// import { cn } from "../../../lib/utils.ts"
// import { buttonVariants } from "../../../components/ui/button.tsx"
// import { Plus } from "lucide-react"
// import { useDebounce } from "../../../hooks/use-debounce"
// import { Button } from "../../../components/ui/button"

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Gerenciar sistemas", link: "/dashboard/systems" },
// ]

// export default function SystemsPage() {
//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated)
//   const [clients, setClients] = useState<ClientDTO[]>([])
//   const [totalUsers, setTotalUsers] = useState(0)
//   const [pageCount, setPageCount] = useState(1)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [pageSize] = useState(10)
//   const [search, setSearch] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [isTimeout, setIsTimeout] = useState(false)
//   const [retryCount, setRetryCount] = useState(0)

//   const debouncedSearch = useDebounce(search, 500)

//   const getData = useCallback(async (page: number, pageSize: number, searchQuery: string) => {
//     console.log(`Fetching data: page=${page}, pageSize=${pageSize}, searchQuery="${searchQuery}"`)
//     setIsLoading(true)
//     setError(null)
//     setIsTimeout(false)
//     try {
//       const pageResponse = await clientService.getClientsPaginated(page - 1, pageSize, "id", "asc", searchQuery)
//       if (pageResponse === null) {
//         setError("Não foi possível carregar os dados. Por favor, tente novamente.")
//       } else {
//         console.log("Data received:", pageResponse)
//         setClients(pageResponse.items || [])
//         setTotalUsers(pageResponse.total ?? 0)
//         setPageCount(Math.ceil((pageResponse.total ?? 0) / pageSize))

//         // Log adicional para debug
//         console.log("Clientes carregados:", pageResponse.items)
//         console.log("Número de clientes:", pageResponse.items?.length)
//       }
//     } catch (err) {
//       console.error("Erro ao buscar dados:", err)
//       if (err.message.includes("TIMEOUT")) {
//         setIsTimeout(true)
//         setError("A requisição excedeu o tempo limite. Por favor, tente novamente mais tarde.")
//       } else {
//         setError(`Erro ao carregar dados: ${err.message}`)
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     if (isAuthenticated) {
//       getData(currentPage, pageSize, debouncedSearch)
//     }
//   }, [isAuthenticated, getData, pageSize, currentPage, debouncedSearch])

//   const handleSearchChange = useCallback((newSearch: string) => {
//     console.log("Search changed:", newSearch)
//     setSearch(newSearch)
//     setCurrentPage(1)
//   }, [])

//   const handlePageChange = useCallback((newPage: number) => {
//     console.log("Page changed:", newPage)
//     setCurrentPage(newPage)
//   }, [])

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
//       className="flex-1 space-y-4 p-4 pt-6 md:p-8"
//     >
//       <Breadcrumbs items={breadcrumbItems} />

//       <div className="flex items-start justify-between">
//         <Heading title={`Sistemas (${totalUsers})`} description="" />
//         <Link to={PRIVATE_ROUTES.NEW_SYSTEM} className={cn(buttonVariants({ variant: "default" }))}>
//           <Plus className="mr-2 h-4 w-4" /> Adicionar novo
//         </Link>
//       </div>
//       <Separator />

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <strong className="font-bold">Erro: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
//       {isTimeout && (
//         <div
//           className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
//           role="alert"
//         >
//           <strong className="font-bold">Aviso: </strong>
//           <span className="block sm:inline">A requisição excedeu o tempo limite após {retryCount} tentativa(s).</span>
//           <Button
//             onClick={() => {
//               setRetryCount((prev) => prev + 1)
//               getData(currentPage, pageSize, debouncedSearch)
//             }}
//             variant="link"
//             className="pl-2"
//           >
//             Tentar novamente
//           </Button>
//         </div>
//       )}

//       <SystemsTable<ClientDTO, any>
//         searchKey="clientId"
//         columns={columns(() => {})}
//         totalUsers={totalUsers}
//         data={clients}
//         pageCount={pageCount}
//         onPageChange={handlePageChange}
//         onSearchChange={handleSearchChange}
//         search={search}
//         isLoading={isLoading}
//         currentPage={currentPage}
//         isTimeout={isTimeout}
//         error={error}
//         pageSize={pageSize}
//         pageNo={currentPage}
//         searchLength={search.length}
//       />
//     </motion.div>
//   )
// }



