import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@ui/use-toast.ts";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { ClientStatusEnum } from "@features/client/common/enum/client-status.enum";
import { ClientResponseInterface } from "@features/client/common/model/client.model";
import { AttachmentConfigurationInterface } from "@features/client/common/model/configuration.model";
import { clientService } from "@features/client/common/service/client-service";

import * as z from "zod";

export const formSchema = z.object({
  id: z.string().or(z.number()).optional().nullable(),
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  clientId: z
    .string()
    .min(3, { message: "O client Id do sistema deve conter no mínimo 3 caracteres" })
    .regex(/^[a-z][a-z0-9-]*$/, { message: "client Id deve ser separado por hífen" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  baseUrl: z
    .string()
    .min(3, { message: "O baseUrl do sistema deve conter no mínimo 3 caracteres" })
    .regex(/^(https|http?:\/\/)?([\w.-:?-]+)$/, { message: "baseUrl inválido" }),
  managed: z.boolean().default(true),
  status: z.string().optional().nullable().default(ClientStatusEnum.UNPUBLISHED)
});

export type SystemFormData = z.infer<typeof formSchema>;

const defaultValues: SystemFormData = {
  name: "",
  clientId: "",
  description: "",
  managed: false,
  baseUrl: "",
  status: ClientStatusEnum.UNPUBLISHED
};

export const useSystemFormData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clientId: urlClientId } = useParams();

  const isEditing = !!urlClientId;
  const clientId = isEditing ? urlClientId : null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [initialData, setInitialData] = useState<ClientResponseInterface | null>(null);
  const [attachmentConfigs, setAttachmentConfigs] = useState<AttachmentConfigurationInterface[]>([]);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange"
  });

  const getClientToEdit = useCallback(async () => {
    if(!clientId) return;

    try {
      setInitialLoading(true);
      const client: ClientResponseInterface = await clientService.fetchByClientId(clientId);

      const formData: SystemFormData = {
        id: client.id || null,
        name: client.name || "",
        clientId: client.clientId || "",
        description: client.description || "",
        managed: client.managed || false,
        baseUrl: client.baseUrl || "",
        status: client.status || ClientStatusEnum.UNPUBLISHED
      };

      setInitialData(client);
      methods.reset(formData);

      if(client.configurations) {
        setAttachmentConfigs(client.configurations);
      }

    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar dados do sistema",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setInitialLoading(false);
    }
  }, [clientId, methods, toast]);

  const onSubmit = useCallback(async (form: SystemFormData) => {
    try {
      setLoading(true);
      const payload = { ...form, configurations: attachmentConfigs } as any;

      if(initialData && initialData.id) {
        payload.id = initialData.id;

        if(initialData.configurations && initialData.configurations.length > 0) {
          const payloadConfigNames = new Set(
            payload.configurations.map((config: AttachmentConfigurationInterface) => config.name)
          );
          const payloadConfigIds = new Set(
            payload.configurations
              .filter((config: AttachmentConfigurationInterface) => config.id)
              .map((config: AttachmentConfigurationInterface) => config.id)
          );
          const configsToDeactivate: AttachmentConfigurationInterface[] = [];
          const deletedConfigs = initialData.configurations.filter(
            (config: AttachmentConfigurationInterface) =>
              !payloadConfigNames.has(config.name)
          );
          const replacedConfigs = initialData.configurations.filter(
            (config: AttachmentConfigurationInterface) =>
              payloadConfigNames.has(config.name) &&
              config.id &&
              !payloadConfigIds.has(config.id)
          );
          configsToDeactivate.push(
            ...deletedConfigs,
            ...replacedConfigs
          );
          if(configsToDeactivate.length > 0) {
            const inactiveConfigs = configsToDeactivate.map(
              (config: AttachmentConfigurationInterface) => ({
                ...config,
                active: false
              })
            );

            payload.configurations = [...payload.configurations, ...inactiveConfigs];
          }
        }

        await clientService.updateClient(initialData.id, payload);
        toast({ title: "Sistema atualizado", description: "O sistema foi atualizado com sucesso" });
        navigate(`${PRIVATE_ROUTES.SYSTEMS}/${form.clientId}/details`);
      } else {
        await clientService.createClient(payload);
        toast({ title: "Sistema criado", description: "O sistema foi criado com sucesso" });
        navigate(`${PRIVATE_ROUTES.SYSTEMS}/${form.clientId}/details`);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao realizar operação no sistema",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [attachmentConfigs, initialData, navigate, toast]);

  useEffect(() => {
    if(isEditing) {
      getClientToEdit();
    }
  }, [isEditing, getClientToEdit]);

  return {
    methods,
    activeIndex,
    setActiveIndex,
    loading,
    initialLoading,
    isEditing,
    attachmentConfigs,
    setAttachmentConfigs,
    onSubmit
  };
};

/**
 * Custom hook for managing multi-step form navigation
 * @param activeIndex - Current active step index
 * @param setActiveIndex - Function to set active step index
 * @param methods - React Hook Form methods
 * @returns Object containing navigation handlers
 */
export const useFormNavigation = (
  activeIndex: number,
  setActiveIndex: (index: number) => void,
  methods: ReturnType<typeof useForm>
) => {
  const handleNext = useCallback(() => {
    if(activeIndex === 0) {
      methods.trigger().then((isValid) => {
        if(isValid) {
          setActiveIndex(activeIndex + 1);
        }
      });
    } else {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, methods, setActiveIndex]);

  const handleBack = useCallback(() => {
    setActiveIndex(activeIndex - 1);
  }, [activeIndex, setActiveIndex]);

  return {
    handleNext,
    handleBack
  };
};

/**
 * Custom hook for managing attachment configurations
 * @param setAttachmentConfigs - State setter for attachment configurations
 * @returns Object containing attachment configuration handlers
 */
export const useAttachmentConfigs = (
  setAttachmentConfigs: React.Dispatch<React.SetStateAction<AttachmentConfigurationInterface[]>>
) => {
  const handleAddAttachmentConfig = useCallback((config: AttachmentConfigurationInterface) => {
    setAttachmentConfigs(prev => [...prev, config]);
  }, [setAttachmentConfigs]);

  const handleDeleteAttachmentConfig = useCallback((name: string) => {
    setAttachmentConfigs(prev => prev.filter(config => config.name !== name));
  }, [setAttachmentConfigs]);

  return {
    handleAddAttachmentConfig,
    handleDeleteAttachmentConfig
  };
};

