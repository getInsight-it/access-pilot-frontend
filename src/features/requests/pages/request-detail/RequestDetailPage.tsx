import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../../store/authStore.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { requestService } from "../../common/api/request-service.ts";
import { useToast } from "../../../../common/external/ui/use-toast.ts";
import {
  FileAttachment
} from "../../../../common/components/AttachmentConfigurationPresentation.tsx";
import { downloadFile } from "../../../storage/common/api/storage-service.ts";
import RequestStatus from "./partials/RequestStatus.tsx";
import RequestSystemDescription from "./partials/RequestSystemDescription.tsx";
import RequestSphere from "./partials/RequestSphere.tsx";
import { format } from "date-fns";
import { RequestAttachmentInterface } from "../../common/types/request-attachment.model.ts";
import { RequestInterface } from "../../common/types/request.model.ts";
import { levelService } from "../../../level/common/api/level-service.ts";
import { ItemHierarchyInterface } from "../../../level/common/types/item-hierarchy.model.ts";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import AttachmentConfigurationPresentation
  from "../../../../common/components/AttachmentConfigurationPresentation.tsx";
import { DetailContainer } from "../../../../common/components/DetailContainer.tsx";
import { getPreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "../../../../common/constants/animation.ts";
import { ContentLoader } from "../../../../common/components/ContentLoader.tsx";
import { STATUS } from "./constant/status.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";

type RequestStatusType = "CANCELED" | "REJECTED" | "APPROVED";

interface RequestStatusParams {
  status: RequestStatusType;
  description?: string;
  finalReason?: string;
}

const useRequestData = (requestId: string | undefined) => {
  const [request, setRequest] = useState<RequestInterface>();
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [itemHierarchy, setItemHierarchy] = useState<ItemHierarchyInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generatePresentationAttachments = useCallback((requestAttachments: RequestAttachmentInterface[]): FileAttachment[] => {
    const attachmentsByConfig = new Map<string, any[]>();

    requestAttachments.forEach(attachment => {
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
        fileName: requestAttachments.find(a => a.configuration.key === key)?.configuration.description || key
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
      if (request.level?.id && request.codeItem) {
        try {
          hierarchy = await levelService.getItemHierarchy(request.level.id, request.codeItem);
        } catch (error) {
          console.warn("Não foi possível carregar a hierarquia:", error);
        }
      }

      const presentationAttachments = generatePresentationAttachments(requestAttachments);

      setRequest(request);
      setItemHierarchy(hierarchy);
      setAttachments(presentationAttachments);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao buscar detalhes da solicitação",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [requestId, generatePresentationAttachments, toast]);

  const updateRequestStatus = useCallback(async (
    params: RequestStatusParams,
    successMessage: string,
    errorMessage: string
  ): Promise<void> => {
    if(!requestId) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("request", JSON.stringify(params));

      await requestService.updateRequest(Number(requestId), formData);

      toast({ title: "Sucesso!", description: successMessage });
      await fetchRequestData();
    } catch (error: any) {
      const formattedErrorMessage: string = formatErrorMessages(error.error);
      toast({ title: errorMessage, description: formattedErrorMessage, variant: "destructive" });
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
      const a = document.createElement("a");

      a.href = url;
      a.download = response.headers["content-disposition"]?.match(/filename="(.+)"/)?.[1] || file.originalFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
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
    handleApprove,
    handleDownload
  };
};

const useRequestNavigation = () => {
  const navigate = useNavigate();

  const handleReturnClick = useCallback((): void => {
    navigate(PRIVATE_ROUTES.MY_ACCESS_REQUESTS);
  }, [navigate]);

  return { handleReturnClick };
};

const useRequestDerivedData = (request: RequestInterface | undefined) => {
  const userInfo = useAuthStore((state) => state.user);
  const requestType = getPreviousRoute()?.data;

  const selectedStatus = useMemo(() => {
    return STATUS.filter((o) => o.value === request?.status).map((o) => o.value)[0];
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
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const {
    request,
    attachments,
    itemHierarchy,
    loading,
    fetchRequestData,
    handleCancel,
    handleReject,
    handleApprove,
    handleDownload
  } = useRequestData(id);

  const { handleReturnClick } = useRequestNavigation();

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
      className="flex flex-col h-full"
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>

      <div className="flex-none">
        <HeaderContainer>
          <div className="pl-1 flex items-start justify-between">
            <Heading
              title="Detalhes da solicitação"
              description="Gerenciar solicitações de acesso para sistemas."
              returnButton={true}
              onReturnClick={handleReturnClick}
            />
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="flex-grow bg-background">
        {isDataLoading ? (
          <ContentLoader />
        ) : (
          <div className="max-w-content-container m-auto flex flex-col h-full">
            <DetailContainer
              background="highlight"
              border={true}
              titleContent={
                <span className="text-sm font-semibold">Informações da solicitação</span>
              }>
              <RequestStatus
                status={selectedStatus}
                protocolCode={request.protocolCode}
                formattedDate={formattedDate}
                finalReason={request.finalReason}
                data={request}
                canCancel={canCancel}
                onCancel={handleCancel}
                onReject={handleReject}
                onApprove={handleApprove}
                roleName={request.role?.name}
                requestingUserName={request?.requestingUser?.firstName}
                requestDescription={request.description}
              />
            </DetailContainer>

            <DetailContainer
              titleContent={
                <span className="text-sm font-semibold">Sistema</span>
              }>
              <RequestSystemDescription
                clientName={request.role?.client?.name}
                clientDescription={request.role?.client?.description}
                isContentLoading={false}
              />
            </DetailContainer>

            <DetailContainer
              background="highlight"
              border={true}
              titleContent={
                <span className="text-sm font-semibold">Hierarquia</span>
              }>
              <RequestSphere itemHierarchy={itemHierarchy} />
            </DetailContainer>

            <DetailContainer
              grow={true}
              titleContent={
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Anexos da solicitação</span>
                  <span className="text-xs font-normal">Anexos enviados para esta solicitação de acesso.</span>
                </div>
              }>
              <AttachmentConfigurationPresentation
                attachments={attachments}
                direction="row"
                onDownload={handleDownload}
                collapsible={true}
              />
            </DetailContainer>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
