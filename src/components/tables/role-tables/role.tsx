import {Button, buttonVariants} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { Role } from '../../../constants/data';
import { Plus } from 'lucide-react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { columns } from './columns';
import { DataTableRole } from '../../../components/ui/data-table-role';
import React, {useState} from "react";
import {StepLoader} from "../../steploader/StepLoader.tsx";
import {cn} from "../../../lib/utils.ts";


interface UserRoleProps {
  data: Role[];
  onSuccess?: () => Promise<void>
}

export const UserRole: React.FC<UserRoleProps> = ({ data}) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Gerenciar papéis (${data.length})`}
          description="Gerenciar os papéis dos usuários."
        />
        {params.clientId && (
          <Link
            to={`/dashboard/systems/${params.clientId}/role-new`}
            className={cn(buttonVariants({variant: 'default'}))}
          >
            <Plus className="mr-2 h-4 w-4"/> Adicionar novo papel
          </Link>
        )}
      </div>
      <Separator/>
      <DataTableRole searchKey="name" columns={columns()} data={data} />
      <StepLoader loading={loading}/>
    </>
  );
};
