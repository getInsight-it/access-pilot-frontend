"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button.tsx";
import { Input } from "../../../../components/ui/input.tsx";
import { Label } from "../../../../components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.tsx";
import { Textarea } from "../../../../components/ui/textarea.tsx";
import { toast } from "../../../../components/ui/use-toast.ts";
import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import { Heading } from "../../../../components/ui/heading.tsx";
import { Info } from "lucide-react";
import useAuthStore from "../../../../store/authStore.ts";
import HighlightLoader from "../../../../components/highlightloader/HighLightLoader.tsx";
import { motion } from "framer-motion";
import { levelService } from "../../common/api/level-service.ts";

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
  { title: "Dashboard", link: "/dashboard" },
  { title: "Esferas", link: "/dashboard/levels" },
  { title: "Gerenciar esferas", link: "" }
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
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Adicionar um novo estado para rastrear se a esfera tem itens
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

  // Modificar o método fetchSphereData para verificar se a esfera tem itens
  const fetchSphereData = async (id: string) => {
    try {
      // Usar o método getLevelById que já está funcionando
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

      // Verificar se o parentId está presente no objeto ou em outra propriedade
      let newParentId = "0";
      if(data.parent) {
        newParentId = data.parent.id.toString();
        console.log("Parent encontrado no objeto parent:", data.parent);
      } else if(data.parentId) {
        // Tente usar parentId se estiver disponível
        newParentId = data.parentId.toString();
        console.log("Parent encontrado na propriedade parentId:", data.parentId);
      } else {
        console.log("Nenhum parent encontrado no objeto");
      }

      // Definir o parentId após determinar seu valor
      setParentId(newParentId);
      setOriginalParentId(newParentId);
      console.log("Parent carregado e definido como:", newParentId);

      setUuid(data.uuid || "");
      setIcon(data.icon || "");

      // Modificar a lógica de detecção de API Key no método fetchSphereData
      // Campos específicos para esferas externas
      if(data.type === "EXTERNAL") {
        console.log("Carregando dados de esfera externa:", data);
        console.log("API Key recebido da API:", data.apiKey);
        setEndpoint(data.externalUrl || "");

        // Assumir que uma API Key existe para esferas externas existentes
        // A API não retorna o campo apiKey por razões de segurança
        const hasApiKey = true; // Assumir que existe por padrão para esferas externas existentes
        setHasExistingApiKey(hasApiKey);

        // Se tiver API Key existente, mostrar asteriscos no campo
        if(hasApiKey) {
          setApiKey("••••••••••••••••"); // Mostrar asteriscos para indicar que existe uma chave
        } else {
          setApiKey("");
        }
        console.log("API Key existente assumida:", hasApiKey);

        // Para esferas externas, não verificamos se tem itens
        // pois elas não têm itens gerenciáveis diretamente
        setHasItems(false);
      } else {
        setEndpoint("");
        setApiKey("");
        setHasExistingApiKey(false);

        // Verificar se a esfera tem itens apenas para esferas não-externas
        await checkIfSphereHasItems(id);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching sphere data:", err);
      toast({
        title: "Error",
        description: "Failed to fetch sphere data",
        variant: "destructive"
      });
      navigate("/dashboard/levels");
    }
  };

  // Adicionar uma função para verificar se a esfera tem itens
  const checkIfSphereHasItems = async (sphereId: string) => {
    try {
      const itemsData = await levelService.getLevelItems(sphereId, 1, 1);

      // Se a API retornar dados e houver pelo menos um item, a esfera tem itens
      if(itemsData && itemsData.items && itemsData.items.length > 0) {
        setHasItems(true);
        console.log(`Esfera ${sphereId} tem itens. Desabilitando campo de esfera pai.`);
      } else {
        setHasItems(false);
        console.log(`Esfera ${sphereId} não tem itens.`);
      }
    } catch (error) {
      console.error(`Erro ao verificar itens da esfera ${sphereId}:`, error);
      // Em caso de erro, assumimos que não há itens para evitar bloquear a edição
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
    } catch (err) {
      console.error("Erro ao carregar todas as esferas:", err);
      toast({
        title: "Erro",
        description: "Falhou ao carregar a esfera pai",
        variant: "destructive"
      });
    }
  };

  const hasChanges = () => {
    if(!sphereId) return true; // Se não estiver editando, sempre há mudanças
    const currentSphere = allSpheres.find((s) => s.id === sphereId);
    if(!currentSphere) return true;

    // Se estamos editando uma esfera externa e o usuário digitou uma nova API key,
    // consideramos que há mudanças
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

  // Modify the handleSubmit function to ensure parent is properly structured
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpar mensagem de erro anterior
    setError(null);

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

        // Verificar se apenas o parentId foi alterado
        const onlyParentChanged = isEditing && parentId !== originalParentId && sphereId !== null;

        let result;

        if(onlyParentChanged) {
          // Se apenas o parentId foi alterado, usar o método específico
          console.log(`Atualizando apenas o parentId de ${originalParentId} para ${parentId}`);
          result = await levelService.updateParent(sphereId, parentId);
        } else {
          // Dados completos para envio
          const sphereData: any = {
            name,
            sigla,
            description,
            type,
            // Enviar parent como objeto para o service, que vai converter para parentId
            parent: parentId && parentId !== "0" ? { id: Number(parentId) } : null,
            // Include fields specific for external spheres
            externalUrl: endpoint,
            uuid: uuid
          };

          // Sempre incluir apiKey para esferas externas
          if(type === "EXTERNAL") {
            sphereData.apiKey = apiKey;
            console.log("Enviando apiKey:", apiKey || "(vazio)");
          }

          // Add detailed logging for debugging
          console.log("Sending data to API:", JSON.stringify(sphereData, null, 2));
          console.log("Parent ID value:", parentId, "converted to:", sphereData.parent);

          if(isEditing && sphereId) {
            // Atualizar esfera existente
            result = await levelService.updateLevel(sphereId, sphereData);
          } else {
            // Criar nova esfera
            console.log("Criando nova esfera");
            result = await levelService.createLevel(sphereData);
          }
        }

        console.log("Resultado da operação:", JSON.stringify(result, null, 2));

        if(!result) {
          throw new Error(isEditing ? "Falha ao atualizar esfera" : "Falha ao criar esfera");
        }

        // Verificar se o resultado contém o parentId esperado
        if(result.parent) {
          console.log("Parent no resultado:", result.parent);
        } else if(result.parentId) {
          console.log("ParentId no resultado:", result.parentId);
        } else {
          console.log("Nenhum parent ou parentId no resultado");
        }

        if(isEditing) {
          // Disparar evento para atualizar a lista de esferas
          console.log("Disparando evento sphere-updated");
          window.dispatchEvent(new Event("sphere-updated"));
        }

        toast({
          title: "Sucesso",
          description: isEditing ? "Esfera atualizada com sucesso!" : "Nova esfera criada com sucesso!"
        });

        // Adicionar um pequeno atraso antes de navegar para garantir que os eventos sejam processados
        setTimeout(() => {
          navigate("/dashboard/levels");
        }, 500);
      } catch (err) {
        console.error("Erro ao criar/editar a esfera:", err);

        // Extrair mensagem de erro mais detalhada se disponível
        let errorMessage = "Ocorreu um erro enquanto a esfera foi criada/atualizada";
        if(err instanceof Error) {
          errorMessage = err.message;
        }

        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
        });

        setError(errorMessage);
      }
    } else {
      // Não há alterações a serem salvas
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

  // if (loading) {
  //   return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Carregando dados...</div>
  // }

  if(loading)
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />{" "}
      </div>
    );

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-start justify-between my-4">
            <Heading title={isEditing ? "Editar esfera" : "Criar nova esfera"} description="" />
          </div>

          <Separator />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="w-full mt-4 max-w-content-container m-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                  <Label className="text-base font-semibold" htmlFor="name">Nome</Label>
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
                  <Label className="text-base font-semibold" htmlFor="sigla">Sigla</Label>
                  <Input
                    className="mt-2"
                    id="sigla"
                    value={sigla}
                    onChange={(e) => setSigla(e.target.value)}
                    placeholder="Sigla da esfera (ex: FED, EST)"
                    required/>
                  <p className="text-xs text-gray-500 mt-1">
                    A sigla deve conter apenas letras e números, sem espaços ou caracteres especiais.
                  </p>
                </div>
                <div>
                  <Label className="text-base font-semibold" htmlFor="parentSphere">Esfera pai</Label>
                  <div className="mt-2">
                    {/* Modificar o Select de esfera pai para ficar desabilitado quando a esfera tiver itens */}
                    <Select
                      value={parentId ?? "0"}
                      onValueChange={(value) => {
                        setParentId(value);
                        const selectedSphere = allSpheres.find((s) => s.id === value);
                        setSelectedSphereName(value === "0" ? "Nenhuma (esfera pai)" : selectedSphere?.name || "");
                      }}
                      disabled={isEditing && hasItems} // Desabilitar se estiver editando e tiver itens
                    >
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
                <Label className="text-base font-semibold" htmlFor="description">Descrição</Label>
                <Textarea
                  placeholder="Escreva uma descrição para a esfera"
                  className="resize-none mt-2"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required/>
              </div>
              <div>
                <Label className="text-base font-semibold">Tipo</Label>
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
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Label className="flex justify-between items-center text-base font-semibold" htmlFor="endpoint">Endpoint</Label>
                    <Input
                      placeholder="https://api.exemplo.com"
                      className="mt-2"
                      id="endpoint"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      required/>
                    <div className="text-xs text-gray-500 flex items-center mt-3">
                      <Info className="min-w-5 min-h-5 mr-2" size="20" />
                      <span>
                        Para mais informações sobre a criação do seu endpoint <span className="bold text-black underline cursor-pointer">clique aqui</span>
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <Label className="text-base font-semibold" htmlFor="apiKey">API Key</Label>
                    <Input
                      placeholder={isEditing ? "Digite apenas para substituir a API Key existente" : "***************************"}
                      className="mt-2"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      required={!isEditing}/>
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


            </form>
          </div>
        </div>

      </motion.div>
      <div className="flex flex-row gap-2 px-4 max-w-content-container m-auto">
        <Button
          className="mr-2"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          variant="ghost"
          type="button">Voltar
        </Button>
        <Button type="submit">{isEditing ? "Atualizar esfera" : "Criar esfera"}</Button>
      </div>
    </ScrollArea>
  );
}

