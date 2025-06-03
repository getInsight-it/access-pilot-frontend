import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { catchError, from, tap } from "rxjs";
import useAuthStore from "../../../store/authStore.ts";

import { motion } from "framer-motion";
import { Heading } from "../../../common/components/header/heading.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { roleService } from "../common/service/role-service.ts";
import { RoleResponseInterface } from "../common/types/role.model.ts";
import { RoleForm } from "./RoleForm.tsx";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Editar papel", link: "" }
];


export const RoleEdit = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { id } = useParams();
  const [data, setData] = useState<RoleResponseInterface>();

  const getData = async () => {
    if(!id) return;
    from(roleService.getRoleById(id)).pipe(
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
  }, [isAuthenticated, id]);

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
          <Heading title={`Editar papel`} description="Gerenciar papéis." />
        </div>

        <Separator className="" />

        {data && (<RoleForm client={data?.client} readonly={false} initialData={data} />)}
      </motion.div>
    </ScrollArea>
  );
};
