import { useEffect, useState } from "react";
import { STATUS } from "../../constant/status.ts";
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
  User,
  type LucideIcon
} from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ConfirmationModal } from "../confirmation-modal/ConfirmationModal.tsx";
import { getPreviousRoute } from "../../../../../../common/utils/NavigationStateManager.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../../common/external/ui/tooltip.tsx";
import TruncatedText from "../../../../../../common/components/TruncatedText.tsx";
import "./request-status.scss";

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

type StatusTone = "primary" | "success" | "danger" | "neutral";
type RequestAction = "CANCELED" | "REJECTED" | "APPROVED" | "REVOKED";

interface StatusConfig {
  icon: LucideIcon;
  tone: StatusTone;
  progress: number;
}

const statusConfig: Record<string, StatusConfig> = {
  CREATED: { icon: FilePlus, tone: "primary", progress: 25 },
  PENDING: { icon: FileSearch, tone: "primary", progress: 50 },
  APPROVED: { icon: FileCheck, tone: "success", progress: 100 },
  REJECTED: { icon: FileX, tone: "danger", progress: 100 },
  REVOKED: { icon: FileX, tone: "neutral", progress: 100 },
  CANCELED: { icon: FileX, tone: "neutral", progress: 100 }
};

const formSchema = z.object({
  finalReason: z
    .string()
    .min(3, { message: "O motivo deve conter no mínimo 3 caracteres" })
});

const getProgressModifier = (progress: number) => {
  if(progress >= 100) {
    return "request-status__progress-fill--100";
  }

  if(progress >= 50) {
    return "request-status__progress-fill--50";
  }

  if(progress >= 25) {
    return "request-status__progress-fill--25";
  }

  return "request-status__progress-fill--0";
};

const getModalTitle = (action: RequestAction) => {
  switch(action) {
    case "CANCELED": return "Cancelar Solicitação";
    case "REJECTED": return "Rejeitar Solicitação";
    case "REVOKED": return "Revogar Solicitação";
    default: return "Aprovar Solicitação";
  }
};

const getModalActionLabel = (action: RequestAction) => {
  switch(action) {
    case "CANCELED": return "cancelamento";
    case "REJECTED": return "rejeição";
    case "REVOKED": return "revogação";
    default: return "aprovação";
  }
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<RequestAction>("CANCELED");

  const statusItem = STATUS.find((item) => item.value === status);
  const defaultConfig: StatusConfig = {
    icon: HelpCircle,
    tone: "neutral",
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

  const isFinished = ["APPROVED", "REJECTED"].includes(status);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      finalReason: ""
    }
  });

  const openActionModal = (action: RequestAction) => {
    form.reset({ finalReason: "" });
    setModalAction(action);
    setIsModalOpen(true);
  };

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if(modalAction === "APPROVED") {
      onApprove(description || "");
    } else if(modalAction === "REJECTED") {
      onReject(description || "", formData.finalReason);
    } else if(modalAction === "REVOKED") {
      onRevoke(formData.finalReason);
    } else {
      onCancel(formData.finalReason);
    }

    setIsModalOpen(false);
  };

  const previousRouteState = getPreviousRoute();
  const isPending = status === "PENDING";
  const canUseCancelAction = Boolean(canCancel && previousRouteState?.data === "created" && !isFinished && isPending);
  const canUseApprovalActions = Boolean(!isFinished && status !== "CANCELED" && previousRouteState?.data === "assigned" && isPending);
  const canUseRevokeAction = status === "APPROVED" && isFinished;
  const hasActions = canUseRevokeAction || canUseCancelAction || canUseApprovalActions;

  return (
    <div className="request-status">
      <div className="request-status__status-card">
        <div className="request-status__status-header">
          <div className="request-status__status-main">
            <div className={`request-status__status-icon-box request-status__status-icon-box--${config.tone}`}>
              <Icon className="request-status__status-icon" />
            </div>
            <div className="request-status__status-title-row">
              <p className="request-status__status-label">Status da Solicitação</p>
              <span className={`request-status__status-chip request-status__status-chip--${config.tone}`}>
                {statusItem?.title || "Desconhecido"}
              </span>
            </div>
          </div>

          <div className="request-status__status-header-actions">
            {hasActions && (
              <motion.div
                className="request-status__actions"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
              >
                {canUseRevokeAction && (
                  <button
                    type="button"
                    className="ui-button ui-button--white request-status__action-button"
                    onClick={() => openActionModal("REVOKED")}
                  >
                    Revogar
                  </button>
                )}

                {canUseCancelAction && (
                  <button
                    type="button"
                    className="ui-button ui-button--white request-status__action-button"
                    onClick={() => openActionModal("CANCELED")}
                  >
                    Cancelar
                  </button>
                )}

                {canUseApprovalActions && (
                  <>
                    <button
                      type="button"
                      className="ui-button ui-button--white request-status__action-button"
                      onClick={() => openActionModal("REJECTED")}
                    >
                      Rejeitar
                    </button>
                    <button
                      type="button"
                      className="ui-button ui-button--primary theme-button--primary request-status__action-button request-status__action-button--primary"
                      onClick={() => openActionModal("APPROVED")}
                    >
                      Aprovar
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <div className="request-status__progress-section">
          <span className="request-status__progress-label">Progresso: {progress}%</span>
          <div className="request-status__progress-track">
            <div
              className={`request-status__progress-fill request-status__progress-fill--${config.tone} ${getProgressModifier(progress)}`}
            />
          </div>
        </div>

        {status === "REJECTED" && finalReason && (
          <div className="request-status__feedback request-status__feedback--danger">
            <strong>Motivo:</strong> {finalReason}
          </div>
        )}

        {status === "APPROVED" && (
          <div className="request-status__feedback request-status__feedback--success">
            Solicitação aprovada com sucesso.
          </div>
        )}

        {status === "REVOKED" && revocationReason && (
          <div className="request-status__feedback request-status__feedback--neutral">
            <strong>Motivo:</strong> {revocationReason}
          </div>
        )}

        {status === "CANCELED" && finalReason && (
          <div className="request-status__feedback request-status__feedback--neutral">
            <strong>Motivo:</strong> {finalReason}
          </div>
        )}

      </div>

      <div className="request-status__info-grid">
        <div className="request-status__info-card">
          <div className="request-status__info-icon-box">
            <FileText className="request-status__info-icon" />
          </div>
          <div className="request-status__info-content">
            <p className="request-status__info-label">Protocolo</p>
            <div className="request-status__info-value-row">
              <span className="request-status__info-value">{protocolCode}</span>
              <CopyButton text={protocolCode} />
            </div>
          </div>
        </div>

        <div className="request-status__info-card">
          <div className="request-status__info-icon-box">
            <Calendar className="request-status__info-icon" />
          </div>
          <div className="request-status__info-content">
            <p className="request-status__info-label">Data de envio</p>
            <span className="request-status__info-value">{formattedDate}</span>
          </div>
        </div>

        {roleName && (
          <div className="request-status__info-card">
            <div className="request-status__info-icon-box">
              <User className="request-status__info-icon" />
            </div>
            <div className="request-status__info-content">
              <p className="request-status__info-label">Papel solicitado</p>
              <span className="request-status__tag">{roleName}</span>
            </div>
          </div>
        )}

        {requestingUserName && (
          <div className="request-status__info-card">
            <div className="request-status__info-icon-box">
              <User className="request-status__info-icon" />
            </div>
            <div className="request-status__info-content">
              <p className="request-status__info-label">Solicitante</p>
              <span className="request-status__info-value">{requestingUserName}</span>
            </div>
          </div>
        )}
      </div>

      {requestDescription && (
        <div className="request-status__description-card">
          <div className="request-status__info-icon-box request-status__description-icon-box">
            <MessageSquare className="request-status__info-icon" />
          </div>
          <div className="request-status__info-content">
            <p className="request-status__info-label">Descrição da solicitação</p>
            <TruncatedText
              className="request-status__description"
              text={requestDescription}
              autoManage={true}
              maxLines={3}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction === "APPROVED" ? () => onSubmit({ finalReason: "" }) : form.handleSubmit(onSubmit)}
        title={getModalTitle(modalAction)}
        action={getModalActionLabel(modalAction)}
        form={form}
      />
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
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="request-status__copy-button"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="request-status__copy-icon" />
            ) : (
              <Copy className="request-status__copy-icon" />
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
