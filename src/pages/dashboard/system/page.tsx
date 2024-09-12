import { Breadcrumbs } from '@/components/breadcrumbs';
import { SystemsTable } from '@/components/tables/systems/systems';
import { columns } from '@/components/tables/systems/columns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import localData from '@/constants/systems.json';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar sistemas', link: '/dashboard/system' }
];

function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function SystemsPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const pageLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
  const name = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;

  const filteredData = localData.filter(item => !name || item.name.includes(name));
  const totalUsers = filteredData.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const systems = filteredData.slice(offset, offset + pageLimit);

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
          <Button
            className={cn(buttonVariants({ variant: 'default' }))}
            onClick={() => navigate(`/dashboard/system/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo
          </Button>
        </div>
        <Separator />

        <SystemsTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={systems}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SystemsPage />
    </Suspense>
  );
}
