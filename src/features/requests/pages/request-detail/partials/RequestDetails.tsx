import { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button.tsx";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Globe, MonitorIcon as MonitorCog } from "lucide-react";
import RequestStatus from "./RequestStatus.tsx";
import { CopyProtocol } from "../../../../../components/CopyProtocol.tsx";
import { Card } from "../../../../../components/ui/card.tsx";

import { OPTIONS } from "../../../../../components/request-detail/options.tsx";
import { format } from "date-fns";
import useAuthStore from "../../../../../store/authStore.ts";
import { FlipCalendar } from "../../../../../components/calendar/Flipcalendar.tsx";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ConfirmationModal } from "../../../../../components/request-detail/ConfirmationModal.tsx";
import { Cracha } from "../../../../../components/request-detail/Cracha.tsx";
import { ShuffleLoader } from "../../../../../components/shuffle-loader/ShuffleLoader.tsx";
import AttachmentConfigurationPresentation, {
  FileAttachment
} from "../../../../../common/components/AttachmentConfiguration/AttachmentConfigurationPresentation.tsx";
import TruncatedText from "../../../../../common/components/TruncatedText.tsx";

interface RequestDetailsProps {
  data?: any;
  attachments?: FileAttachment[];
  origin?: string;
  loading?: boolean;
  onDownload: (file: any) => void;
  onCancel: (finalReason: string) => void;
  onReject: (description: string, finalReason: string) => void;
  onApprove: (description: string) => void;
}

export const RequestDetails = ({
  data,
  attachments = [],
  origin,
  loading = false,
  onDownload,
  onCancel,
  onReject,
  onApprove
}: RequestDetailsProps) => {

  const getInitialAnimation = (status: string): "idle" | "headshake" | "hiphop" => {
    switch(status) {
      case "REJECTED":
        return "headshake";
      case "APPROVED":
        return "hiphop";
      default:
        return "idle";
    }
  };

  const [pilotoAnimation, setPilotoAnimation] = useState<"idle" | "headshake" | "hiphop">(getInitialAnimation(data?.status));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"CANCELED" | "REJECTED" | "APPROVED">("CANCELED");
  const [isContentLoading, setIsContentLoading] = useState(true);

  const selected: any = OPTIONS.filter((o) => o.value === data?.status).map((o) => o.value)[0];
  const formattedDate = data?.criacao ? format(new Date(data.criacao), "dd/MM/yyyy") : "";
  const userInfo = useAuthStore((state) => state.user);

  const onSubmit = async (formData: any) => {
    if(modalAction === "APPROVED") {
      onApprove(data.description || "");
    } else if(modalAction === "REJECTED") {
      onReject(data.description || "", formData.finalReason);
    } else if(modalAction === "CANCELED") {
      onCancel(formData.finalReason);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPilotoAnimation(getInitialAnimation(data?.status));
  }, [data?.status]);

  const isFinished = ["APPROVED", "REJECTED"].includes(data?.status);
  const canCancel = ["CREATED", "PENDING"].includes(data?.status) && userInfo?.id === data?.requestingUser?.externalId;

  const formSchema = z.object({
    finalReason: z
      .string()
      .min(3, { message: "O motivo deve conter no mínimo 3 caracteres" })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      finalReason: ""
    }
  });

  return (
    <FormProvider {...form}>
      <div className="relative max-w-content-container mx-auto">
        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8 mt-6 lg:h-auto mb-6">
          <div className="col-span-8 2xl:col-span-6 w-full">
            <div className="w-full">
              <p className="font-bold mb-3 text-lg md:text-xl">Status da solicitação:</p>
              <RequestStatus status={selected} finalReason={data?.finalReason} />
            </div>
          </div>

          <div className="col-span-5 lg:col-span-4 2xl:col-span-3 w-full">
            <div className="w-full">
              <CopyProtocol protocol={data?.protocolCode} />
            </div>
            <div className="mt-4">
              <p className="font-bold mb-3 text-lg md:text-xl">Data de envio:</p>
              <FlipCalendar initialDate={formattedDate} />
            </div>
          </div>

          <div className="col-span-5 lg:col-span-3 2xl:col-span-3 -mt-6 relative w-full hidden 2xl:block">
            <div>
              <Cracha data={data} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="w-full">
            <p className="font-bold mb-3 text-lg md:text-xl">Sistema:</p>
            <Card
              className="border-primary bg-[(--system-card)] p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] min-h-[160px]">
              <div className="flex flex-row items-center">
                <MonitorCog className="w-6 h-6 mr-4" />
                <p className="font-bold text-lg md:text-xl">
                  {data?.role?.client?.name}
                </p>
              </div>

              {isContentLoading ? (
                <div className="grid justify-center items-center">
                  <ShuffleLoader />
                </div>
              ) : (
                <div className="mt-2 h-auto">
                  <TruncatedText
                    text={data?.role?.client?.description}
                    maxChars={150}
                    fontSize="text-sm md:text-base"
                    autoManage={true}
                    maxLines={3}
                    className="h-auto"
                  />
                </div>
              )}
            </Card>
          </div>

          <div className="w-full">
            <p className="font-bold mb-3 text-lg md:text-xl">Esfera:</p>
            <Card
              className="bg-[(--system-card)] border-primary flex flex-col p-5 transition-all border rounded-[var(--card-border-radius)] min-h-[160px]">
              <div className="flex flex-row items-center">
                <Globe className="w-6 h-6 mr-4" />
                <p className="font-bold text-lg md:text-xl">
                  Educacional
                </p>
              </div>
              <div className="mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-base md:text-lg font-medium hover:bg-primary/10 hover:text-primary transition-colors rounded px-2 py-1 cursor-pointer">
                    Brasil
                  </span>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <span
                    className="text-base md:text-lg font-medium hover:bg-primary/10 hover:text-primary transition-colors rounded px-2 py-1 cursor-pointer">
                    MG
                  </span>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <span
                    className="text-base md:text-lg font-medium hover:bg-primary/10 hover:text-primary transition-colors rounded px-2 py-1 cursor-pointer">
                    Belo Horizonte
                  </span>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <span
                    className="text-base md:text-lg font-medium hover:bg-primary/10 hover:text-primary transition-colors rounded px-2 py-1 cursor-pointer">
                    Educacional
                  </span>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-base md:text-lg font-medium bg-primary/5 text-primary rounded px-2 py-1">
                    UMMG
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
          <div className="w-full">
            <p className="font-bold mb-3 text-lg md:text-xl">Informações gerais:</p>
            <Card className="border-primary p-6 bg-[var(--system-card)] overflow-hidden">
              <div className="flex flex-col gap-5">
                <div className="flex items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="font-bold text-lg mr-2">Papel:</p>
                      <p className="capitalize text-base">{data?.role?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="font-bold text-lg mr-2">Solicitante:</p>
                      <p className="text-base">{data?.requestingUser?.firstName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex flex-col">
                    <div className="flex items-start">
                      <p className="font-bold text-lg mr-2 whitespace-nowrap">Motivo do acesso:</p>
                      <div className="w-full">
                        <TruncatedText
                          text={data?.description}
                          maxChars={150}
                          fontSize="text-base"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="w-full">
            {attachments && attachments.length > 0 && (
              <div>
                <p className="font-bold mb-3 text-lg md:text-xl">Anexos da solicitação:</p>
                <Card
                  className="border-primary bg-[var(--system-card)] p-5 transition-all border rounded-[var(--card-border-radius)]">
                  <AttachmentConfigurationPresentation
                    attachments={attachments}
                    direction="column"
                    onDownload={onDownload}
                    collapsible={true}
                  />
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-12 w-full">
            <div className="w-full mt-10">
              <hr className="mb-6" />
              {
                <motion.div
                  className="relative w-full"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                >
                  {canCancel && !isFinished && (
                    <div className="flex gap-x-2">
                      <Clock className="w-5 h-5 text-red-500 mt-1" />
                      <h2 className="text-lg md:text-xl mb-6">
                        Essa solicitação aguarda definição.
                      </h2>
                    </div>
                  )}
                  <div className="w-full flex gap-4 pb-8">
                    {canCancel && origin === "created" && (
                      <Button
                        className="w-40 bg-red-200 text-red-800 hover:bg-red-800 hover:text-red-200"
                        onClick={() => {
                          setModalAction("CANCELED");
                          setIsModalOpen(true);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    {(!isFinished && origin === "assigned" && data?.status !== "CANCELED") && (
                      <>
                        <Button
                          className="w-40 bg-red-200 text-red-800 hover:bg-red-400 hover:text-white"
                          onClick={() => {
                            setModalAction("REJECTED");
                            setIsModalOpen(true);
                          }}
                        >
                          Rejeitar
                        </Button>
                        <Button
                          className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200"
                          onClick={() => {
                            setModalAction("APPROVED");
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
          onConfirm={modalAction === "APPROVED" ? () => onSubmit({}) : form.handleSubmit(onSubmit)}
          title={`${modalAction === "CANCELED" ? "Cancelar" : modalAction === "REJECTED" ? "Rejeitar" : "Aprovar"} Solicitação`}
          action={modalAction === "CANCELED" ? "cancelamento" : modalAction === "REJECTED" ? "rejeição" : "aprovação"}
          form={form}
        />
      </div>
    </FormProvider>
  );
};
