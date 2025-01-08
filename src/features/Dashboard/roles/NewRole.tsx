import {Breadcrumbs} from '../../../components/breadcrumbs.tsx';
import {SystemForm} from './system-form.tsx';
import {ScrollArea} from '../../../components/ui/scroll-area.tsx';
import {RoleForm} from "./role-form.tsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {catchError, from, tap} from "rxjs";
import {clientService} from "../../../services/client";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import useAuthStore from "../../../store/authStore.ts";

const breadcrumbItems = [
  {title: 'Dashboard', link: '/dashboard'},
  {title: 'Adicionar novo sistema', link: ''}
];


export default function NewRole() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const params = useParams();
  const [client, setClient] = useState<ClientDTO>();


  const getData = async () => {
    const clientId =  params.clientId;
    if(!clientId) return;
    from(clientService.fetchByClientId(params.clientId)).pipe(
      tap((response) => {
        if (response){
          setClient(response)
        }
      }),catchError((error) => {
        console.error(error);
        return [];
      }
    )).subscribe();
  }

  useEffect(() => {
    getData();
  }, [ isAuthenticated, params.clientId]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems}/>
        <RoleForm client={client} readonly={false} initialData={null} />
      </div>
    </ScrollArea>
  );
}
