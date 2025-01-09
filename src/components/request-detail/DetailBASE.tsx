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

  const handleCancel = (request: { id: number, description: string }) => {

    const formData = new FormData();
    formData.append("request", JSON.stringify({status: 'CANCELED', description: request.description}));

    from(requestService.updateRequest(request.id, formData)).pipe(
      tap(() => {
          toast({
            title: 'Sucesso!',
            description: `Solicitação cancelada com sucesso.`,
          });
          onUpdate?.();
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

  const handleReject = (request: { id: number, description: string }) => {

    const formData = new FormData();
    formData.append("request", JSON.stringify({status: 'REJECTED', description: request.description}));

    from(requestService.updateRequest(request.id, formData)).pipe(
      tap(() => {
          toast({
            title: 'Sucesso!',
            description: `Solicitação rejeitada com sucesso.`,
          });
          onUpdate?.();
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

  const isFinished = ['APPROVED', 'REJECTED'].includes(data?.status);
  const canCancel = ['CREATED', 'PENDING' ].includes(data?.status) && userInfo?.id === data?.requestingUser?.externalId;
  return (
      <>
        

        
        <div className="hidden  grid-cols-1 gap-4 lg:grid-cols-12 mb-16">
            
          <div className="col-span-1 lg:col-span-5">
            <Card className="h-[815px] p-6">
              <PulseLine />
              <div className="col-span-5 2xl:col-span-6 w-full ">
                <div className="w-full ">
                  <p className="font-bold mb-3 text-lg">Status da solicitação:</p>
                  <RequestStatus status={selected} />
                </div>
              
                <div className="mt-4">
                
                  <div className="flex gap-6">
                    <div className="mt-2 w-full ">
                      <p className="font-bold mb-3 text-lg">Sistema:</p>
                      
                      <CardShine>

                        <div className="ring-2 ring-primary p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
                          {/* <Check className="absolute top-6 right-6" /> */}

                          <div className="flex flex-row items-center">
                            <MonitorCog className="w-6 h-6 mr-4" />
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
                        <div className="flex flex-col p-5 transition-all ring-2 ring-primary rounded-[var(--card-border-radius)]">
                          {/* <Check className="absolute top-6 right-6" /> */}
                          
                          <div className="flex flex-row items-center">
                            <Pencil className="w-6 h-6 mr-4" />
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

                  <div className="col-span-8 2xl:col-span-6 w-full ">
                    <p className="mt-6 font-bold mb-3 text-lg">Motivo do acesso:</p>
                    <div className="col-span-8 p-5 transition-all border rounded-[var(--card-border-radius)]">
                      <p>
                        {data?.description}
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, enim odit. Voluptates rerum exercitationem consequuntur amet omnis labore ullam, dolorem porro saepe reiciendis fugit quae. Sed porro quae magnam!
                      </p>
                    </div>
                    
                  </div>

                </div>

              </div>



            </Card>
          </div>

          <div className="col-span-1 grid grid-cols-2 gap-4 lg:col-span-7">
            
            <div className="col-span-1 h-fit">
              <Card className="sm:h-[400px] p-6">
                <div className="w-full">
                  <div className="">
                    <CopyProtocol protocol={data?.protocolCode} />
                  </div>
                  <div className="mt-4">
                    <p className="font-bold mb-3 text-lg">Data de envio:</p>
                    {/* <CompactCalendar initialDate={formattedDate} /> */}
                    <FlipCalendar initialDate={formattedDate} />
                  </div>
                </div>
              </Card>
            </div>
            <div className="col-span-1 h-fit">
              <Card className="sm:h-[400px]">
                <div className="w-full h-[400px] relative">
                  <PilotoDetail currentAnimation="idle" />
                  
                  <div className=" absolute top-0 right-10">
                    <div className="absolute  text-white w-40 h-40 left-[50%] -ml-20 top-[50%] mt-10 p-4">
                      <p className="text-sm mb-1 font-semibold">
                        {data?.requestingUser.firstName}
                      </p>
                      <p className="text-sm">
                        {data?.role.name}
                      </p>
                    </div>
                    <img className="w-40 mx-auto" src="/img/cracha.svg" />
                  </div>

                </div>
              </Card>
            </div>
            <div className="col-span-1 h-fit">
              <Card className="sm:h-[400px] p-6">
                <div className="w-full">
                  <p className="font-bold mb-3 text-lg">Solicitante:</p>
                  <div className="flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)]">
                    <div className="flex flex-row items-center">
                      <User className="w-6 h-6 mr-4" />
                      <p className="">
                      {data?.requestingUser.firstName}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="col-span-1 h-fit">
              <Card className="sm:h-[400px] p-6">
                <div className="w-full">

                  <p className="text-md font-bold mb-1 text-lg">Anexos:</p>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    
                    <div className="w-16 flex flex-col">
                      <div
                        className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex flex-col items-center">
                          <File className="w-8 h-8"/>
                          {/* <p className="text-xs">original filename</p> */}
                        </div>
                        <button
                          className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                        >
                          Baixar
                        </button>
                      </div>
                      {/* {attachments && attachments.length > 0 ? (
                        attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between pr-3 py-3 rounded-md shadow-sm hover:shadow-lg transition"
                          >
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-3"/>
                              <p className="text-xs">{file.originalFilename}</p>
                            </div>
                            <button
                              onClick={() => handleDownload(file.id)}
                              className="text-blue-500 cursor-pointer hover:underline"
                            >
                              Baixar
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Sem anexos</p>
                      )} */}
                    </div>

                    <div className="w-16 flex flex-col">
                      <div
                        className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex flex-col items-center">
                          <File className="w-8 h-8"/>
                          {/* <p className="text-xs">original filename</p> */}
                        </div>
                        <button
                          className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                        >
                          Baixar
                        </button>
                      </div>
                    </div>

                    <div className="w-16 flex flex-col">
                      <div
                        className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex flex-col items-center">
                          <File className="w-8 h-8"/>
                          {/* <p className="text-xs">original filename</p> */}
                        </div>
                        <button
                          className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                        >
                          Baixar
                        </button>
                      </div>
                    </div>

                    <div className="w-16 flex flex-col">
                      <div
                        className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex flex-col items-center">
                          <File className="w-8 h-8"/>
                          {/* <p className="text-xs">original filename</p> */}
                        </div>
                        <button
                          className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                        >
                          Baixar
                        </button>
                      </div>
                    </div>


                    

                  </div>
                </div>
              </Card>
            </div>

          </div>
          
        </div>








        
        <div className="relative max-w-[1440px]  mx-auto">



          <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

            <div className="col-span-5 2xl:col-span-6 w-full ">
              <div className="w-full ">
                <p className="font-bold mb-3 text-lg">Status da solicitação:</p>
                <RequestStatus status={selected} />
              </div>
            </div>

            <div className="col-span-5 lg:col-span-4 2xl:col-span-3">
              <div className="">
                <CopyProtocol protocol={data?.protocolCode} />
              </div>
              <div className="mt-4">
                <p className="font-bold mb-3 text-lg">Data de envio:</p>
                {/* <CompactCalendar initialDate={formattedDate} /> */}
                <FlipCalendar initialDate={formattedDate} />
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
              
              <img className="w-40 mx-auto" src="/img/cracha.svg" />
              {/* <CountdownTracker /> */}

            </div>


            
            
          </div>

          <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="col-span-8 2xl:col-span-6 w-full ">

              <div className="mt-4">
                
                <div className="flex gap-6">
                  <div className="mt-2 w-full ">
                    <p className="font-bold mb-3 text-lg">Sistema:</p>
                    
                    <CardShine>

                      <div className="ring-2 ring-primary p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
                        {/* <Check className="absolute top-6 right-6" /> */}

                        <div className="flex flex-row items-center">
                          <MonitorCog className="w-6 h-6 mr-4" />
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
                      <div className="flex flex-col p-5 transition-all ring-2 ring-primary rounded-[var(--card-border-radius)]">
                        {/* <Check className="absolute top-6 right-6" /> */}
                        
                        <div className="flex flex-row items-center">
                          <Pencil className="w-6 h-6 mr-4" />
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


              {/* <p className="mt-6 font-bold mb-3 text-lg">Motivo do acesso:</p>
              <div className="flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)]">
                <div className="">
                  <p>
                    {data?.description}
                  </p>
                </div>
              </div> */}

              {/* <p className="text-md font-bold mt-6 mb-1 text-lg">Anexos:</p> */}

              {/* <div className="mt-3 flex">
                
                <div className="w-16 flex flex-col">
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
                  {attachments && attachments.length > 0 ? (
                    attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pr-3 py-3 rounded-md shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-3"/>
                          <p className="text-xs">{file.originalFilename}</p>
                        </div>
                        <button
                          onClick={() => handleDownload(file.id)}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Baixar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Sem anexos</p>
                  )}
                </div>

                <div className="w-16 flex flex-col">
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
                </div>

              </div> */}

            </div>

            <div className="col-span-3 ">
              <p className="mt-6 font-bold mb-3 text-lg">Solicitante:</p>
              <div className="flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)]">
                <div className="flex flex-row items-center">
                  <User className="w-6 h-6 mr-4" />
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
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, enim odit. Voluptates rerum exercitationem consequuntur amet omnis labore ullam, dolorem porro saepe reiciendis fugit quae. Sed porro quae magnam!
                </p>
              </div>
              {/* anexos */}

            </div>

            <div className="col-span-12 lg:col-span-3 w-full">
              {/* <PilotoDetail currentAnimation="idle" /> */}
              
              <p className="text-md font-bold mt-6 mb-1 text-lg">Anexos:</p>
              <div className="mt-3 grid grid-cols-6 gap-2">
                
                <div className="w-16 flex flex-col">
                  <div
                    className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex flex-col items-center">
                      <File className="w-8 h-8"/>
                      {/* <p className="text-xs">original filename</p> */}
                    </div>
                    <button
                      className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                    >
                      Baixar
                    </button>
                  </div>
                  {/* {attachments && attachments.length > 0 ? (
                    attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pr-3 py-3 rounded-md shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-3"/>
                          <p className="text-xs">{file.originalFilename}</p>
                        </div>
                        <button
                          onClick={() => handleDownload(file.id)}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Baixar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Sem anexos</p>
                  )} */}
                </div>

                <div className="w-16 flex flex-col">
                  <div
                    className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex flex-col items-center">
                      <File className="w-8 h-8"/>
                      {/* <p className="text-xs">original filename</p> */}
                    </div>
                    <button
                      className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                    >
                      Baixar
                    </button>
                  </div>
                </div>

                <div className="w-16 flex flex-col">
                  <div
                    className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex flex-col items-center">
                      <File className="w-8 h-8"/>
                      {/* <p className="text-xs">original filename</p> */}
                    </div>
                    <button
                      className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                    >
                      Baixar
                    </button>
                  </div>
                </div>

                <div className="w-16 flex flex-col">
                  <div
                    className="flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex flex-col items-center">
                      <File className="w-8 h-8"/>
                      {/* <p className="text-xs">original filename</p> */}
                    </div>
                    <button
                      className="text-blue-400 text-sm mt-1 cursor-pointer hover:underline"
                    >
                      Baixar
                    </button>
                  </div>
                </div>


                

              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 w-full relative">
              <div className="hidden 2xl:block 2xl:absolute right-0 -top-24 w-72 h-72">
                <PilotoDetail currentAnimation="idle" />
              </div>
            </div>

          </div>






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
                      {canCancel && (
                        <Button className="w-40 bg-red-200 text-red-800 hover:bg-red-800 hover:text-red-200"
                                type="submit"
                                onClick={() => handleCancel(data)}>
                          Cancelar
                        </Button>
                      )}
                      {(!isFinished && origin === 'assigned') && (<>
                        <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200"
                                type="submit"
                                onClick={() => handleReject(data)}>
                          Rejeitar
                        </Button>
                        <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200" type="submit"
                                onClick={() => handleApprove(data)}>
                          Aprovar
                        </Button>
                      </>)}
                    </div>
                  </motion.div>
                }
              </div>
            </div>

            <div className="hidden relative border-t mt-8 w-full">
              <div className="absolute  text-white w-40 h-40 left-[50%] -ml-20 top-[50%] mt-10 p-4">
                <p className="text-sm mb-1 font-semibold">
                  {data?.requestingUser.firstName}
                </p>
                <p className="text-sm">
                  {data?.role.name}
                </p>
              </div>
              <img className="w-40 mx-auto" src="/img/cracha.svg" />
            </div>
          </div>
        </div>

      </>
  );
};
