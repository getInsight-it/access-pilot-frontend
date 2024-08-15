'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Role } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { DataTableRole } from '@/components/ui/data-table-role';
import ShuffleSortTable from '@/components/shuffle-sort-table/ShuffleSortTable';

interface UserRoleProps {
  data: Role[];
}

export const UserRole: React.FC<UserRoleProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Gerenciar funções (${data.length})`}
          description="Gerenciar funções dos usuários."
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/roles/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar nova função
        </Button>
      </div>
      <Separator />
      <DataTableRole searchKey="name" columns={columns} data={data} />
      {/* <ShuffleSortTable /> */}
    </>
  );
};
