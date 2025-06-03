import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { catchError, finalize, from, tap } from "rxjs";
import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "../../../../common/components/header/heading.tsx";
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import { motion } from "framer-motion";
import { toast } from "../../../../components/ui/use-toast.ts";
import { clientService } from "../../common/service/client-service.ts";
import { ClientResponseInterface } from "../../common/model/client.model.ts";
import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { RoleResponseInterface } from "../../../role/common/types/role.model.ts";
import { roleService } from "../../../role/common/service/role-service.ts";
import { ClientRoleDetails } from "./partials/ClientRoleDetails.tsx";
import { ClientDetailDescription } from "./partials/ClientDetailDescription.tsx";
import { ClientDetailGeneralInformation } from "./partials/ClientDetailGeneralInformation.tsx";
import { ClientDetailConfigurations } from "./partials/ClientDetailConfigurations.tsx";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { ClientStatusEnum } from "../../common/enum/client-status.enum.ts";

const breadcrumbItems = [
  { title: "Gerenciar sistemas", link: "/dashboard/systems" },
  { title: "Detalhe do sistema", link: "/dashboard/systems" }
];

export const SystemDetail = () => {
  const { clientId } = useParams();
  const [data, setData] = useState<ClientResponseInterface>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [roleItems, setRoleItems] = useState<RoleResponseInterface[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const getData = async () => {
    if(!clientId) return;
    from(clientService.fetchByClientId(clientId)).pipe(
      tap((response) => {
        if(response) {
          setData(response);
        }
      }), catchError((error) => {
          console.error(error);
          return [];
        }
      )).subscribe();
  };

  const getRoles = async () => {
    if(!clientId) return;
    setLoading(true);

    try {
      const response = await roleService.getRolesByClientIdV2(clientId);
      if(response instanceof HttpRequestResponse) {
        const rolesData = JSON.parse(response.data) as RoleResponseInterface[];
        setRoleItems(rolesData);
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar papéis",
        description: "Não foi possível carregar os papéis do sistema",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getRoles();
  }, [clientId]);

  const handleSync = (clientId: string) => {
    setLoading(true);
    from(clientService.syncClient(clientId)).pipe(
      tap(() => {
        toast({
          title: "Sistema sincronizado",
          description: "O sistema foi sincronizado com sucesso"
        });
      }),
      catchError((error) => {
        toast({
          title: "Erro ao sincronizar sistema",
          description: "O sistema não foi sincronizado",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  const handlePublish = (clientId?: number) => {
    setLoading(true);
    from(clientService.updateSystemPublication(clientId)).pipe(
      tap((response) => {
        if(response) {
          toast({
            title: "Sistema publicado",
            description: "O sistema foi publicado com sucesso"
          });
        }
      }),
      catchError((error) => {
        toast({
          title: "Erro ao publicar sistema",
          description: "O sistema não foi publicado",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  const handlePublicationChange = async (client: ClientResponseInterface) => {
    const newStatus = client.status === ClientStatusEnum.PUBLISHED ? ClientStatusEnum.UNPUBLISHED : ClientStatusEnum.PUBLISHED;
    const toastMessage = client.status === ClientStatusEnum.PUBLISHED ? "publicado" : "despublicado";

    try {
      await clientService.updateSystemPublication(client.id!, newStatus);
      toast({
        title: "Sistema publicado",
        description: `O sistema foi ${toastMessage} com sucesso!`
      });
    } catch (error: any) {
      console.error("Erro ao sincronizar sistema:", error);
      toast({
        title: "Erro",
        description: `Não foi ${toastMessage} o sistema.`,
        variant: "destructive"
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if(!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const toggleExpand = (key: string) => {
    setExpandedDescriptions(prev => {
      const next = new Set(prev);
      if(next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const location = useLocation();

  const handleEdit = (clientId: string) => {
    savePreviousRoute(location.pathname + location.search);
    navigate(`/dashboard/systems/${clientId}/edit`);
  };

  const handleManageRoles = (clientId: string) => {
    savePreviousRoute(location.pathname + location.search);
    navigate(`/dashboard/systems/${clientId}/roles`);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <div className="flex-none">
        <HeaderContainer>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="pl-1 flex items-start justify-between">
            <Heading
              title="Detalhes do sistema"
              description="Sumário de informações do sistema cadastrado."
              returnButton={true}
              onReturnClick={() => navigate(PRIVATE_ROUTES.SYSTEMS)}
            />
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <ScrollArea className="flex-grow bg-white">
        {data && (
          <div className="max-w-content-container m-auto">
            <DetailContainer
              background={"highlight"}
              border={true}
              titleContent={
                <span className="text-sm font-semibold">Sistema</span>
              }>
              <ClientDetailDescription
                clientId={data.clientId}
                description={data.description}
                isExpanded={expandedDescriptions.has("description")}
                onToggleExpand={() => toggleExpand("description")}
              />
            </DetailContainer>

            <DetailContainer
              titleContent={
                <span className="text-sm font-semibold">Informações gerais</span>
              }>
              <ClientDetailGeneralInformation client={data} />
            </DetailContainer>

            <DetailContainer
              background={"highlight"}
              border={true}
              titleContent={
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Anexos do sistema</span>
                  <span className="text-xs font-normal">Anexos que serão solicitados no momento da criação de uma solicitação de acesso.</span>
                </div>
              }>
              <ClientDetailConfigurations
                configurations={data.configurations || []}
                truncateText={truncateText}
              />
            </DetailContainer>

            <DetailContainer
              titleContent={
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Papéis do sistema</span>
                  <span className="text-xs font-normal">
                    Papeis relacionados a este sistema. <span className="underline text-primary-600 cursor-pointer">Clique aqui</span> para gerenciar os papeis deste sistema.
                  </span>
                </div>
              }>
              <ClientRoleDetails roles={roleItems} />
            </DetailContainer>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};


const DetailContainer = ({
  children,
  titleContent,
  background,
  border,
  description
}: {
  children: React.ReactNode;
  titleContent?: React.ReactNode;
  background?: "highlight" | "default";
  border?: boolean;
  description?: string;
}) => {
  const getBgClass = () => {
    if(background === "highlight") return "bg-gray-50 dark:bg-gray-800";

    return "bg-white dark:bg-gray-900";
  };

  const borderClass = border ? "border-t border-b border-gray-200 dark:border-gray-700" : "";

  return (
    <div className={`p-6 ${getBgClass()} ${borderClass}`}>
      <div className="flex flex-col xl:flex-row gap-8">
        {titleContent && (
          <div className="w-full xl:w-[300px] xl:min-w-[300px] xl:max-w-[300px] text-gray-900 dark:text-gray-100">
            {titleContent}
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
          </div>
        )}

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
