// import {useEffect, useState} from "react";
// import {useParams} from "react-router-dom";
// import useAuthStore from "../../../store/authStore.ts";
// import {catchError, from, tap} from "rxjs";
// import {RoleDTO} from "../../../services/role/role-dto.ts";
// import {RoleForm} from "./role-form.tsx";
// import {roleService} from "../../../services/role";

// export const RoleDetail = () => {
//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
//   const { id } = useParams();
//   const [data, setData] = useState<RoleDTO>();

//   const getData = async () => {
//     if(!id) return;
//     from(roleService.getRoleById(id)).pipe(
//       tap((response) => {
//         if (response){
//           setData(response)
//         }
//       }),catchError((error) => {
//         console.error(error);
//         return [];
//       }
//     )).subscribe();
//   };

//   useEffect(() => {
//     getData();
//   }, [isAuthenticated,id]);

//   return (
//     <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2">
//       {data && (
//           <div className="w-full max-w-xl mt-6">
//             <div className="mx-auto w-128 space-y-4">
//               <RoleForm client={data?.client} readonly={true} initialData={data} />
//             </div>
//           </div>
//       )}
//     </section>
//   );
// };



import {Breadcrumbs} from '../../../components/breadcrumbs.tsx';
import {ScrollArea} from '../../../components/ui/scroll-area.tsx';
import {RoleForm} from "./role-form.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {catchError, from, tap} from "rxjs";
import useAuthStore from "../../../store/authStore.ts";

import { motion } from 'framer-motion';
import { Heading } from '../../../components/ui/heading.tsx';
import { Separator } from '../../../components/ui/separator.tsx';

import {roleService} from "../../../services/role";
import {RoleDTO} from "../../../services/role/role-dto.ts";

const breadcrumbItems = [
  {title: 'Dashboard', link: '/dashboard'},
  {title: 'Detalhes do papel', link: ''}
];


export const RoleDetail = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { id } = useParams();
  const [data, setData] = useState<RoleDTO>();

  const getData = async () => {
    if(!id) return;
    from(roleService.getRoleById(id)).pipe(
      tap((response) => {
        if (response){
          setData(response)
        }
      }),catchError((error) => {
        console.error(error);
        return [];
      }
    )).subscribe();
  };

  useEffect(() => {
    getData();
  }, [isAuthenticated,id]);

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
            title={`Detalhes do papel`}
            description="Gerenciar papéis."
          />
        </div>

        <Separator className="" />

        <div className="w-128">
          {data && (
            <RoleForm client={data?.client} readonly={true} initialData={data} />
           )}
        </div>
        
      </motion.div>

    </ScrollArea>
  );
}
