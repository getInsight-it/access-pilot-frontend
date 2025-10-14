import { useEffect, useState } from "react";
import { STATUS } from "../constant/status.ts";
import {
  Calendar,
  Check,
  Copy,
  FileCheck,
  FilePlus,
  FileSearch,
  FileText,
  FileX,
  HelpCircle,
  MessageSquare,
  User
} from "lucide-react";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { getPreviousRoute } from "../../../../../common/utils/NavigationStateManager.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../common/external/ui/tooltip.tsx";
import TruncatedText from "../../../../../common/components/TruncatedText.tsx";

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
  roleName?: string;
  requestingUserName?: string;
  requestDescription?: string;
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
  canCancel,
  onCancel,
  onReject,
  onApprove,
  description,
  roleName,
  requestingUserName,
  requestDescription
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

  const previousRouteState = getPreviousRoute();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Card - Full width */}
      <div
        className="col-span-1 md:col-span-2 flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
        <div className="flex-shrink-0 mr-4">
          <div className={`p-3 rounded-full ${config.bgColor}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
            Status
          </p>
          <div className="mt-1">
            <span className={`text-sm font-normal ${config.color}`}>
              {statusItem?.title || "Desconhecido"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex mb-2 items-center">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Progresso: {progress}%
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${progress}%` }}
                className={`transition-all duration-500 ease-out ${config.bgColor}`}
              />
            </div>
          </div>

          {/* Status Messages */}
          {status === "REJECTED" && finalReason && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <strong>Motivo:</strong> {finalReason}
            </div>
          )}

          {status === "APPROVED" && (
            <div className="mt-3 text-sm text-green-600 dark:text-green-400">
              Tudo certo! 👍
            </div>
          )}

          {status === "CANCELED" && finalReason && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <strong>Motivo:</strong> {finalReason}
            </div>
          )}

          {status === "PENDING" && (
            <div className="mt-4">
              <FormProvider {...form}>
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                >
                  <div className="flex gap-2 flex-wrap">
                    {(canCancel && previousRouteState?.data === "created" && !isFinished) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-800 hover:bg-red-50"
                        onClick={() => {
                          setModalAction("CANCELED");
                          setIsModalOpen(true);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    {(!isFinished && status !== "CANCELED" && previousRouteState?.data === "assigned") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-800 hover:bg-red-50"
                          onClick={() => {
                            setModalAction("REJECTED");
                            setIsModalOpen(true);
                          }}
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
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
            </div>
          )}
        </div>
      </div>

      <div
        className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
        <div className="flex-shrink-0 mr-4">
          <FileText size={20} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex flex-col flex-grow">
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
            Protocolo
          </p>
          <div className="mt-1 flex items-center">
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 truncate mr-2">
              {protocolCode}
            </span>
            <CopyButton text={protocolCode} />
          </div>
        </div>
      </div>

      <div
        className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
        <div className="flex-shrink-0 mr-4">
          <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
            Data de envio
          </p>
          <div className="mt-1">
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {roleName && (
        <div
          className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <User size={20} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              Papel
            </p>
            <div className="mt-1">
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {roleName}
              </span>
            </div>
          </div>
        </div>
      )}

      {requestingUserName && (
        <div
          className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <User size={20} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              Solicitante
            </p>
            <div className="mt-1">
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {requestingUserName}
              </span>
            </div>
          </div>
        </div>
      )}

      {requestDescription && (
        <div
          className="col-span-1 md:col-span-2 flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
          <div className="flex-shrink-0 mr-4">
            <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex flex-col flex-grow">
            <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              Descrição da solicitação
            </p>
            <div className="mt-1">
              <TruncatedText
                text={requestDescription}
                className="text-sm font-normal text-gray-600 dark:text-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{isCopied ? "Copiado!" : "Copiar protocolo"}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RequestStatus;
