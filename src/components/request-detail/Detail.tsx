// import { useState, useEffect } from 'react';
// import { Button } from '../../components/ui/button';
// import { motion } from 'framer-motion';
// import { Calendar, Check, Clock, Copy, Download, File, MonitorIcon as MonitorCog, MonitorIcon, Pencil, User } from 'lucide-react';
// import RequestStatus from '../../components/request-status/RequestStatus';
// import { CardShine } from '../../components/CardShine';
// import CompactCalendar from '../../components/CompactCalendar';
// import { CopyProtocol } from '../../components/CopyProtocol';

// import {OPTIONS} from "./options";
// import {format} from 'date-fns';
// import {StorageDTO} from "../../services/storage/storage-dto";
// import axios from "axios";
// import {authService} from "../../services/auth";
// import {STORAGE_API} from "../../services/storage/storage-api.ts";
// import {catchError, from, tap} from "rxjs";
// import {requestService} from "../../services/request";
// import {toast} from "../ui/use-toast.ts";
// import useAuthStore from "../../store/authStore.ts";
// import { FlipCalendar } from '../calendar/Flipcalendar.tsx';
// import Head from '../../components/canvas/Head.tsx'
// import { PilotoDetail } from '../canvas/PilotoDetail.tsx';
// import CountdownTracker from '../CountdownTracker.tsx';
// import { Card } from '../ui/card.tsx';
// import { PulseLine } from '../utils/PulseLine.tsx';
// import { BackgroundLines } from '../BackgroundLines.tsx';
// import {FormProvider, useForm} from 'react-hook-form';
// import {zodResolver} from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.tsx";
// import {Input} from "../ui/input.tsx";
// import {Textarea} from "../ui/textarea.tsx";

// export const Detail = ({
//                          data,
//                          attachments,
//                          onUpdate,
//                          origin
//                        }: {
//   data?: any,
//   attachments?: StorageDTO[],
//   onUpdate?: () => void,
//   origin?: string
// }) => {

//   const getInitialAnimation = (status: string): 'idle' | 'headshake' | 'hiphop' => {
//     switch (status) {
//       case 'REJECTED':
//         return 'headshake';
//       case 'APPROVED':
//         return 'hiphop';
//       default:
//         return 'idle';
//     }
//   };

//   const [pilotoAnimation, setPilotoAnimation] = useState<'idle' | 'headshake' | 'hiphop'>(getInitialAnimation(data?.status));
//   const [action, setAction] = useState<string>('');

//   const selected: StatusValue = OPTIONS.filter((o) => o.value === data?.status).map((o) => o.value as StatusValue)[0];
//   const formattedDate = data?.criacao ? format(new Date(data.criacao), 'dd/MM/yyyy') : '';
//   const userInfo = useAuthStore((state) => state.user);

//   const handleDownload = async (fileId: string) => {
//     const token = await authService.getBearerToken()
//     const apiClient = axios.create({
//       baseURL: window.env.API_URL,
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `${token}`
//       }
//     })
//     await apiClient.get(`${STORAGE_API.DOWNLOAD}/${fileId}?registerDownload=true`, {
//       responseType: 'blob',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }).then((response) => {
//       const url = window.URL.createObjectURL(response.data as Blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = response.headers['content-disposition']?.match(/filename="(.+)"/)[1];
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     })
//     //TODO: analisar possivel bug no download de arquivos relacionado com biblioteca de http
//     /*      const response: HttpRequestResponse | HttpRequestError = await storageService.downloadFile(fileId);
//           if (response instanceof HttpRequestResponse){
//             const contentDisposition = response.headers.get("content-disposition")
//             const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
//             const fileName = fileNameMatch ? fileNameMatch[1] : `arquivo_desconhecido`;

//           //const response: HttpRequestResponse | HttpRequestError = await storageService.downloadFile(fileId);
//             const blob = new Blob([response.data], { type: 'image/png' });
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = fileName;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//           }*/
//   };

//   const handleCancel = (request: { finalReason: string}) => {

//     const formData = new FormData();
//     formData.append("request", JSON.stringify({status: 'CANCELED', description: data.description, finalReason: request?.finalReason}));

//     from(requestService.updateRequest(data.id, formData)).pipe(
//       tap(() => {
//           toast({
//             title: 'Sucesso!',
//             description: `Solicitação cancelada com sucesso.`,
//           });
//           onUpdate?.();
//         }
//       ), catchError((error) => {
//         toast({
//           title: 'Erro!',
//           description: `Erro ao cancelar solicitação.`,
//           variant: "destructive",
//         });
//         console.error('Erro ao cancelar solicitação', error);
//         return [];
//       })).subscribe();
//   }

//   const handleReject = (request: { id: number, description: string }) => {

//     const formData = new FormData();
//     formData.append("request", JSON.stringify({status: 'REJECTED', description: request.description}));

//     from(requestService.updateRequest(request.id, formData)).pipe(
//       tap(() => {
//           toast({
//             title: 'Sucesso!',
//             description: `Solicitação rejeitada com sucesso.`,
//           });
//           onUpdate?.();
//         }
//       ), catchError((error) => {
//         toast({
//           title: 'Erro!',
//           description: `Erro ao rejeitar solicitação.`,
//           variant: "destructive",
//         });
//         console.error('Erro ao rejeitar solicitação', error);
//         return [];
//       })).subscribe();
//   }
//   const onSubmit = async (data: any, acao: string) => {
//     if (acao === 'REJECTED') {
//       handleReject(data);
//     }else if (acao === 'APPROVED') {
//       handleApprove(data);
//     }
//   }
//   const handleApprove = (request: { id: number, description: string }) => {
//     const formData = new FormData();
//     formData.append("request", JSON.stringify({status: 'APPROVED', description: request.description}));

//     from(requestService.updateRequest(request.id, formData)).pipe(
//       tap(() => {
//           toast({
//             title: 'Sucesso!',
//             description: `Solicitação aprovada com sucesso.`,
//           });
//           onUpdate?.();
//         }
//       ), catchError((error) => {
//         toast({
//           title: 'Erro!',
//           description: `Erro ao aprovar solicitação.`,
//           variant: "destructive",
//         });
//         console.error('Erro ao aprovar solicitação', error);
//         return [];
//       })).subscribe();
//   }

//   useEffect(() => {
//     setPilotoAnimation(getInitialAnimation(data?.status));
//   }, [data?.status]);

//   const isFinished = ['APPROVED', 'REJECTED'].includes(data?.status);
//   const canCancel = ['CREATED', 'PENDING' ].includes(data?.status) && userInfo?.id === data?.requestingUser?.externalId;

//   const defaultValues =
//     {
//       finalReason: ''
//     };

//   const formSchema = z.object({
//     finalReason: z
//       .string()
//       .min(3, { message: 'O motivo deve conter no mínimo 3 caracteres' }),
//   });

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues
//   });

//   // @ts-ignore
//   return (
//     <>
//       <div className="relative max-w-[1440px] mx-auto">
//         <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
//           <div className="col-span-5 2xl:col-span-6 w-full ">
//             <div className="w-full ">
//               <p className="font-bold mb-3 text-lg">Status da solicitação:</p>
//               {/* <RequestStatus status={selected}/> */}
//               <RequestStatus status={selected} finalReason={data?.finalReason} />
//             </div>
//           </div>

//           <div className="col-span-5 lg:col-span-4 2xl:col-span-3">
//             <div className="">
//               <CopyProtocol protocol={data?.protocolCode}/>
//             </div>
//             <div className="mt-4">
//               <p className="font-bold mb-3 text-lg">Data de envio:</p>
//               <FlipCalendar initialDate={formattedDate}/>
//             </div>
//           </div>

//           <div className="col-span-5 lg:col-span-3 2xl:col-span-3 -mt-6 relative  w-full">
//             <div className="absolute text-white w-40 h-40 left-[50%] -ml-20 top-[50%] mt-12 lg:mt-6 p-4">
//               <p className="text-sm mb-1 font-semibold">
//                 {data?.requestingUser.firstName}
//               </p>
//               <p className="text-sm capitalize">
//                 {data?.role.name}
//               </p>
//             </div>

//             <img className="w-40 mx-auto" src="/img/cracha.svg"/>
//           </div>
//         </div>

//         <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="col-span-8 2xl:col-span-6 w-full ">
//             <div className="mt-4">
//               <div className="flex gap-6">
//                 <div className="mt-2 w-full ">
//                   <p className="font-bold mb-3 text-lg">Sistema:</p>

//                   <CardShine>
//                     <div
//                       className="ring-2 ring-primary p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
//                       <div className="flex flex-row items-center">
//                         <MonitorCog className="w-6 h-6 mr-4"/>
//                         <p className="font-bold text-lg">
//                           {data?.role.client.name}
//                         </p>
//                       </div>

//                       <p className="mt-1 text-sm">
//                         {data?.role.client.description}
//                       </p>
//                     </div>
//                   </CardShine>

//                 </div>

//                 <div className="mt-2 w-full max-w-72">
//                   <p className="font-bold mb-3 text-lg">Papel:</p>
//                   <CardShine>
//                     <div
//                       className="flex flex-col p-5 transition-all ring-2 ring-primary rounded-[var(--card-border-radius)]">
//                       <div className="flex flex-row items-center">
//                         <Pencil className="w-6 h-6 mr-4"/>
//                         <p className="font-bold text-lg capitalize">
//                           {data?.role.name}
//                         </p>
//                       </div>

//                       <p className="mt-1 text-sm">
//                         {data?.role.description}
//                         Descrição aluno lorem ipsum dolor.
//                       </p>
//                     </div>
//                   </CardShine>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-span-3 ">
//             <p className="mt-6 font-bold mb-3 text-lg">Solicitante:</p>
//             <div className="flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)]">
//               <div className="flex flex-row items-center">
//                 <User className="w-6 h-6 mr-4"/>
//                 <p className="">
//                   {data?.requestingUser.firstName}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="col-span-8 2xl:col-span-6 w-full ">
//             <p className="mt-6 font-bold mb-3 text-lg">Motivo do acesso:</p>
//             <div className="col-span-8 p-5 transition-all border rounded-[var(--card-border-radius)]">
//               <p>
//                 {data?.description}
//                 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, enim odit. Voluptates rerum
//                 exercitationem consequuntur amet omnis labore ullam, dolorem porro saepe reiciendis fugit quae. Sed
//                 porro quae magnam!
//               </p>
//             </div>
//           </div>

//           <div className="col-span-12 lg:col-span-3 w-full">
//             <p className="text-md font-bold mt-6 mb-1 text-lg">Anexos:</p>
//             <div className="mt-3 flex gap-4">

//               <div className="w-20 flex flex-col">
//                 <div
//                   className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
//                 >
//                   <div className="flex flex-col items-center">
//                     <File className="w-8 h-8"/>
//                   </div>
//                   <button
//                     className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
//                   >
//                     Baixar
//                   </button>
//                 </div>

//               </div>

//               <div className="w-20 flex flex-col">
//                 <div
//                   className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
//                 >
//                   <div className="flex flex-col items-center">
//                     <File className="w-8 h-8"/>
//                   </div>
//                   <button
//                     className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
//                   >
//                     Baixar
//                   </button>
//                 </div>
//               </div>

//               <div className="w-20 flex flex-col">
//                 <div
//                   className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
//                 >
//                   <div className="flex flex-col items-center">
//                     <File className="w-8 h-8"/>
//                   </div>
//                   <button
//                     className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
//                   >
//                     Baixar
//                   </button>
//                 </div>
//               </div>

//               <div className="w-20 flex flex-col">
//                 <div
//                   className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
//                 >
//                   <div className="flex flex-col items-center">
//                     <File className="w-8 h-8"/>
//                   </div>
//                   <button
//                     className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
//                   >
//                     Baixar
//                   </button>
//                 </div>
//               </div>


//               {/* {attachments?.map((attachment) => (
//                 <div key={attachment.id} className="w-16 flex flex-col">
//                   <div
//                     className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
//                   >
//                     <div className="flex flex-col items-center">
//                       <File className="w-8 h-8"/>
//                     </div>
//                     <button
//                       className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
//                       onClick={() => handleDownload(attachment.id)}
//                     >
//                       Baixar
//                     </button>
//                   </div>
//                 </div>
//               ))} */}

//             </div>
//           </div>

//           <div className="col-span-12 lg:col-span-3 w-full relative">
//             <div className="hidden 2xl:block 2xl:absolute right-0 -top-24 w-72 h-72">
//               <PilotoDetail currentAnimation={pilotoAnimation}/>
//             </div>
//             {pilotoAnimation === 'hiphop' &&
//               <BackgroundLines className="absolute flex items-center justify-center w-full flex-col px-4 -mt-20">
//                 &nbsp;
//               </BackgroundLines>
//             }
//           </div>
//         </div>

//         {/* <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">


//           <div className="col-span-8 2xl:col-span-6 w-full ">
//             <p className="mt-6 font-bold mb-3 text-lg">Motivo da conclusão:</p>
//             <div className="col-span-8 p-5 transition-all border rounded-[var(--card-border-radius)]">
//               <p>
//                 {data?.finalReason}
//                 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, enim odit. Voluptates rerum
//                 exercitationem consequuntur amet omnis labore ullam, dolorem porro saepe reiciendis fugit quae. Sed
//                 porro quae magnam!
//               </p>
//             </div>
//           </div>

//         </div> */}

//         <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="col-span-12 w-full ">
//             <div className="w-full mt-6">
//               <hr className="mb-6"/>
//               {
//                 <motion.div
//                   className="absolute"
//                   initial={{y: 12, opacity: 0}}
//                   animate={{y: 0, opacity: 1}}
//                   exit={{y: -12, opacity: 0}}
//                 >
//                   {canCancel && !isFinished && (
//                     <div className="flex gap-x-2">
//                       <Clock className="w-5 h-5 text-red-500 mt-1"/>
//                       <h2 className="text-lg mb-6">
//                         Essa solicitação aguarda definição.
//                       </h2>
//                     </div>
//                   )}
//                   <div className="w-full flex gap-4">
//                     {canCancel && origin === 'created'&&
//                       <FormProvider {...form}>
//                         <form onSubmit={form.handleSubmit(handleCancel)} className="w-full space-y-8 "
//                         >
//                           <div className="gap-x-8 gap-y-4 md:grid md:grid-cols-1 max-w-md">
//                             <FormField
//                               control={form.control}
//                               name="finalReason"
//                               render={({field}) => (
//                                 <FormItem>
//                                   <FormLabel>Motivo da conclusão</FormLabel>
//                                   <FormControl>
//                                     <Textarea
//                                       placeholder="Motivo da conclusão..."
//                                       className="col-span-4"
//                                       {...field}
//                                     />
//                                   </FormControl>
//                                   <FormMessage/>
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                           <Button
//                             className="w-40 bg-red-200 text-red-800 hover:bg-red-800 hover:text-red-200"
//                             type="submit"
//                           >
//                             Cancelar
//                           </Button>
                          
//                         </form>
//                       </FormProvider>
//                     }
//                     {(!isFinished && origin === 'assigned') && (<>
//                       <FormProvider {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 "
//                         >
//                           <div className="gap-x-8 gap-y-4 md:grid md:grid-cols-1 max-w-md">
//                             <FormField
//                               control={form.control}
//                               name="finalReason"
//                               render={({field}) => (
//                                 <FormItem>
//                                   <FormLabel>Motivo da conclusão</FormLabel>
//                                   <FormControl>
//                                     <Textarea
//                                       placeholder="Motivo da conclusão..."
//                                       className="col-span-4"
//                                       {...field}
//                                     />
//                                   </FormControl>
//                                   <FormMessage/>
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                           <Button
//                             className="w-40 bg-yellow-200 text-red-800 hover:bg-yellow-400 hover:text-red-800"
//                             type="submit"
//                             onClick={() => setAction('REJECTED')}
//                           >
//                             Rejeitar
//                           </Button>
//                           <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200"
//                                   type="submit"
//                                   onClick={() => setAction('APPROVED')}>
//                             Aprovar
//                           </Button>
//                         </form>
//                       </FormProvider>
//                       {/*<Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200"*/}
//                       {/*        type="submit"*/}
//                       {/*        onClick={() => handleReject(data)}>*/}
//                       {/*  Rejeitar*/}
//                       {/*</Button>*/}
//                       {/*<Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200"*/}
//                       {/*        type="submit"*/}
//                       {/*        onClick={() => handleApprove(data)}>*/}
//                       {/*  Aprovar*/}
//                       {/*</Button>*/}
                      
//                     </>)}

//                   </div>
//                 </motion.div>
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock, Copy, Download, File, MonitorIcon as MonitorCog, MonitorIcon, Pencil, User } from 'lucide-react';
import RequestStatus from '../../components/request-status/RequestStatus';
import { CardShine } from '../../components/CardShine';
import CompactCalendar from '../../components/CompactCalendar';
import { CopyProtocol } from '../../components/CopyProtocol';

import {OPTIONS} from "./options";
import {format} from 'date-fns';
import {StorageDTO} from "../../services/storage/storage-dto";
import axios from "axios";
import {authService} from "../../services/auth";
import {STORAGE_API} from "../../services/storage/storage-api.ts";
import {catchError, from, tap} from "rxjs";
import {requestService} from "../../services/request";
import {toast} from "../ui/use-toast.ts";
import useAuthStore from "../../store/authStore.ts";
import { FlipCalendar } from '../calendar/Flipcalendar.tsx';
import Head from '../../components/canvas/Head.tsx'
import { PilotoDetail } from '../canvas/PilotoDetail.tsx';
import CountdownTracker from '../CountdownTracker.tsx';
import { Card } from '../ui/card.tsx';
import { PulseLine } from '../utils/PulseLine.tsx';
import { BackgroundLines } from '../BackgroundLines.tsx';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "../ui/input.tsx";
import {Textarea} from "../ui/textarea";
import { ConfirmationModal } from './ConfirmationModal';
import { Cracha } from './Cracha.tsx';

export const Detail = ({
                         data,
                         attachments,
                         onUpdate,
                         origin
                       }: {
  data?: any,
  attachments?: StorageDTO[],
  onUpdate?: () => void,
  origin?: string
}) => {

  const getInitialAnimation = (status: string): 'idle' | 'headshake' | 'hiphop' => {
    switch (status) {
      case 'REJECTED':
        return 'headshake';
      case 'APPROVED':
        return 'hiphop';
      default:
        return 'idle';
    }
  };

  const [pilotoAnimation, setPilotoAnimation] = useState<'idle' | 'headshake' | 'hiphop'>(getInitialAnimation(data?.status));
  const [action, setAction] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'CANCELED' | 'REJECTED' | 'APPROVED'>('CANCELED');

  const selected: StatusValue = OPTIONS.filter((o) => o.value === data?.status).map((o) => o.value as StatusValue)[0];
  const formattedDate = data?.criacao ? format(new Date(data.criacao), 'dd/MM/yyyy') : '';
  const userInfo = useAuthStore((state) => state.user);

  const handleDownload = async (fileId: string) => {
    const token = await authService.getBearerToken()
    const apiClient = axios.create({
      baseURL: window.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    })
    await apiClient.get(`${STORAGE_API.DOWNLOAD}/${fileId}?registerDownload=true`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(response.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers['content-disposition']?.match(/filename="(.+)"/)[1];
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    //TODO: analisar possivel bug no download de arquivos relacionado com biblioteca de http
    /*      const response: HttpRequestResponse | HttpRequestError = await storageService.downloadFile(fileId);
          if (response instanceof HttpRequestResponse){
            const contentDisposition = response.headers.get("content-disposition")
            const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
            const fileName = fileNameMatch ? fileNameMatch[1] : `arquivo_desconhecido`;

          //const response: HttpRequestResponse | HttpRequestError = await storageService.downloadFile(fileId);
            const blob = new Blob([response.data], { type: 'image/png' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }*/
  };

  const handleCancel = (request: { finalReason: string}) => {

    const formData = new FormData();
    formData.append("request", JSON.stringify({status: 'CANCELED', description: data.description, finalReason: request?.finalReason}));

    from(requestService.updateRequest(data.id, formData)).pipe(
      tap(() => {
          toast({
            title: 'Sucesso!',
            description: `Solicitação cancelada com sucesso.`,
          });
          onUpdate?.();
          setIsModalOpen(false);
        }
      ), catchError((error) => {
        toast({
          title: 'Erro!',
          description: `Erro ao cancelar solicitação.`,
          variant: "destructive",
        });
        console.error('Erro ao cancelar solicitação', error);
        return [];
      })).subscribe();
  }

  const handleReject = (request: { id: number, description: string, finalReason: string }) => {

    const formData = new FormData();
    formData.append("request", JSON.stringify({status: 'REJECTED', description: request.description, finalReason: request?.finalReason}));

    from(requestService.updateRequest(request.id, formData)).pipe(
      tap(() => {
          toast({
            title: 'Sucesso!',
            description: `Solicitação rejeitada com sucesso.`,
          });
          onUpdate?.();
          setIsModalOpen(false);
        }
      ), catchError((error) => {
        toast({
          title: 'Erro!',
          description: `Erro ao rejeitar solicitação.`,
          variant: "destructive",
        });
        console.error('Erro ao rejeitar solicitação', error);
        return [];
      })).subscribe();
  }
  const handleApprove = (request: { id: number, description: string }) => {
    const formData = new FormData();
    formData.append("request", JSON.stringify({status: 'APPROVED', description: request.description}));

    from(requestService.updateRequest(request.id, formData)).pipe(
      tap(() => {
          toast({
            title: 'Sucesso!',
            description: `Solicitação aprovada com sucesso.`,
          });
          onUpdate?.();
          setIsModalOpen(false);
        }
      ), catchError((error) => {
        toast({
          title: 'Erro!',
          description: `Erro ao aprovar solicitação.`,
          variant: "destructive",
        });
        console.error('Erro ao aprovar solicitação', error);
        return [];
      })).subscribe();
  }

  const onSubmit = async (formData: any) => {
    if (modalAction === 'APPROVED') {
      handleApprove({id: data.id, description: ''});
    } else if (modalAction === 'REJECTED') {
      handleReject({...formData, id: data.id});
    } else if (modalAction === 'CANCELED') {
      handleCancel(formData);
    }
  };

  useEffect(() => {
    setPilotoAnimation(getInitialAnimation(data?.status));
  }, [data?.status]);

  const isFinished = ['APPROVED', 'REJECTED'].includes(data?.status);
  const canCancel = ['CREATED', 'PENDING' ].includes(data?.status) && userInfo?.id === data?.requestingUser?.externalId;

  const formSchema = z.object({
    finalReason: z
      .string()
      .min(3, { message: 'O motivo deve conter no mínimo 3 caracteres' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      finalReason: ''
    }
  });

  // @ts-ignore
  return (
    <FormProvider {...form}>
      <div className="relative max-w-[1440px] mx-auto">
        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="col-span-5 2xl:col-span-6 w-full ">
            <div className="w-full ">
              <p className="font-bold mb-3 text-lg">Status da solicitação:</p>
              <RequestStatus status={selected} finalReason={data?.finalReason} />

            </div>
          </div>

          <div className="col-span-5 lg:col-span-4 2xl:col-span-3">
            <div className="">
              <CopyProtocol protocol={data?.protocolCode}/>
            </div>
            <div className="mt-4">
              <p className="font-bold mb-3 text-lg">Data de envio:</p>
              <FlipCalendar initialDate={formattedDate}/>
            </div>
          </div>

          <div className="col-span-5 lg:col-span-3 2xl:col-span-3 -mt-6 relative  w-full">
            <div className="absolute text-white w-40 h-40 left-[50%] -ml-20 top-[50%] mt-12 lg:mt-6 p-4">
              <p className="text-sm mb-1 font-semibold">
                {data?.requestingUser.firstName}
              </p>
              <p className="text-sm capitalize">
                {data?.role.name}
              </p>
            </div>

            {/* <img className="w-40 mx-auto" src="/img/cracha.svg"/> */}
            <Cracha data={data} />
          </div>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-8 2xl:col-span-6 w-full ">
            <div className="mt-4">
              <div className="flex gap-6">
                <div className="mt-2 w-full ">
                  <p className="font-bold mb-3 text-lg">Sistema:</p>

                  <CardShine>
                    <div
                      className="ring-2 ring-primary p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
                      <div className="flex flex-row items-center">
                        <MonitorCog className="w-6 h-6 mr-4"/>
                        <p className="font-bold text-lg">
                          {data?.role.client.name}
                        </p>
                      </div>

                      <p className="mt-1 text-sm">
                        {data?.role.client.description}
                      </p>
                    </div>
                  </CardShine>

                </div>

                <div className="mt-2 w-full max-w-72">
                  <p className="font-bold mb-3 text-lg">Papel:</p>
                  <CardShine>
                    <div
                      className="flex flex-col p-5 transition-all ring-2 ring-primary rounded-[var(--card-border-radius)]">
                      <div className="flex flex-row items-center">
                        <Pencil className="w-6 h-6 mr-4"/>
                        <p className="font-bold text-lg capitalize">
                          {data?.role.name}
                        </p>
                      </div>

                      <p className="mt-1 text-sm">
                        {data?.role.description}
                        Descrição aluno lorem ipsum dolor.
                      </p>
                    </div>
                  </CardShine>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 ">
            <p className="mt-6 font-bold mb-3 text-lg">Solicitante:</p>
            <div className="flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)]">
              <div className="flex flex-row items-center">
                <User className="w-6 h-6 mr-4"/>
                <p className="">
                  {data?.requestingUser.firstName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-8 2xl:col-span-6 w-full ">
            <p className="mt-6 font-bold mb-3 text-lg">Motivo do acesso:</p>
            <div className="col-span-8 p-5 transition-all border rounded-[var(--card-border-radius)]">
              <p>
                {data?.description}
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, enim odit. Voluptates rerum
                exercitationem consequuntur amet omnis labore ullam, dolorem porro saepe reiciendis fugit quae. Sed
                porro quae magnam!
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 w-full">
            <p className="text-md font-bold mt-6 mb-1 text-lg">Anexos:</p>
            <div className="mt-3 flex gap-4">

              {/* <div className="w-20 flex flex-col">
                <div
                  className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex flex-col items-center">
                    <File className="w-8 h-8"/>
                  </div>
                  <button
                    className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                  >
                    Baixar
                  </button>
                </div>

              </div> */}

                
              {attachments?.map((attachment) => (
                <div key={attachment.id} className="w-16 flex flex-col">
                  <div
                    className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex flex-col items-center">
                      <File className="w-8 h-8"/>
                    </div>
                    <button
                      className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                      onClick={() => handleDownload(attachment.id)}
                    >
                      Baixar
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 w-full relative">
            <div className="hidden 2xl:block 2xl:absolute right-0 -top-24 w-72 h-72">
              <PilotoDetail currentAnimation={pilotoAnimation}/>
            </div>
            {pilotoAnimation === 'hiphop' &&
              <BackgroundLines className="absolute flex items-center justify-center w-full flex-col px-4 -mt-20">
                &nbsp;
              </BackgroundLines>
            }
          </div>
        </div>

        {/* <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">


          <div className="col-span-8 2xl:col-span-6 w-full ">
            <p className="mt-6 font-bold mb-3 text-lg">Motivo da conclusão:</p>
            <div className="col-span-8 p-5 transition-all border rounded-[var(--card-border-radius)]">
              <p>
                {data?.finalReason}
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, enim odit. Voluptates rerum
                exercitationem consequuntur amet omnis labore ullam, dolorem porro saepe reiciendis fugit quae. Sed
                porro quae magnam!
              </p>
            </div>
          </div>

        </div> */}

        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-12 w-full ">
            <div className="w-full mt-6">
              <hr className="mb-6"/>
              {
                <motion.div
                  className="absolute"
                  initial={{y: 12, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  exit={{y: -12, opacity: 0}}
                >
                  {canCancel && !isFinished && (
                    <div className="flex gap-x-2">
                      <Clock className="w-5 h-5 text-red-500 mt-1"/>
                      <h2 className="text-lg mb-6">
                        Essa solicitação aguarda definição.
                      </h2>
                    </div>
                  )}
                  <div className="w-full flex gap-4">
                    {canCancel && origin === 'created' && (
                      <Button
                        className="w-40 bg-red-200 text-red-800 hover:bg-red-800 hover:text-red-200"
                        onClick={() => {
                          setModalAction('CANCELED');
                          setIsModalOpen(true);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    {(!isFinished && origin === 'assigned') && (
                      <>
                        <Button
                          className="w-40 bg-yellow-200 text-red-800 hover:bg-yellow-400 hover:text-red-800"
                          onClick={() => {
                            setModalAction('REJECTED');
                            setIsModalOpen(true);
                          }}
                        >
                          Rejeitar
                        </Button>
                        <Button
                          className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200"
                          onClick={() => {
                            setModalAction('APPROVED');
                            setIsModalOpen(true);
                          }}
                        >
                          Aprovar
                        </Button>
                      </>
                    )}

                  </div>
                </motion.div>
              }
            </div>
          </div>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={modalAction === 'APPROVED' ? () => onSubmit({}) : form.handleSubmit(onSubmit)}
          title={`${modalAction === 'CANCELED' ? 'Cancelar' : modalAction === 'REJECTED' ? 'Rejeitar' : 'Aprovar'} Solicitação`}
          action={modalAction === 'CANCELED' ? 'cancelamento' : modalAction === 'REJECTED' ? 'rejeição' : 'aprovação'}
          form={form}
        />
      </div>
    </FormProvider>
  );
};





