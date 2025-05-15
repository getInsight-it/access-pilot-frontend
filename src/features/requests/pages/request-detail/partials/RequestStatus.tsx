import { CopyProtocol } from "../../../../../common/components/CopyProtocol.tsx";
import { FlipCalendar } from "../../../../../common/components/Flipcalendar.tsx";
import { Cracha } from "../../../../../components/request-detail/Cracha.tsx";
import { Card, CardContent } from "../../../../../components/ui/card.tsx";
import { useEffect, useState } from "react";
import { STATUS } from "../../../../../components/request-detail/status.ts";
import { FileCheck, FilePlus, FileSearch, FileX, HelpCircle } from "lucide-react";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "../../../../../components/ui/button.tsx";
import { ConfirmationModal } from "../../../../../components/request-detail/ConfirmationModal.tsx";

interface RequestStatusContainerProps {
  status: any;
  protocolCode: string;
  formattedDate: string;
  finalReason?: string;
  data?: any;
  canCancel?: boolean;
  onCancel: (finalReason: string) => void;
  onReject: (description: string, finalReason: string) => void;
  onApprove: (description: string) => void;
  description?: string;
}

const statusConfig: any = {
  "CREATED": { icon: FilePlus, color: "text-blue-800", bgColor: "bg-blue-200", progress: 25 },
  "PENDING": { icon: FileSearch, color: "text-blue-800", bgColor: "bg-blue-200", progress: 50 },
  "APPROVED": { icon: FileCheck, color: "text-green-800", bgColor: "bg-green-200", progress: 100 },
  "REJECTED": { icon: FileX, color: "text-red-800", bgColor: "bg-red-200", progress: 100 },
  "CANCELED": { icon: FileX, color: "text-gray-800", bgColor: "bg-gray-200", progress: 100 }
};

const RequestStatus = ({
  status,
  protocolCode,
  formattedDate,
  finalReason,
  data,
  canCancel,
  onCancel,
  onReject,
  onApprove,
  description
}: RequestStatusContainerProps) => {
  const [progress, setProgress] = useState(0);
  const statusItem = STATUS.find(item => item.value === status);
  const defaultConfig = {
    icon: HelpCircle,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    progress: 0
  };
  const config = status && statusConfig[status] ? statusConfig[status] : defaultConfig;
  const Icon = config.icon;

  useEffect(() => {
    setProgress(0);
    const timer = setTimeout(() => {
      setProgress(config.progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [status, config.progress]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"CANCELED" | "REJECTED" | "APPROVED">("CANCELED");

  const isFinished = ["APPROVED", "REJECTED"].includes(status);
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

  const onSubmit = async (formData: any) => {
    if(modalAction === "APPROVED") {
      onApprove(description || "");
    } else if(modalAction === "REJECTED") {
      onReject(description || "", formData.finalReason);
    } else if(modalAction === "CANCELED") {
      onCancel(formData.finalReason);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-12 gap-8 mt-6 lg:h-auto mb-6">
      <div className="col-span-8 2xl:col-span-6 w-full">
        <div className="w-full">
          <p className="font-bold mb-3 text-lg md:text-xl">Status da solicitação:</p>
          <Card
            className="flex border-primary bg-[(--system-card)] w-full min-h-[256px] rounded-[var(--card-border-radius)] bg-white-300 z-50">
            <CardContent className="p-6 flex flex-col justify-between w-full">

              <div className="flex flex-col mb-2 gap-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <div className={`p-3 rounded-full block ${config.bgColor} mr-4`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>

                    <h2 className={`text-2xl font-semibold ${config.color}`}>{statusItem?.title || "Desconhecido"}</h2>
                  </div>

                  {status === "PENDING" && (
                    <div className={`rounded-full inline-block `}>
                      <h1 className={`px-0 text-sm text-gray-600 flex items-center`}>
                        <FormProvider {...form}>
                          <motion.div
                            className="relative"
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}>
                            <div className="flex gap-4">
                              {canCancel && (
                                <Button
                                  className="w-40 bg-red-200 text-red-800 hover:bg-red-800 hover:text-red-200"
                                  onClick={() => {
                                    setModalAction("CANCELED");
                                    setIsModalOpen(true);
                                  }}>
                                  Cancelar
                                </Button>
                              )}

                              {(!isFinished && status !== "CANCELED" && !canCancel) && (
                                <>
                                  <Button
                                    className="w-40 bg-red-200 text-red-800 hover:bg-red-400 hover:text-white"
                                    onClick={() => {
                                      setModalAction("REJECTED");
                                      setIsModalOpen(true);
                                    }}>
                                    Rejeitar
                                  </Button>
                                  <Button
                                    className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200"
                                    onClick={() => {
                                      setModalAction("APPROVED");
                                      setIsModalOpen(true);
                                    }}>
                                    Aprovar
                                  </Button>
                                </>
                              )}
                            </div>

                            <ConfirmationModal
                              isOpen={isModalOpen}
                              onClose={() => setIsModalOpen(false)}
                              onConfirm={modalAction === "APPROVED" ? () => onSubmit({}) : form.handleSubmit(onSubmit)}
                              title={`${modalAction === "CANCELED" ? "Cancelar" : modalAction === "REJECTED" ? "Rejeitar" : "Aprovar"} Solicitação`}
                              action={modalAction === "CANCELED" ? "cancelamento" : modalAction === "REJECTED" ? "rejeição" : "aprovação"}
                              form={form}
                            />
                          </motion.div>
                        </FormProvider>
                      </h1>
                    </div>
                  )}
                </div>

                <div className="flex flex-row items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                  <span>Em Análise</span>
                </div>
              </div>

              {status === "REJECTED" && (
                <div className={`rounded-full inline-block `}>
                  <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                    Motivo: {finalReason}
                  </h1>
                </div>
              )}

              {status === "APPROVED" && (
                <div className={`rounded-full inline-block `}>
                  <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                    Tudo certo!.
                    <span className="ml-2">👍</span>
                  </h1>
                </div>
              )}

              {status === "CANCELED" && (
                <div className={`rounded-full inline-block `}>
                  <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                    Motivo: {finalReason}
                  </h1>
                </div>
              )}

              <div className="relative">
                <div className="flex mb-2 items-center justify-between">
                  <span
                    className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                    Progresso
                  </span>

                  <span className="text-right text-xs font-semibold inline-block text-black">
                    {progress}%
                  </span>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out ${config.bgColor}`}>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-8 sm:col-span-8 md:col-span-8 lg:col-span-4 2xl:col-span-3 w-full min-h-3xs">
        <div className="w-full">
          <CopyProtocol protocol={protocolCode} />
        </div>
        <div className="mt-4">
          <p className="font-bold mb-3 text-lg md:text-xl">Data de envio:</p>
          <FlipCalendar initialDate={formattedDate} />
        </div>
      </div>

      <div className="col-span-5 lg:col-span-3 2xl:col-span-3 -mt-6 relative w-full hidden 2xl:block">
        <Cracha data={data} />
      </div>
    </div>
  );
};

export default RequestStatus;
