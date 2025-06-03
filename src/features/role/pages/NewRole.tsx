import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { catchError, from, tap } from "rxjs";
import useAuthStore from "../../../store/authStore.ts";

import { motion } from "framer-motion";
import { Heading } from "../../../common/components/header/heading.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { clientService } from "../../client/common/service/client-service.ts";
import { ClientResponseInterface } from "../../client/common/model/client.model.ts";
import { RoleForm } from "./RoleForm.tsx";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Adicionar novo papel", link: "" }
];

export default function NewRole() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const params = useParams();
  const [client, setClient] = useState<ClientResponseInterface>();


  const getData = async () => {
    const clientId = params.clientId;
    if(!clientId) return;
    from(clientService.fetchByClientId(params.clientId)).pipe(
      tap((response) => {
        if(response) {
          setClient(response);
        }
      }), catchError((error) => {
          console.error(error);
          return [];
        }
      )).subscribe();
  };

  useEffect(() => {
    getData();
  }, [isAuthenticated, params.clientId]);

  return (
    <ScrollArea className="h-full ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8">

        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Criar novo papel`} description="Gerenciar papéis." />
        </div>

        <Separator className="" />

        <RoleForm client={client} readonly={false} initialData={null} />
      </motion.div>
    </ScrollArea>
  );
}
