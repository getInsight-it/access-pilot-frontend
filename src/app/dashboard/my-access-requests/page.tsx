import { Breadcrumbs } from '@/components/breadcrumbs';
import { RequestsTable } from '@/components/tables/my-access-requests/requests';
import { columns } from '@/components/tables/my-access-requests/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import localData from '@/constants/access-requests.json';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações', link: '/dashboard/my-access-requests' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export const dynamic = 'force-static'

export default function Page({ searchParams }: paramsProps) {
  const page = Array.isArray(searchParams.page) ? Number(searchParams.page[0]) : Number(searchParams.page) || 1;
  const pageLimit = Array.isArray(searchParams.limit) ? Number(searchParams.limit[0]) : Number(searchParams.limit) || 10;
  const system = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  // Filtrar os dados do JSON local de acordo com os parâmetros de pesquisa
  const filteredData = localData.filter(item => 
    !system || item.system.includes(system)
  );
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
            description="Gerenciar acessos."
          />

          <Link
            href={'/dashboard/request-access/'}
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
