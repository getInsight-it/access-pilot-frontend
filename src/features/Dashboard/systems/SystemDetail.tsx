// import React, {useEffect, useState} from "react";
// import {useParams} from "react-router-dom";
// import useAuthStore from "../../../store/authStore.ts";
// import {catchError, from, tap} from "rxjs";
// import {clientService} from "../../../services/client";
// import {ClientDTO} from "../../../services/client/client-dto.ts";
// import {SystemForm} from "./system-form.tsx";

// export const SystemDetail = () => {
//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
//   const { clientId } = useParams();
//   const [data, setData] = useState<ClientDTO>();

//   const onUpdate = () => {
//     getData();
//   }

//   const getData = async () => {
//     if(!clientId) return;
//     from(clientService.fetchByClientId(clientId)).pipe(
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
//   }, [isAuthenticated,clientId]);

//   return (
//     <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2">
//       {data && (
//           <div className="w-full max-w-xl mt-6">
//             <div className="mx-auto w-128 space-y-4">
//               <SystemForm
//                 initialData={data || null} readonly={true} onSuccessSubmit={() => console.log('success')}
//               />
//             </div>
//           </div>
//       )}
//     </section>
//   );
// };




import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import Detail from "../../../components/canvas/system/SystemDetail.tsx";
import { StepLoader } from '../../../components/steploader/StepLoader.tsx';

import {useNavigate, useParams} from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import {catchError, from, tap} from "rxjs";
import {clientService} from "../../../services/client";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {SystemForm} from "./system-form.tsx";

import { Breadcrumbs } from '../../../components/breadcrumbs';
import { Heading } from '../../../components/ui/heading';
import { ScrollArea } from '../../../components/ui/scroll-area';
import CompactCalendar from "../../../components/CompactCalendar.tsx";
import { CopyProtocol } from "../../../components/CopyProtocol.tsx";
import { Check, File, MonitorIcon, Pencil } from "lucide-react";
import { CardShine } from "../../../components/CardShine.tsx";
import RequestStatus from "../../../components/request-status/RequestStatus.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import TrafficLight from "../../../components/TrafficLights.tsx";
import { motion } from 'framer-motion'
import { Button } from "../../../components/ui/button.tsx";

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar sistemas', link: '/dashboard/systems' },
  { title: 'Detalhe do sistema', link: '/dashboard/systems' }
];

type SystemDetailProps = {
  data?: ClientDTO;
}

export const SystemDetail = () => {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { clientId } = useParams();
  const [data, setData] = useState<ClientDTO>();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onUpdate = () => {
    getData();
  }

  const getData = async () => {
    if(!clientId) return;
    from(clientService.fetchByClientId(clientId)).pipe(
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
  }, [isAuthenticated,clientId]);


  const formatStatus = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicado';
      case 'UNPUBLISHED':
        return 'Não Publicado';
      default:
        return status;
    }
  };

  console.log(data)

  function handleLoaderClose() {
    setLoading(false);
  }

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

        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Detalhes do sistema`}
            description="Gerenciar sistemas."
          />
        </div>

        <Separator className="" />

        {data && (
          <div className="">
            {/* <div className="">
              <SystemForm
                initialData={data || null} readonly={true} onSuccessSubmit={() => console.log('success')}
              />
            </div> */}
            
            <div className="relative max-w-[1070px] grid grid-cols-1 xl:grid-cols-2 gap-8">

              <div className="w-full ">

                <div className="">
                  
                  <div className="">
                    <div className="w-full max-w-96">
                      <p className="font-bold mb-3 text-lg">Sistema:</p>
                      <CardShine>
                        {/* <div className="border-2 border-primary p-5 grid items-center min-h-[160px] h-auto transition-all rounded-[var(--card-border-radius)] ">
                          <Check className="absolute top-4 right-4" />
                          <MonitorIcon className="w-6 h-6 mb-3" />
                          <span className="font-semibold text-lg">
                            {data?.clientId}
                          </span>
                          <p className="mt-1 text-sm">
                            {data?.description ? data?.description : "Sem função atribuída"}
                          </p>
                        </div> */}
                        
                        <div className="ring-2 ring-primary p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
                          {/* <Check className="absolute top-6 right-6" /> */}

                          <div className="flex flex-row items-center">
                            <MonitorIcon className="w-6 h-6 mr-4" />
                            <p className="font-bold text-lg">
                              {data?.clientId}
                            </p>
                          </div>
                          
                          <p className="mt-1 text-sm">
                            {data?.description ? data?.description : "Sem função atribuída"}
                          </p>
                        </div>

                      </CardShine>
                    </div>

                    <div className="mt-6 w-full max-w-96">
                      <p className="font-bold text-lg">Nome:</p>
                      <p>
                        {data?.name}
                      </p>
                      
                    </div>

                    {/* <div className="mt-6 w-full max-w-96">
                      <p className="font-bold text-lg">Descrição:</p>
                      <p>
                        {data?.description ? data?.description : "Sem função atribuída"}
                      </p>
                    </div> */}

                    <div className="mt-4 w-full max-w-96">
                      <p className="font-bold text-lg">Gerenciado:</p>
                      <p>
                        {data?.managed ? 'Sim' : 'Não'}
                      </p>
                    </div>

                    <div className="mt-4 w-full max-w-96">
                      <p className="font-bold mb-2 text-lg">Status:</p>
                      <TrafficLight managed={data?.managed ?? false} published={data?.status === 'PUBLISHED'} />
                    </div>


                  </div>
                </div>

                <hr className="mt-10 mb-6"/>

                <Button
                  className=""
                  onClick={() => navigate(-1)}
                  variant="ghost"
                >
                  Voltar
                </Button>

              </div>

              <div className="w-full mt-0">
                <Detail/>
              </div>

              <StepLoader loading={loading} onClose={handleLoaderClose}/>

            </div>

          </div>
        )}
        
      </motion.div>

    </ScrollArea>
  );
}

