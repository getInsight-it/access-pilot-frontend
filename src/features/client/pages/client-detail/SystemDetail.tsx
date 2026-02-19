import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catchError, from, tap } from "rxjs";
import { Breadcrumbs } from "@components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "@components/heading.tsx";
import { ScrollArea } from "@ui/scroll-area.tsx";
import { Separator } from "@ui/separator.tsx";
import { motion } from "framer-motion";
import { toast } from "@ui/use-toast.ts";
import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { ClientRoleDetails } from "./partials/ClientRoleDetails.tsx";
import { ClientDetailDescription } from "./partials/ClientDetailDescription.tsx";
import { ClientDetailGeneralInformation } from "./partials/ClientDetailGeneralInformation.tsx";
import { ClientDetailConfigurations } from "./partials/ClientDetailConfigurations.tsx";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { DetailContainer } from "@components/DetailContainer.tsx";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { clientService } from "@features/client/common/service/client-service.ts";
import { roleService } from "@features/role/common/service/role-service.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";

const breadcrumbItems = [
  { title: "Gerenciar sistemas", link: PRIVATE_ROUTES.SYSTEMS },
  { title: "Detalhe do sistema", link: PRIVATE_ROUTES.SYSTEMS }
];

export const SystemDetail = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ClientResponseInterface>();
  const [roleItems, setRoleItems] = useState<RoleResponseInterface[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const getData = async () => {
    if(!clientId) return;
    from(clientService.fetchByClientId(clientId)).pipe(
      tap((response) => {
        if(response) {
          setData(response);
        }
      }),
      catchError((error: unknown) => {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: "Erro ao buscar dados do sistema",
          description: errorMessage,
          variant: "destructive"
        });
        return [];
      }
    )).subscribe();
  };

  const getRoles = async () => {
    if(!clientId) return;

    try {
      const response = await roleService.getRolesByClientIdV2(clientId);
      if(response instanceof HttpRequestResponse) {
        const rolesData = response.data as RoleResponseInterface[];
        setRoleItems(rolesData);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar papéis",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    getData();
    getRoles();
  }, [clientId]);

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

  const navigateToClientRoles = () => {
    if(clientId) {
      savePreviousRoute(PRIVATE_ROUTES.SYSTEMS);
      navigate(PRIVATE_ROUTES.ROLES.replace(":clientId", clientId));
    }
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
              code={data?.id}
            />
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <ScrollArea className="flex-grow bg-background">
        {data && (
          <div className="max-w-content-container m-auto flex flex-col h-full">
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
              grow={true}
              titleContent={
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Papéis do sistema</span>
                  {data?.managed && (
                    <span className="text-xs font-normal">
                      Papéis relacionados a este sistema. <span onClick={() => { navigateToClientRoles(); }} className="underline text-primary-600 cursor-pointer">Clique aqui</span> para gerenciar os papeis deste sistema.
                    </span>
                  )}
                </div>
              }>
              <ClientRoleDetails roles={roleItems} isManaged={data?.managed} />
            </DetailContainer>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};
