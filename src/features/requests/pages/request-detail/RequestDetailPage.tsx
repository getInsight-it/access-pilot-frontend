import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { Heading } from "../../../../components/ui/heading.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import { motion } from "framer-motion";
import { useLocation, useParams } from "react-router-dom";
import useAuthStore from "../../../../store/authStore.ts";
import { useEffect, useState } from "react";
import { RequestModel } from "../../common/types/request.model.ts";
import { requestService } from "../../common/api/request-service.ts";
import { RequestDetails } from "./partials/RequestDetails.tsx";
import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { RequestAttachmentInterface } from "../../common/types/request-attachment.model.ts";
import { useToast } from "../../../../components/ui/use-toast.ts";
import { FileAttachment } from "../../../../common/components/AttachmentConfiguration/AttachmentConfigurationPresentation";
import axios from "axios";
import { STORAGE_API } from "../../../storage/common/api/storage-service.ts";
import { authService } from "../../../auth/common/AuthService.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Minhas solicitações", link: "/dashboard/access-requests" },
  { title: "Detalhe da solicitação", link: "/dashboard/request-access" }
];

export default function RequestDetailPage() {
  const location = useLocation();
  const { origin } = location.state || {};
  const { toast } = useToast();
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { id } = useParams();
  const [request, setRequest] = useState<RequestModel>();
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  const onUpdate = () => {
    getData();
  };

  const getData = async () => {
    if (!id) return;

    try {
      const response = await requestService.findRequestById(id);
      if (response) {
        setRequest(response);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da solicitação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da solicitação",
        variant: "destructive"
      });
    }
  };

  const getAttachments = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await requestService.getClientAttachments(Number(id));

      if (response instanceof HttpRequestResponse) {
        const attachmentsData = JSON.parse(response.data) as RequestAttachmentInterface[];
        const attachmentsByConfig = new Map<string, any[]>();

        attachmentsData.forEach(attachment => {
          const configKey = attachment.configuration.key;
          if (!attachmentsByConfig.has(configKey)) {
            attachmentsByConfig.set(configKey, []);
          }
          attachmentsByConfig.get(configKey)?.push({
            ...attachment.file,
            name: attachment.file.originalFilename
          });
        });

        const formattedAttachments: FileAttachment[] = [];
        attachmentsByConfig.forEach((files, key) => {
          formattedAttachments.push({
            key,
            files,
            fileName: attachmentsData.find(a => a.configuration.key === key)?.configuration.description || key
          });
        });

        setAttachments(formattedAttachments);
      }
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anexos da solicitação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: any) => {
    try {
      const token = await authService.getBearerToken();
      const apiClient = axios.create({
        baseURL: window.env.API_URL,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        }
      });

      const response = await apiClient.get(`${STORAGE_API.DOWNLOAD}/${file.fileId}?registerDownload=true`, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json"
        }
      });

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

  const handleCancel = async (finalReason: string) => {
    if (!id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("request", JSON.stringify({
        status: "CANCELED",
        description: request?.description,
        finalReason
      }));

      await requestService.updateRequest(Number(id), formData);

      toast({
        title: "Sucesso!",
        description: "Solicitação cancelada com sucesso."
      });

      onUpdate();
    } catch (error) {
      console.error("Erro ao cancelar solicitação:", error);
      toast({
        title: "Erro!",
        description: "Erro ao cancelar solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (description: string, finalReason: string) => {
    if (!id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("request", JSON.stringify({
        status: "REJECTED",
        description,
        finalReason
      }));

      await requestService.updateRequest(Number(id), formData);

      toast({
        title: "Sucesso!",
        description: "Solicitação rejeitada com sucesso."
      });

      onUpdate();
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      toast({
        title: "Erro!",
        description: "Erro ao rejeitar solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (description: string) => {
    if (!id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("request", JSON.stringify({
        status: "APPROVED",
        description
      }));

      await requestService.updateRequest(Number(id), formData);

      toast({
        title: "Sucesso!",
        description: "Solicitação aprovada com sucesso."
      });

      onUpdate();
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
      toast({
        title: "Erro!",
        description: "Erro ao aprovar solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      getData();
      getAttachments();
    }
  }, [isAuthenticated, id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
      }}
      className="flex-1 space-y-4 p-4 pt-6 md:p-8">

      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={`Detalhe da solicitação`} description="Gerenciar solicitações de acesso." />
      </div>

      <Separator className="" />

      <RequestDetails
        data={request}
        origin={origin}
        attachments={attachments}
        loading={loading}
        onDownload={handleDownload}
        onCancel={handleCancel}
        onReject={handleReject}
        onApprove={handleApprove}
      />
    </motion.div>
  );
}
