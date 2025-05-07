import { useEffect, useState } from "react";
import { StepLoader } from "../../../components/steploader/StepLoader.tsx";

import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import { catchError, finalize, from, tap } from "rxjs";
import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { Heading } from "../../../components/ui/heading.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { Cog, FolderSync, MonitorIcon, MoreHorizontal, Pen, Settings, User } from "lucide-react";
import { CardShine } from "../../../components/CardShine.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import TrafficLight from "../../../components/TrafficLights.tsx";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu.tsx";

import { toast } from "../../../components/ui/use-toast.ts";
import { clientService } from "../common/service/client-service.ts";
import { ClientResponseInterface } from "../common/model/client.model.ts";
import { Card } from "../../../components/ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover.tsx";
import { AttachmentConfigurationInterface } from "../common/model/configuration.model.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Gerenciar sistemas", link: "/dashboard/systems" },
  { title: "Detalhe do sistema", link: "/dashboard/systems" }
];

export const SystemDetail = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { clientId } = useParams();
  const [data, setData] = useState<ClientResponseInterface>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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

  useEffect(() => {
    getData();
  }, [isAuthenticated, clientId]);

  function handleLoaderClose() {
    setLoading(false);
  }


  const handleSync = (clientId: string) => {
    setLoading(true);
    from(clientService.synchronousByClientId(clientId)).pipe(
      tap((response) => {
        toast({
          title: "Sistema sincronizado",
          description: "O sistema foi sincronizado com sucesso"
        });
        updateState?.(false);
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
          updateState?.(false);
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
          updateState?.(false);
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
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                  <p className="font-bold mb-3 text-lg">Sistema:</p>
                  <CardShine>
                    <div
                      className="ring-2 ring-primary p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)]">
                      <div className="flex flex-row items-center">
                        <MonitorIcon className="w-6 h-6 mr-4" />
                        <p className="font-bold text-lg">
                          {data?.clientId}
                        </p>
                      </div>
                      <p className="mt-1 text-sm">
                        {data?.description ? data?.description : "Sem função atribuída"}
                      </p>
                    </div>
                  </CardShine>
                </div>

                <div className="flex-1">
                  <p className="font-bold mb-3 text-lg">Informações gerais:</p>
                  <Card className="border-primary p-6 bg-[var(--system-card)]">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">Nome:</p>
                          <p className="break-words">{data?.name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">URL:</p>
                          <p className="break-words">{data?.baseUrl ? data?.baseUrl : "-"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">Gerenciado:</p>
                          <p>{data?.managed ? "Sim" : "Não"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">Status:</p>
                          <TrafficLight managed={data?.managed ?? false} published={data?.status === "PUBLISHED"} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">Ações:</p>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="bg-primary text-primary-foreground h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/systems/${data.clientId}/edit`)}>
                                <Pen className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              {data.managed && (
                                <DropdownMenuItem onClick={() => handleSync(data.clientId)}>
                                  <FolderSync className="mr-2 h-4 w-4" /> Sincronizar
                                </DropdownMenuItem>
                              )}
                              {data.status !== "PUBLISHED" && (
                                <DropdownMenuItem onClick={() => handlePublish(data.id)}>
                                  <Cog className="mr-2 h-4 w-4" /> Publicar
                                </DropdownMenuItem>
                              )}
                              {data.status === "PUBLISHED" && (
                                <DropdownMenuItem onClick={() => handleUnpublish(data.id)}>
                                  <Cog className="mr-2 h-4 w-4" /> Despublicar
                                </DropdownMenuItem>
                              )}
                              {data.managed && (
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/systems/${data.clientId}/roles`)}>
                                  <User className="mr-2 h-4 w-4" /> Gerenciar papéis
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {data.configurations && data.configurations.length > 0 && (
                <div>
                  <p className="font-bold mb-3 text-lg">Configurações de anexos:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.configurations.map((config: AttachmentConfigurationInterface) => (
                      <Card
                        key={config.key}
                        className="relative flex flex-col items-center justify-center p-3 bg-secondary">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="cursor-pointer gap-2 w-full h-full flex flex-col items-center justify-center p-3">
                              <Settings className="h-6 w-6 mt-1 text-gray-400" />
                              <span className="text-sm font-medium text-center line-clamp-1">
                                {truncateText(config.key, 15)}
                              </span>
                              <span className="text-xs text-center text-muted-foreground line-clamp-2">
                                {truncateText(config.description, 30)}
                              </span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Chave:</span> {config.key}
                              </div>
                              <div>
                                <span className="font-medium">Descrição:</span> {config.description}
                              </div>
                              <div>
                                <span className="font-medium">Obrigatório:</span> {config.required ? "Sim" : "Não"}
                              </div>
                              <div>
                                <span className="font-medium">Extensões:</span> {config.allowedExtensions.join(", ")}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <StepLoader loading={loading} onClose={handleLoaderClose} />

            <Button
              className=""
              onClick={() => navigate(-1)}
              variant="ghost">
              Voltar
            </Button>
          </div>
        )}
      </motion.div>
    </ScrollArea>
  );
};
