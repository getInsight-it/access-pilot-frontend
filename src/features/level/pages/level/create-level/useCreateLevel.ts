import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "../../../../../common/external/ui/use-toast.ts";
import { levelService } from "../../../common/api/level-service.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { PAGINATION } from "../../../../../common/constants/pagination.ts";

export interface SphereItem {
  id: string;
  name: string;
  description: string;
  type: "BUSINESS" | "EXTERNAL" | "BUILT_IN";
  parent?: {
    id: number;
    name: string;
  } | null;
  isBuiltIn?: boolean;
  endpoint?: string;
  apiKey?: string;
  externalUrl?: string;
  uuid?: string;
  icon?: string;
  sigla?: string;
}

const API_KEY_MASK = "••••••••••••••••";

export const useCreateLevelData = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const fetchSphereData = useCallback(async (id: string) => {
    try {
      const data = await levelService.getLevelById(id);

      if (!data) {
        throw new Error("Falha ao buscar dados da esfera");
      }

      if (data.type === "BUILT_IN") {
        toast({
          title: "Error",
          description: "Built-in spheres cannot be edited",
          variant: "destructive"
        });
        navigate(PRIVATE_ROUTES.LEVELS);
        return;
      }

      setName(data.name);
      setSigla(data.sigla || "");
      setDescription(data.description || "");
      setType(data.type === "BUILT_IN" ? "BUSINESS" : data.type);

      let newParentId = "0";
      if (data.parent) {
        newParentId = data.parent.id.toString();
      } else if (data.parentId) {
        newParentId = data.parentId.toString();
      }

      setParentId(newParentId);
      setOriginalParentId(newParentId);
      setUuid(data.uuid || "");

      if (data.type === "EXTERNAL") {
        setEndpoint(data.externalUrl || "");
        const hasApiKey = true;
        setHasExistingApiKey(hasApiKey);

        if (hasApiKey) {
          setApiKey(API_KEY_MASK);
        } else {
          setApiKey("");
        }
        setHasItems(false);
      } else {
        setEndpoint("");
        setApiKey("");
        setHasExistingApiKey(false);
        await checkIfSphereHasItems(id);
      }

      setLoading(false);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao buscar dados da esfera.",
        description: errorMessage,
        variant: "destructive"
      });

      navigate(PRIVATE_ROUTES.LEVELS);
    }
  }, [navigate]);

  const checkIfSphereHasItems = useCallback(async (sphereId: string) => {
    try {
      const itemsData = await levelService.getLevelItems(sphereId, 1, 1);

      if (itemsData && itemsData.items && itemsData.items.length > 0) {
        setHasItems(true);
      } else {
        setHasItems(false);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao verificar itens da esfera",
        description: errorMessage,
        variant: "destructive"
      });
      setHasItems(false);
    }
  }, []);

  const fetchAllSpheres = useCallback(async () => {
    try {
      const data = await levelService.getLevels(1, PAGINATION.LARGE_PAGE_SIZE, "id", "ASC");
      if (!data) {
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
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao carregar esferas",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, []);

  const initializeForm = useCallback(async () => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    await fetchAllSpheres();

    if (id) {
      setIsEditing(true);
      setSphereId(id);
      await fetchSphereData(id);
    } else {
      setLoading(false);
    }
  }, [location.search, fetchAllSpheres, fetchSphereData]);

  useEffect(() => {
    if (parentId && parentId !== "0") {
      const selectedSphere = allSpheres.find((s) => s.id === parentId);
      setSelectedSphereName(selectedSphere?.name || "");
    } else {
      setSelectedSphereName("Nenhuma (esfera pai)");
    }
  }, [allSpheres, parentId]);

  return {
    isEditing,
    sphereId,
    name,
    setName,
    description,
    setDescription,
    type,
    setType,
    endpoint,
    setEndpoint,
    apiKey,
    setApiKey,
    hasExistingApiKey,
    setHasExistingApiKey,
    parentId,
    setParentId,
    originalParentId,
    allSpheres,
    selectedSphereName,
    setSelectedSphereName,
    loading,
    sigla,
    setSigla,
    uuid,
    hasItems,
    initializeForm
  };
};

export const useCreateLevelOperations = (formData: ReturnType<typeof useCreateLevelData>) => {
  const navigate = useNavigate();

  const hasChanges = useCallback((): boolean => {
    if (!formData.sphereId) return true;
    const currentSphere = formData.allSpheres.find((s) => s.id === formData.sphereId);
    if (!currentSphere) return true;
    const apiKeyChanged = formData.type === "EXTERNAL" && formData.apiKey.trim() !== "";

    return (
      formData.name !== currentSphere.name ||
      formData.sigla !== currentSphere.sigla ||
      formData.description !== currentSphere.description ||
      formData.type !== currentSphere.type ||
      formData.parentId !== (currentSphere.parent ? currentSphere.parent.id.toString() : "0") ||
      (formData.type === "EXTERNAL" && (formData.endpoint !== currentSphere.externalUrl || apiKeyChanged))
    );
  }, [formData]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.isEditing || hasChanges()) {
      try {
        if (formData.isEditing) {
          const currentSphere = formData.allSpheres.find((s) => s.id === formData.sphereId);
          if (currentSphere?.isBuiltIn) {
            toast({
              title: "Erro",
              description: "Esferas built-in não podem ser editadas",
              variant: "destructive"
            });
            return;
          }
        }

        const onlyParentChanged = formData.isEditing && formData.parentId !== formData.originalParentId && formData.sphereId !== null;

        let result;

        if (onlyParentChanged) {
          result = await levelService.updateParent(formData.sphereId, formData.parentId);
        } else {
          const sphereData: any = {
            name: formData.name,
            sigla: formData.sigla,
            description: formData.description,
            type: formData.type,
            externalUrl: formData.endpoint,
            uuid: formData.uuid
          };

          if (formData.parentId && formData.parentId !== "0") {
            sphereData.parentId = Number(formData.parentId);
          }

          if (formData.type === "EXTERNAL") {
            sphereData.apiKey = formData.apiKey;
          }

          if (formData.isEditing && formData.sphereId) {
            result = await levelService.updateLevel(formData.sphereId, sphereData);
          } else {
            result = await levelService.createLevel(sphereData);
          }
        }

        if (!result) {
          throw new Error(formData.isEditing ? "Falha ao atualizar esfera" : "Falha ao criar esfera");
        }

        if (formData.isEditing) {
          window.dispatchEvent(new Event("sphere-updated"));
        }

        toast({
          title: "Sucesso",
          description: formData.isEditing ? "Esfera atualizada com sucesso!" : "Nova esfera criada com sucesso!"
        });

        setTimeout(() => {
          navigate(PRIVATE_ROUTES.LEVELS);
        }, 500);
      } catch (error: any) {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: formData.isEditing ? "Erro ao atualizar esfera" : "Erro ao criar esfera",
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
  }, [formData, hasChanges, navigate]);

  return {
    hasChanges,
    handleSubmit
  };
};

