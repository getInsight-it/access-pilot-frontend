import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { Heading } from "../../../../common/components/header/heading.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import useAuthStore from "../../../../store/authStore.ts";
import { useEffect, useState } from "react";
import { requestService } from "../../common/api/request-service.ts";
import { useToast } from "../../../../components/ui/use-toast.ts";
import {
  FileAttachment
} from "../../../../common/components/AttachmentConfiguration/AttachmentConfigurationPresentation";
import { downloadFile } from "../../../storage/common/api/storage-service.ts";
import RequestStatus from "./partials/RequestStatus.tsx";
import RequestSystemDescription from "./partials/RequestSystemDescription.tsx";
import RequestSphere from "./partials/RequestSphere.tsx";
import RequestGeneralInformation from "./partials/RequestGeneralInformation.tsx";
import RequestAttachmentFiles from "./partials/RequestAttachmentFiles.tsx";
import { OPTIONS } from "../../../../components/request-detail/options.tsx";
import { format } from "date-fns";
import { RequestAttachmentInterface } from "../../common/types/request-attachment.model.ts";
import { RequestInterface } from "../../common/types/request.model.ts";
import { levelService } from "../../../level/common/api/level-service.ts";
import { ItemHierarchyInterface } from "../../../level/common/types/item-hierarchy.model.ts";
import HighlightLoader from "../../../../components/highlightloader/HighLightLoader.tsx";
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx";

type RequestStatusType = "CANCELED" | "REJECTED" | "APPROVED";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Minhas solicitações", link: "/dashboard/access-requests" },
  { title: "Detalhe da solicitação", link: "/dashboard/request-access" }
];

export default function RequestDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [request, setRequest] = useState<RequestInterface>();
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const selected: any = OPTIONS.filter((o) => o.value === request?.status).map((o) => o.value)[0];
  const userInfo = useAuthStore((state) => state.user);
  const [itemHierarchy, setItemHierarchy] = useState<ItemHierarchyInterface[]>([]);

  const generatePresentationAttachments = (requestAttachments: RequestAttachmentInterface[]) => {
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

    const presentationAttahcments: FileAttachment[] = [];
    attachmentsByConfig.forEach((files, key) => {
      presentationAttahcments.push({
        key,
        files,
        fileName: requestAttachments.find(a => a.configuration.key === key)?.configuration.description || key
      });
    });

    return presentationAttahcments;
  };

  const getData = async () => {
    if(!id) return;

    setLoading(true);

    try {
      const requestPromise = requestService.findRequestById(id);
      const attachmentsPromise = requestService.getClientAttachments(Number(id));
      const [request, requestAttachments] = await Promise.all([requestPromise, attachmentsPromise]);
      const hierarchy = await levelService.getItemHierarchy(request.level.id, request.codeItem);
      const presentationAttachments = generatePresentationAttachments(requestAttachments);

      setRequest(request);
      setItemHierarchy(hierarchy);
      setAttachments(presentationAttachments);
    } catch (error: any) {
      console.error("Erro ao buscar detalhes da solicitação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da solicitação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: any) => {
    try {
      const response = await downloadFile(file.id);
      const url = window.URL.createObjectURL(response.data as Blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = response.headers["content-disposition"]?.match(/filename="(.+)"/)?.[1] || file.originalFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download do arquivo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer o download do arquivo",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (
    params: { status: RequestStatusType; description?: string; finalReason?: string },
    successMessage: string,
    errorMessage: string
  ) => {
    if(!id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("request", JSON.stringify(params));

      await requestService.updateRequest(Number(id), formData);

      toast({ title: "Sucesso!", description: successMessage });

      getData();
    } catch (error) {
      console.error(`Erro ao ${errorMessage.toLowerCase()}:`, error);
      toast({ title: "Erro!", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (finalReason: string) => {
    await handleUpdateStatus(
      { status: "CANCELED", description: request?.description, finalReason },
      "Solicitação cancelada com sucesso.",
      "Erro ao cancelar solicitação."
    );
  };

  const handleReject = async (description: string, finalReason: string) => {
    await handleUpdateStatus(
      { status: "REJECTED", description, finalReason },
      "Solicitação rejeitada com sucesso.",
      "Erro ao rejeitar solicitação."
    );
  };

  const handleApprove = async (description: string) => {
    await handleUpdateStatus(
      { status: "APPROVED", description },
      "Solicitação aprovada com sucesso.",
      "Erro ao aprovar solicitação."
    );
  };

  useEffect(() => {
    if(isAuthenticated && id) getData();
  }, [isAuthenticated, id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
      className="flex-1 flex flex-col space-y-4 p-4 pt-6 md:p-8">

      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={`Detalhe da solicitação`} description="Gerenciar solicitações de acesso." />
      </div>

      <Separator />

      <ScrollArea className="flex-1 h-full relative">
        <div className="h-full flex items-center justify-center">
          {loading || !request || !attachments || !itemHierarchy
            ? <div className="flex items-center justify-center min-h-[60vh]">
              <HighlightLoader />
            </div>
            : <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
              className="relative max-w-content-container mx-auto">
              <RequestStatus
                status={selected}
                protocolCode={request.protocolCode}
                formattedDate={format(new Date(request.criacao), "dd/MM/yyyy")}
                finalReason={request.finalReason}
                data={request}
                canCancel={["CREATED", "PENDING"].includes(request.status) && userInfo?.id === request.requestingUser?.externalId}
                onCancel={handleCancel}
                onReject={handleReject}
                onApprove={handleApprove}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RequestSystemDescription
                  clientName={request.role?.client?.name}
                  clientDescription={request.role?.client?.description}
                  isContentLoading={false}
                />

                <RequestSphere itemHierarchy={itemHierarchy} />
              </div>

              <div className="flex flex-col gap-8 mt-10">
                <RequestGeneralInformation
                  roleName={request.role?.name}
                  requestingUserName={request?.requestingUser?.firstName}
                  description={request.description}
                />

                <RequestAttachmentFiles
                  attachments={attachments}
                  onDownload={handleDownload}
                />
              </div>
            </motion.div>
          }
        </div>
      </ScrollArea>
    </motion.div>
  );
}
