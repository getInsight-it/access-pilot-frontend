import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../../common/external/ui/button.tsx";
import { Input } from "../../../../common/external/ui/input.tsx";
import { Label } from "../../../../common/external/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "../../../../common/external/ui/radio-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/external/ui/select.tsx";
import { Textarea } from "../../../../common/external/ui/textarea.tsx";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { Breadcrumbs } from "../../../../common/components/breadcrumbs.tsx";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { Info } from "lucide-react";
import useAuthStore from "../../../../store/authStore.ts";
import HighlightLoader from "../../../../common/components/loading/HighLightLoader.tsx";
import { motion } from "framer-motion";
import { levelService } from "../../common/api/level-service.ts";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";

interface SphereItem {
  id: string;
  name: string;
  description: string;
  type: "BUSINESS" | "EXTERNAL" | "BUILT_IN";
  parent?: {
    id: number
    name: string
  } | null;
  isBuiltIn?: boolean;
  endpoint?: string;
  apiKey?: string;
  externalUrl?: string;
  uuid?: string;
  icon?: string;
  sigla?: string;
}

const breadcrumbItems = [
  { title: "Gerenciar Esferas", link: "/dashboard/levels" },
  { title: "Criar esfera", link: "" }
];

export default function CreateOrEditLevel() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const [isEditing, setIsEditing] = useState(false);
  const [sphereId, setSphereId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"BUSINESS" | "EXTERNAL">("BUSINESS");
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasExistingApiKey, setHasExistingApiKey] = useState(false);
  const [parentId, setParentId] = useState<string | null>("0");
  const [originalParentId, setOriginalParentId] = useState<string | null>("0");
  const [allSpheres, setAllSpheres] = useState<SphereItem[]>([]);
  const [selectedSphereName, setSelectedSphereName] = useState<string>("Nenhuma (esfera pai)");
  const [loading, setLoading] = useState(true);
  const [sigla, setSigla] = useState("");
  const [uuid, setUuid] = useState("");
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    if(isAuthenticated) {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("id");

      fetchAllSpheres().then(() => {
        if(id) {
          setIsEditing(true);
          setSphereId(id);
          fetchSphereData(id);
        } else {
          setLoading(false);
        }
      });
    }
  }, [isAuthenticated, location]);

  const fetchSphereData = async (id: string) => {
    try {
      const data = await levelService.getLevelById(id);

      if(!data) {
        throw new Error("Falha ao buscar dados da esfera");
      }

      if(data.type === "BUILT_IN") {
        toast({
          title: "Error",
          description: "Built-in spheres cannot be edited",
          variant: "destructive"
        });
        navigate("/dashboard/levels");
        return;
      }

      setName(data.name);
      setSigla(data.sigla || "");
      setDescription(data.description || "");
      setType(data.type === "BUILT_IN" ? "BUSINESS" : data.type);

      let newParentId = "0";
      if(data.parent) {
        newParentId = data.parent.id.toString();
        console.log("Parent encontrado no objeto parent:", data.parent);
      } else if(data.parentId) {
        newParentId = data.parentId.toString();
        console.log("Parent encontrado na propriedade parentId:", data.parentId);
      } else {
        console.log("Nenhum parent encontrado no objeto");
      }

      setParentId(newParentId);
      setOriginalParentId(newParentId);
      console.log("Parent carregado e definido como:", newParentId);

      setUuid(data.uuid || "");

      if(data.type === "EXTERNAL") {
        console.log("Carregando dados de esfera externa:", data);
        console.log("API Key recebido da API:", data.apiKey);
        setEndpoint(data.externalUrl || "");

        const hasApiKey = true;
        setHasExistingApiKey(hasApiKey);

        if(hasApiKey) {
          setApiKey("••••••••••••••••");
        } else {
          setApiKey("");
        }
        console.log("API Key existente assumida:", hasApiKey);
        setHasItems(false);
      } else {
        setEndpoint("");
        setApiKey("");
        setHasExistingApiKey(false);

        await checkIfSphereHasItems(id);
      }

      setLoading(false);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);

      toast({
        title: "Erro ao buscar dados da esfera.",
        description: errorMessage,
        variant: "destructive"
      });

      navigate("/dashboard/levels");
    }
  };

  const checkIfSphereHasItems = async (sphereId: string) => {
    try {
      const itemsData = await levelService.getLevelItems(sphereId, 1, 1);

      if(itemsData && itemsData.items && itemsData.items.length > 0) {
        setHasItems(true);
        console.log(`Esfera ${sphereId} tem itens. Desabilitando campo de esfera pai.`);
      } else {
        setHasItems(false);
        console.log(`Esfera ${sphereId} não tem itens.`);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao verificar itens da esfera",
        description: errorMessage,
        variant: "destructive"
      });
      setHasItems(false);
    }
  };

  const fetchAllSpheres = async () => {
    try {
      const data = await levelService.getLevels(1, 100, "id", "ASC");
      if(!data) {
        throw new Error("Falhou ao carregar as esferas");
      }

      const processedData = data.items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || "",
        type: item.type as "BUSINESS" | "EXTERNAL" | "BUILT_IN",
        parent: item.parent
          ? {
            id: item.parent.id,
            name: item.parent.name
          }
          : null,
        isBuiltIn: item.type === "BUILT_IN",
        externalUrl: item.externalUrl,
        apiKey: item.apiKey,
        uuid: item.uuid.toString(),
        icon: item.icon,
        sigla: item.sigla
      }));

      setAllSpheres(processedData);
      return Promise.resolve();
    } catch (err: any) {
      const errorMessage: string = formatErrorMessages(err.error);
      toast({
        title: "Erro ao carregar esferas",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const hasChanges = () => {
    if(!sphereId) return true;
    const currentSphere = allSpheres.find((s) => s.id === sphereId);
    if(!currentSphere) return true;
    const apiKeyChanged = type === "EXTERNAL" && apiKey.trim() !== "";

    return (
      name !== currentSphere.name ||
      sigla !== currentSphere.sigla ||
      description !== currentSphere.description ||
      type !== currentSphere.type ||
      parentId !== (currentSphere.parent ? currentSphere.parent.id.toString() : "0") ||
      (type === "EXTERNAL" && (endpoint !== currentSphere.externalUrl || apiKeyChanged))
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if(!isEditing || hasChanges()) {
      try {
        if(isEditing) {
          const currentSphere = allSpheres.find((s) => s.id === sphereId);
          if(currentSphere?.isBuiltIn) {
            toast({
              title: "Erro",
              description: "Esferas built-in não podem ser editadas",
              variant: "destructive"
            });
            return;
          }
        }

        const onlyParentChanged = isEditing && parentId !== originalParentId && sphereId !== null;

        let result;

        if(onlyParentChanged) {
          console.log(`Atualizando apenas o parentId de ${originalParentId} para ${parentId}`);
          result = await levelService.updateParent(sphereId, parentId);
        } else {
          const sphereData: any = {
            name,
            sigla,
            description,
            type,
            parent: parentId && parentId !== "0" ? { id: Number(parentId) } : null,
            externalUrl: endpoint,
            uuid: uuid
          };

          if(type === "EXTERNAL") {
            sphereData.apiKey = apiKey;
            console.log("Enviando apiKey:", apiKey || "(vazio)");
          }

          console.log("Sending data to API:", JSON.stringify(sphereData, null, 2));
          console.log("Parent ID value:", parentId, "converted to:", sphereData.parent);

          if(isEditing && sphereId) {
            result = await levelService.updateLevel(sphereId, sphereData);
          } else {
            console.log("Criando nova esfera");
            result = await levelService.createLevel(sphereData);
          }
        }

        console.log("Resultado da operação:", JSON.stringify(result, null, 2));

        if(!result) {
          throw new Error(isEditing ? "Falha ao atualizar esfera" : "Falha ao criar esfera");
        }

        if(result.parent) {
          console.log("Parent no resultado:", result.parent);
        } else if(result.parentId) {
          console.log("ParentId no resultado:", result.parentId);
        } else {
          console.log("Nenhum parent ou parentId no resultado");
        }

        if(isEditing) {
          console.log("Disparando evento sphere-updated");
          window.dispatchEvent(new Event("sphere-updated"));
        }

        toast({
          title: "Sucesso",
          description: isEditing ? "Esfera atualizada com sucesso!" : "Nova esfera criada com sucesso!"
        });

        setTimeout(() => {
          navigate("/dashboard/levels");
        }, 500);
      } catch (err: any) {
        const errorMessage: string = formatErrorMessages(err.error);
        toast({
          title: isEditing ? "Erro ao atualizar esfera" : "Erro ao criar esfera",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Informação",
        description: "Não há alterações para salvar."
      });
    }
  };

  useEffect(() => {
    if(parentId && parentId !== "0") {
      const selectedSphere = allSpheres.find((s) => s.id === parentId);
      setSelectedSphereName(selectedSphere?.name || "");
    } else {
      setSelectedSphereName("Nenhuma (esfera pai)");
    }
  }, [allSpheres, parentId]);


  if(loading)
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />{" "}
      </div>
    );

  return (
    <ScrollArea className="h-full">
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div className="flex-none">
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div className="pl-1 flex items-start justify-between">
              <Heading
                title="Nova esfera"
                returnButton={true}
                onReturnClick={() => {navigate(PRIVATE_ROUTES.LEVELS)}}
              />
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b">
          <div className="px-6 py-6 max-w-content-container m-auto">
            <form onSubmit={handleSubmit} className="w-full mt-4 max-w-content-container m-auto">
              <div className="space-y-4 pb-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="name">
                      Nome <span className="text-primary-600">*</span>
                    </Label>
                    <Input
                      className="mt-2"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome da esfera"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="sigla">
                      Sigla <span className="text-primary-600">*</span>
                    </Label>
                    <Input
                      className="mt-2"
                      id="sigla"
                      value={sigla}
                      onChange={(e) => setSigla(e.target.value)}
                      placeholder="Sigla da esfera (ex: FED, EST)"
                      required />
                    <p className="text-xs text-gray-500 mt-1">
                      A sigla deve conter apenas letras e números, sem espaços ou caracteres especiais.
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="parentSphere">
                      Esfera pai <span className="text-primary-600">*</span>
                    </Label>
                    <div className="mt-2">
                      <Select
                        value={parentId ?? "0"}
                        onValueChange={(value) => {
                          setParentId(value);
                          const selectedSphere = allSpheres.find((s) => s.id === value);
                          setSelectedSphereName(value === "0" ? "Nenhuma (esfera pai)" : selectedSphere?.name || "");
                        }}
                        disabled={isEditing && hasItems}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a esfera pai">{selectedSphereName}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Nenhuma (esfera pai)</SelectItem>
                          {allSpheres.map((sphere) => (
                            <SelectItem key={sphere.id} value={sphere.id}>
                              {sphere.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isEditing && hasItems && (
                        <p className="text-xs text-blue-600 mt-1">
                          A esfera pai não pode ser alterada porque esta esfera já possui itens.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="description">
                    Descrição <span className="text-primary-600">*</span>
                  </Label>
                  <Textarea
                    placeholder="Escreva uma descrição para a esfera"
                    className="resize-none mt-2"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {description.length}/200 caracteres
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-normal text-gray-700 dark:text-gray-300">
                    Tipo <span className="text-primary-600">*</span>
                  </Label>
                  <RadioGroup
                    className="mt-2 flex flex-row gap-4"
                    value={type}
                    onValueChange={(value: "BUSINESS" | "EXTERNAL") => {
                      setType(value);

                      if(value !== "EXTERNAL") {
                        setHasExistingApiKey(false);
                      }
                    }}
                    disabled={isEditing}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BUSINESS" id="BUSINESS" disabled={isEditing} />
                      <Label htmlFor="BUSINESS">Negocial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="EXTERNAL" id="EXTERNAL" disabled={isEditing} />
                      <Label htmlFor="EXTERNAL">Externa</Label>
                    </div>
                  </RadioGroup>
                  {isEditing && (
                    <p className="text-xs text-blue-600 mt-2">O tipo da esfera não pode ser alterado após a criação.</p>
                  )}
                </div>
                {type === "EXTERNAL" && (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="endpoint">
                        Endpoint <span className="text-primary-600">*</span>
                      </Label>
                      <Input
                        placeholder="https://api.exemplo.com"
                        className="mt-2"
                        id="endpoint"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        required />
                      <div className="text-xs text-gray-500 font-normal flex items-center mt-3">
                        <span><span className="bold text-primary-600 underline cursor-pointer font-bold">Clique aqui</span> Para mais informações sobre a criação do seu endpoint.</span>
                      </div>
                    </div>
                    <div className="lg:col-span-1">
                      <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="apiKey">
                        API Key <span className="text-primary-600">*</span>
                      </Label>
                      <Input
                        placeholder={isEditing ? "Digite apenas para substituir a API Key existente" : "***************************"}
                        className="mt-2"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        required={!isEditing} />
                      {isEditing && type === "EXTERNAL" && (
                        <div className="text-xs text-blue-600 flex items-center mt-2">
                          <Info className="min-w-5 min-h-5 mr-2" size="20" />
                          {hasExistingApiKey
                            ? "Deixe os asteriscos para manter a API Key atual ou digite uma nova para substituí-la."
                            : "Nenhuma API Key configurada. Digite uma nova API Key."}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </ScrollArea>

        <footer className="px-6 h-[88px] flex items-center justify-end dark:bg- border-t">
          <Button onClick={() => {handleSubmit()}}>
            {isEditing ? "Atualizar esfera" : "Criar esfera"}
          </Button>
        </footer>
      </motion.div>
    </ScrollArea>
  );
}

