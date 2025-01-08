import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock, Copy, Download, File, MonitorIcon as MonitorCog, Pencil } from 'lucide-react';
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
        <div className="relative max-w-[1070px] ">
          
          <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="col-span-2 w-full ">
              <div className="w-full max-w-[700px]">
                <p className="font-bold mb-3">Status da solicitação:</p>
                <RequestStatus status={selected} />
              </div>
            </div>

            {/* <div>
              <CopyProtocol protocol={data?.protocolCode} />

              <div className="mt-6">
                <p className="font-bold mb-1">Motivo do acesso:</p>
                <p>
                  {data?.description}
                </p>
              </div>

              <div className="mt-6">
                <p className="font-bold mb-1">Solicitante:</p>
                <p>
                  {data?.requestingUser.firstName}
                </p>
              </div>
            </div> */}

            <div className="">
              <div className="">
                <p className="font-bold mb-3">Data de envio:</p>
                <CompactCalendar initialDate={formattedDate} />
                {/* <FlipCalendar initialDate={formattedDate} /> */}
              </div>
            </div>

            
            
          </div>

          <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="col-span-2 w-full ">

              <div className="mt-4">
                
                <div className="flex gap-6">
                  <div className="mt-2 w-full max-w-96">
                    <p className="font-bold mb-3">Sistema:</p>
                    <CardShine>

                      <div className="border-2 border-primary p-6 grid items-center min-h-[160px] h-auto transition-all rounded-[var(--card-border-radius)] ">
                        <Check className="absolute top-6 right-6" />
                        <MonitorCog className="w-6 h-6 mb-3" />
                        <span className="font-semibold text-lg">
                          {data?.role.client.name}
                        </span>
                        <p className="mt-1 text-sm">
                          Descricao lorem ipsum dolor sit amet. Dolor sit emat ipsum dolor sit.
                        </p>
                      </div>
                    </CardShine>
                  </div>

                  <div className="mt-2 w-full max-w-72">
                    <p className="font-bold mb-3">Papel:</p>
                    <CardShine>
                      <div className="flex flex-col p-6 transition-all ring-2 ring-primary rounded-[var(--card-border-radius)]">
                        <Check className="absolute top-6 right-6" />
                        <Pencil className="w-6 h-6 mb-3" />
                        <span className="font-semibold text-lg capitalize">
                          {data?.role.name}
                        </span>
                        <p className="mt-1 text-sm">
                          {data?.role.description}
                        </p>
                      </div>
                    </CardShine>
                  </div>
                </div>

              </div>

              <p className="text-md font-bold mt-6 mb-1">Anexos:</p>

              <div className="mt-4">
                <div className="flex flex-col">
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
              </div>

            </div>

            <div className="">

              <div className="mt-6">
                <CopyProtocol protocol={data?.protocolCode} />
              </div>

              <div className="mt-4">
                <p className="font-bold mb-1">Motivo do acesso:</p>
                <p>
                  {data?.description}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-bold mb-1">Solicitante:</p>
                <p>
                  {data?.requestingUser.firstName}
                </p>
              </div>

            </div>
            
          </div>



          <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="col-span-2 w-full ">

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
