import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { motion } from "framer-motion";
import { Paperclip } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../../store/authStore.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { requestService } from "../../common/api/request-service.ts";
import { useToast } from "../../../../common/external/ui/use-toast.ts";
import {
  FileAttachment
} from "../../../../common/components/AttachmentConfigurationPresentation.tsx";
import { downloadFile } from "../../../storage/common/api/storage-service.ts";
import RequestStatus from "./partials/request-status/RequestStatus.tsx";
import RequestSystemDescription from "./partials/request-system-description/RequestSystemDescription.tsx";
import RequestSphere from "./partials/request-sphere/RequestSphere.tsx";
import { format } from "date-fns";
import { RequestAttachmentInterface } from "../../common/types/request-attachment.model.ts";
import { RequestInterface } from "../../common/types/request.model.ts";
import { levelService } from "../../../level/common/api/level-service.ts";
import { ItemHierarchyInterface } from "../../../level/common/types/item-hierarchy.model.ts";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import AttachmentConfigurationPresentation
  from "../../../../common/components/AttachmentConfigurationPresentation.tsx";
import { getPreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "../../../../common/constants/animation.ts";
import { ContentLoader } from "../../../../common/components/ContentLoader.tsx";
import { STATUS } from "./constant/status.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";
import "./RequestDetailPage.scss";

type RequestStatusType = "CANCELED" | "REJECTED" | "REVOKED" | "APPROVED";

interface RequestStatusParams {
  status: RequestStatusType;
  description?: string;
  finalReason?: string;
  revocationReason?: string;
}

const useRequestData = (requestId: string | undefined, navigate: ReturnType<typeof useNavigate>) => {
  const [request, setRequest] = useState<RequestInterface>();
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [itemHierarchy, setItemHierarchy] = useState<ItemHierarchyInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generatePresentationAttachments = useCallback((requestAttachments: RequestAttachmentInterface[]): FileAttachment[] => {
    const attachmentsByConfig = new Map<string, any[]>();

    requestAttachments.forEach((attachment) => {
      const configKey = attachment.configuration.key;
      if(!attachmentsByConfig.has(configKey)) {
        attachmentsByConfig.set(configKey, []);
      }
      attachmentsByConfig.get(configKey)?.push({
        ...attachment.file,
        name: attachment.file.originalFilename
      });
    });

    const presentationAttachments: FileAttachment[] = [];
    attachmentsByConfig.forEach((files, key) => {
      presentationAttachments.push({
        key,
        files,
        fileName: requestAttachments.find((attachment) => attachment.configuration.key === key)?.configuration.description || key
      });
    });

    return presentationAttachments;
  }, []);

  const fetchRequestData = useCallback(async (): Promise<void> => {
    if(!requestId) return;

    setLoading(true);
    try {
      const [request, requestAttachments] = await Promise.all([
        requestService.findRequestById(requestId),
        requestService.getClientAttachments(Number(requestId))
      ]);

      let hierarchy: ItemHierarchyInterface[] = [];
      if(request.level?.id && request.codeItem) {
        try {
          hierarchy = await levelService.getItemHierarchy(request.level.id, request.codeItem);
        } catch (error: unknown) {
          console.error("Erro ao buscar hierarquia de itens:", error);
        }
      }

      const presentationAttachments = generatePresentationAttachments(requestAttachments);

      setRequest(request);
      setItemHierarchy(hierarchy);
      setAttachments(presentationAttachments);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar detalhes da solicitação",
        description: errorMessage,
        variant: "destructive"
      });

      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [requestId, generatePresentationAttachments, toast, navigate]);

  const updateRequestStatus = useCallback(async (
    params: RequestStatusParams,
    successMessage: string,
    errorMessage: string
  ): Promise<void> => {
    if(!requestId) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("request", JSON.stringify(params));

      await requestService.updateRequest(Number(requestId), formData);

      toast({ title: "Sucesso!", description: successMessage });
      await fetchRequestData();
    } catch (error: unknown) {
      const formattedErrorMessage: string = formatErrorMessages(error);
      toast({
        title: errorMessage,
        description: formattedErrorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [requestId, fetchRequestData, toast]);

  const handleCancel = useCallback(async (finalReason: string): Promise<void> => {
    await updateRequestStatus(
      { status: "CANCELED", description: request?.description, finalReason },
      "Solicitação cancelada com sucesso.",
      "Erro ao cancelar solicitação."
    );
  }, [updateRequestStatus, request?.description]);

  const handleReject = useCallback(async (description: string, finalReason: string): Promise<void> => {
    await updateRequestStatus(
      { status: "REJECTED", description, finalReason },
      "Solicitação rejeitada com sucesso.",
      "Erro ao rejeitar solicitação."
    );
  }, [updateRequestStatus]);

  const handleRevoke = useCallback(async (finalReason: string): Promise<void> => {
    await updateRequestStatus(
      { status: "REVOKED", description: request?.description, revocationReason: finalReason },
      "Solicitação revogada com sucesso.",
      "Erro ao revogar solicitação."
    );
  }, [updateRequestStatus, request?.description]);

  const handleApprove = useCallback(async (description: string): Promise<void> => {
    await updateRequestStatus(
      { status: "APPROVED", description },
      "Solicitação aprovada com sucesso.",
      "Erro ao aprovar solicitação."
    );
  }, [updateRequestStatus]);

  const handleDownload = useCallback(async (file: any): Promise<void> => {
    try {
      const response = await downloadFile(file.id);
      const url = window.URL.createObjectURL(response.data as Blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = response.headers["content-disposition"]?.match(/filename="(.+)"/)?.[1] || file.originalFilename;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao fazer download do arquivo",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    request,
    attachments,
    itemHierarchy,
    loading,
    fetchRequestData,
    handleCancel,
    handleReject,
    handleRevoke,
    handleApprove,
    handleDownload
  };
};

const useRequestNavigation = () => {
  const navigate = useNavigate();

  const handleReturnClick = useCallback((): void => {
    navigate(-1);
  }, [navigate]);

  return { handleReturnClick, navigate };
};

const useRequestDerivedData = (request: RequestInterface | undefined) => {
  const userInfo = useAuthStore((state) => state.user);
  const requestType = getPreviousRoute()?.data;

  const selectedStatus = useMemo(() => {
    return STATUS.filter((option) => option.value === request?.status).map((option) => option.value)[0];
  }, [request?.status]);

  const formattedDate = useMemo(() => {
    return request ? format(new Date(request.criacao), "dd/MM/yyyy") : "";
  }, [request]);

  const canCancel = useMemo(() => {
    return ["CREATED", "PENDING"].includes(request?.status || "") &&
      userInfo?.id === request?.requestingUser?.externalId;
  }, [request?.status, request?.requestingUser?.externalId, userInfo?.id]);

  return {
    selectedStatus,
    formattedDate,
    canCancel,
    requestType
  };
};

export default function RequestDetailPage() {
  const { id } = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { handleReturnClick, navigate } = useRequestNavigation();

  const {
    request,
    attachments,
    itemHierarchy,
    loading,
    fetchRequestData,
    handleCancel,
    handleReject,
    handleRevoke,
    handleApprove,
    handleDownload
  } = useRequestData(id, navigate);

  const {
    selectedStatus,
    formattedDate,
    canCancel
  } = useRequestDerivedData(request);

  useEffect(() => {
    if(isAuthenticated && id) {
      fetchRequestData();
    }
  }, [isAuthenticated, id, fetchRequestData]);

  const isDataLoading = loading || !request || !attachments || !itemHierarchy;

  return (
    <motion.div
      className="request-detail-page"
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}
    >
      <div>
        <HeaderContainer className="request-detail-page__header-container">
          <div className="request-detail-page__header">
            <Heading
              className="request-detail-page__heading"
              title="Detalhes da solicitação"
              description="Gerenciar solicitações de acesso para sistemas."
              returnButton={true}
              onReturnClick={handleReturnClick}
            />
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="request-detail-page__scroll-area" viewportClassName="request-detail-page__scroll-viewport">
        {isDataLoading ? (
          <ContentLoader />
        ) : (
          <div className="max-w-content-container request-detail-page__content">
            <section className="request-detail-page__section">
              <RequestStatus
                status={selectedStatus}
                protocolCode={request.protocolCode}
                formattedDate={formattedDate}
                finalReason={request.finalReason}
                revocationReason={request.revocationReason}
                data={request}
                canCancel={canCancel}
                onCancel={handleCancel}
                onReject={handleReject}
                onRevoke={handleRevoke}
                onApprove={handleApprove}
                roleName={request.role?.name}
                requestingUserName={request?.requestingUser?.firstName}
                requestDescription={request.description}
              />
            </section>

            <section className="request-detail-page__details-grid">
              <RequestSystemDescription
                clientName={request.role?.client?.name}
                clientDescription={request.role?.client?.description}
                isContentLoading={false}
              />
              <RequestSphere itemHierarchy={itemHierarchy} />
            </section>

            <section className="request-detail-page__section request-detail-page__attachments-section">
              <div className="request-detail-page__section-title-row">
                <Paperclip className="request-detail-page__section-icon" />
                <h3 className="request-detail-page__section-title">Anexos da solicitação</h3>
              </div>
              <p className="request-detail-page__section-description">
                Anexos enviados para esta solicitação de acesso.
              </p>
              <AttachmentConfigurationPresentation
                className="request-detail-page__attachments"
                attachments={attachments}
                direction="row"
                onDownload={handleDownload}
                collapsible={true}
              />
            </section>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
