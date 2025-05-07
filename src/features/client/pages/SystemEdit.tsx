import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import { catchError, from, tap } from "rxjs";
import { SystemForm } from "../common/components/system-form/SystemForm.tsx";

import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { Heading } from "../../../components/ui/heading.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { motion } from "framer-motion";
import { ClientResponseInterface } from "../common/model/client.model.ts";
import { clientService } from "../common/service/client-service.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Gerenciar sistemas", link: "/dashboard/systems" },
  { title: "Detalhe do sistema", link: "/dashboard/systems" }
];

export const SystemEdit = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { clientId } = useParams();
  const [data, setData] = useState<ClientResponseInterface>();

  const getData = async () => {
    if(!clientId) return;
    from(clientService.fetchByClientId(clientId)).pipe(
      tap((response) => {
        if(response) {
          setData(response);
        }
      }), catchError((error) => {
          console.error(error);
          return [];
        }
      )).subscribe();
  };

  useEffect(() => {
    getData();
  }, [isAuthenticated, clientId]);

  return (
    <>
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
            <Heading title={`Editar sistema`} description="Gerenciar sistemas." />
          </div>
          <Separator className="" />
          {data && (
            <div className="">
              <SystemForm initialData={data || null} readonly={false} />
            </div>
          )}
        </motion.div>
      </ScrollArea>
    </>
  );
};
