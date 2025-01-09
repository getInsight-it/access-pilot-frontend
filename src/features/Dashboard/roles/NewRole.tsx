import {Breadcrumbs} from '../../../components/breadcrumbs.tsx';
import { SystemForm } from './system-form.tsx';
import {ScrollArea} from '../../../components/ui/scroll-area.tsx';
import {RoleForm} from "./role-form.tsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {catchError, from, tap} from "rxjs";
import {clientService} from "../../../services/client";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import useAuthStore from "../../../store/authStore.ts";

import { motion } from 'framer-motion';
import { Heading } from '../../../components/ui/heading.tsx';
import { Separator } from '../../../components/ui/separator.tsx';

const breadcrumbItems = [
  {title: 'Dashboard', link: '/dashboard'},
  {title: 'Adicionar novo papel', link: ''}
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
    <ScrollArea className="h-full ">

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

        <Breadcrumbs items={breadcrumbItems}/>

        <div className="flex items-start justify-between">
          <Heading
            title={`Criar novo papel`}
            description="Gerenciar papéis."
          />
        </div>

        <Separator className="" />

        <div className="w-128">
          <RoleForm client={client} readonly={false} initialData={null} />
        </div>
        
      </motion.div>

    </ScrollArea>
  );
}
