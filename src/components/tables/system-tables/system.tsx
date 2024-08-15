'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { System } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

interface UserSystemProps {
  data: System[];
}

export const UserSystem: React.FC<UserSystemProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Sistemas (${data.length})`}
          description="Gerenciar sistemas (funcionalidades da tabela lateral do cliente)."
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/system/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar novo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
