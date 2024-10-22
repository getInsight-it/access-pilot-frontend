import { Button } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { Role } from '../../../constants/data';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { columns } from './columns';
import { DataTableRole } from '../../../components/ui/data-table-role';

interface UserRoleProps {
  data: Role[];
}

export const UserRole: React.FC<UserRoleProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Gerenciar funções (${data.length})`}
          description="Gerenciar funções dos usuários."
        />
        <Button
          // to={'/dashboard/role-new/'}
          className="text-xs md:text-sm"
          onClick={() => navigate(`/dashboard/role-new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar nova função
        </Button>
      </div>
      <Separator />
      <DataTableRole searchKey="name" columns={columns} data={data} />
    </>
  );
};
