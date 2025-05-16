import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { catchError, finalize, from, tap } from "rxjs";
import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { Heading } from "../../../../components/ui/heading.tsx";
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button.tsx";
import { toast } from "../../../../components/ui/use-toast.ts";
import { clientService } from "../../common/service/client-service.ts";
import { ClientResponseInterface } from "../../common/model/client.model.ts";
import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { RoleResponseInterface } from "../../../role/common/types/role.model.ts";
import { roleService } from "../../../role/common/service/role-service.ts";
import { ClientRoleDetails } from "./partials/ClientRoleDetails.tsx";
import { ClientDetailActions } from "./partials/ClientDetailActions.tsx";
import { ClientDetailDescription } from "./partials/ClientDetailDescription.tsx";
import { ClientDetailGeneralInformation } from "./partials/ClientDetailGeneralInformation.tsx";
import { ClientDetailConfigurations } from "./partials/ClientDetailConfigurations.tsx";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
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
    from(clientService.synchronousByClientId(clientId)).pipe(
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
    from(clientService.publish(clientId)).pipe(
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

  const handleUnpublish = (clientId?: number) => {
    setLoading(true);
    from(clientService.unpublish(clientId)).pipe(
      tap((response) => {
        if(response) {
          toast({
            title: "Sistema despublicado",
            description: "O sistema foi despublicado com sucesso"
          });
        }
      }),
      catchError((error) => {
        toast({
          title: "Erro ao despublicar sistema",
          description: "O sistema não foi despublicado",
          variant: "destructive"
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
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
    <ScrollArea className="h-full ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8">

        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Detalhes do sistema" description="Gerenciar sistemas." />
        </div>

        <Separator className="" />

        {data && (
          <div className="">
            <div className="border-b pb-10 flex flex-col gap-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                  <ClientDetailDescription
                    clientId={data.clientId}
                    description={data.description}
                    isExpanded={expandedDescriptions.has("description")}
                    onToggleExpand={() => toggleExpand("description")}
                  />

                  <ClientDetailActions
                    client={data}
                    onEdit={handleEdit}
                    onSync={handleSync}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onManageRoles={handleManageRoles}
                  />
                </div>

                <ClientDetailGeneralInformation
                  client={data}
                  expandedFields={expandedDescriptions}
                  onToggleExpand={toggleExpand}
                />
              </div>

              <ClientDetailConfigurations
                configurations={data.configurations || []}
                truncateText={truncateText}
              />

              <ClientRoleDetails roles={roleItems} />
            </div>

            <Button
              className=""
              onClick={() => navigate(PRIVATE_ROUTES.SYSTEMS)}
              variant="ghost">
              Voltar
            </Button>
          </div>
        )}
      </motion.div>
    </ScrollArea>
  );
};
