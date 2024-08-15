'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AccessRequest } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './my-requests-columns';

interface MyAcessRequestsProps {
  data: AccessRequest[];
}

export const MyAcessRequests: React.FC<MyAcessRequestsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Minhas solicitações de acesso (${data.length})`}
          description="Gerenciar solicitações de acesso."
        />
        <div className="flex items-center gap-4">
          <p className="max-w-60 leading-[20px] text-right">
            Precisa de acesso a um novo sistema ou função?
          </p>
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/dashboard/access-requests/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Solicitar novo acesso
          </Button>
        </div>
      </div>
      <Separator />      
      <h2 className="text-2xl font-bold pt-4 pb-1">Histórico de solicitações de acesso</h2>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
