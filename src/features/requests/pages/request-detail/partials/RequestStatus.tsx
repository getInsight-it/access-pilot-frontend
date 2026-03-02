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
  revocationReason?: string;
  data?: any;
  canCancel?: boolean;
  onCancel: (finalReason: string) => void;
  onRevoke: (revocationReason: string) => void;
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
  "REVOKED": { icon: FileX, color: "text-gray-800", bgColor: "bg-gray-200", progress: 100 },
  "CANCELED": { icon: FileX, color: "text-gray-800", bgColor: "bg-gray-200", progress: 100 }
};

const RequestStatus = ({
  status,
  protocolCode,
  formattedDate,
  finalReason,
  revocationReason,
  canCancel,
  onCancel,
  onRevoke,
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
  const [modalAction, setModalAction] = useState<"CANCELED" | "REJECTED" | "APPROVED" | "REVOKED">("CANCELED");

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
    if (modalAction === "APPROVED") {
      onApprove(description || "");
    } else if (modalAction === "REJECTED") {
      onReject(description || "", formData.finalReason);
    } else if (modalAction === "REVOKED") {
      onRevoke(formData.finalReason);
    } else if (modalAction === "CANCELED") {
      onCancel(formData.finalReason);
    }
    setIsModalOpen(false);
  };

  const previousRouteState = getPreviousRoute();

  return (
    <div>
      {/* Status Card - Full width */}
      <div>
        <div>
          <div className={config.bgColor}>
            <Icon className={config.color} />
          </div>
        </div>
        <div>
          <p>
            Status
          </p>
          <div>
            <span className={config.color}>
              {statusItem?.title || "Desconhecido"}
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div>
              <span>
                Progresso: {progress}%
              </span>
            </div>
            <div>
              <div
                style={{ width: `${progress}%` }}
                className={config.bgColor}
              />
            </div>
          </div>

          {/* Status Messages */}
          {status === "REJECTED" && finalReason && (
            <div>
              <strong>Motivo:</strong> {finalReason}
            </div>
          )}

          {status === "APPROVED" && (
            <div>
              Tudo certo! 👍
            </div>
          )}

          {status === "REVOKED" && revocationReason && (
            <div>
              <strong>Motivo:</strong> {revocationReason}
            </div>
          )}

          {status === "CANCELED" && finalReason && (
            <div>
              <strong>Motivo:</strong> {finalReason}
            </div>
          )}

          {status === "APPROVED" && isFinished && (
            <div>
              <FormProvider {...form}>
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                >
                  <div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setModalAction("REVOKED");
                        setIsModalOpen(true);
                      }}
                    >
                      Revogar
                    </Button>
                  </div>
                  <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={modalAction === "APPROVED" ? () => onSubmit({}) : form.handleSubmit(onSubmit)}
                    title={`${modalAction === "CANCELED" ? "Cancelar" : modalAction === "REJECTED" ? "Rejeitar" : modalAction === "REVOKED" ? "Revogar" : "Aprovar"} Solicitação`}
                    action={modalAction === "CANCELED" ? "cancelamento" : modalAction === "REJECTED" ? "rejeição" : modalAction === "REVOKED" ? "revogação" : "aprovação"}
                    form={form}
                  />
                </motion.div>
              </FormProvider>
            </div>
          )}

          {status === "PENDING" && (
            <div>
              <FormProvider {...form}>
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                >
                  <div>
                    {(canCancel && previousRouteState?.data === "created" && !isFinished) && (
                      <Button
                        size="sm"
                        variant="outline"
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
                          onClick={() => {
                            setModalAction("REJECTED");
                            setIsModalOpen(true);
                          }}
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
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

      <div>
        <div>
          <FileText size={20} />
        </div>
        <div>
          <p>
            Protocolo
          </p>
          <div>
            <span>
              {protocolCode}
            </span>
            <CopyButton text={protocolCode} />
          </div>
        </div>
      </div>

      <div>
        <div>
          <Calendar size={20} />
        </div>
        <div>
          <p>
            Data de envio
          </p>
          <div>
            <span>
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {roleName && (
        <div>
          <div>
            <User size={20} />
          </div>
          <div>
            <p>
              Papel
            </p>
            <div>
              <span>
                {roleName}
              </span>
            </div>
          </div>
        </div>
      )}

      {requestingUserName && (
        <div>
          <div>
            <User size={20} />
          </div>
          <div>
            <p>
              Solicitante
            </p>
            <div>
              <span>
                {requestingUserName}
              </span>
            </div>
          </div>
        </div>
      )}

      {requestDescription && (
        <div>
          <div>
            <MessageSquare size={20} />
          </div>
          <div>
            <p>
              Descrição da solicitação
            </p>
            <div>
              <TruncatedText
                text={requestDescription}
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
          >
            {isCopied ? (
              <Check />
            ) : (
              <Copy />
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
