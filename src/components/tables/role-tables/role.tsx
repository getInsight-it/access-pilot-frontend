import {Button, buttonVariants} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { Role } from '../../../constants/data';
import { Plus } from 'lucide-react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { columns } from './columns';
import { DataTableRole } from '../../../components/ui/data-table-role';
import React, {useEffect, useState} from "react";
import {clientService} from "../../../services/client";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {finalize, from, tap} from "rxjs";
import {StepLoader} from "../../steploader/StepLoader.tsx";
import {ModalRoleDrawer} from "../../drawers/ModalRoleDrawer.tsx";
import {cn} from "../../../lib/utils.ts";
import {RoleDTO} from "../../../services/role/role-dto.ts";

interface UserRoleProps {
  data: Role[];
  onSuccess?: () => Promise<void>
}

export const UserRole: React.FC<UserRoleProps> = ({ data , onSuccess}) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ClientDTO>();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDTO | undefined>();

  const getData = () => {
    setLoading(true);
    from(clientService.fetchByClientId(params.clientId)).pipe(
      tap((response) => {
        setClient(response);
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  }

  useEffect(() => {
    getData();
  }, [openModal]);

  useEffect(() => {
    if(selectedRole) {
      setOpenModal(true);
    }
  }, [selectedRole]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Gerenciar funções (${data.length})`}
          description="Gerenciar funções dos usuários."
        />
        <Link
          onClick={() => {
            setSelectedRole(undefined);
            setOpenModal(true)}
          }
          to={''}
          className={cn(buttonVariants({variant: 'default'}))}
        >
          <Plus className="mr-2 h-4 w-4"/> Adicionar nova função
        </Link>
      </div>
      <Separator/>
      <DataTableRole searchKey="name" columns={columns((role) => setSelectedRole(role))} data={data} />
      <StepLoader loading={loading}/>
      <div className="grid place-content-center">
        {openModal && <ModalRoleDrawer open={openModal} setOpen={setOpenModal} roleData={selectedRole || undefined} client={client}
                         onSuccess={() => onSuccess?.()}/>
        }
      </div>
    </>
  );
};
