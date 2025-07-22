import * as z from "zod";
import type React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "../../../components/ui/use-toast.ts";
import { Button } from "../../../components/ui/button.tsx";
import { FormControl, FormField, FormItem, FormLabel } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { catchError, finalize, from, tap } from "rxjs";
import { useNavigate } from "react-router-dom";
import { Separator } from "../../../components/ui/separator.tsx";
import { IconPicker } from "../../../components/icon-picker/IconPicker.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip.tsx";
import { AlertCircle } from "lucide-react";
import { roleService } from "../common/service/role-service.ts";
import { RoleResponseInterface } from "../common/types/role.model.ts";
import { ClientResponseInterface } from "../../client/common/model/client.model.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select.tsx";
import { LevelInterface } from "../../level/common/types/level.model.ts";
import { levelService } from "../../level/common/api/level-service.ts";
import { goToPreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import HighlightLoader from "../../../components/highlightloader/HighLightLoader.tsx";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  label: z.string().min(3, { message: "A label do sistema deve conter no mínimo 3 caracteres" }),
  levelId: z.string().optional()
});

interface RoleFormProps {
  client?: ClientResponseInterface;
  onSuccessSubmit?: () => any;
  initialData: RoleResponseInterface | null;
  readonly: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({ client, initialData, readonly, onSuccessSubmit }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [levels, setLevels] = useState<LevelInterface[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const toastMessage = initialData ? "Papel atualizado." : "Papel criado.";
  const navigate = useNavigate();
  const defaultValues = initialData || { name: "", description: "" };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingLevels(true);
      try {
        const response = await levelService.getLevels();
        if (response && response.items) {
          setLevels(response.items);

          if (initialData && initialData.level.id.toString()) {
            methods.setValue("levelId", initialData.level.id.toString());
          }
        }
      } catch (error) {
        console.error("Erro ao carregar esferas:", error);
        toast({
          title: "Erro ao carregar esferas",
          description: "Não foi possível carregar as esferas disponíveis.",
          variant: "destructive"
        });
      } finally {
        setLoadingLevels(false);
        setDataLoading(false);
      }
    };

    fetchData();
  }, [toast, initialData, methods]);

  function getActionStyle() {
    if(readonly) {
      return "DETAIL";
    } else if(initialData && !readonly) {
      return "EDIT";
    } else {
      return "CREATE";
    }
  }

  function isReadOnly() {
    return getActionStyle() === "DETAIL";
  }

  const actionMap = {
    DETAIL: "",
    EDIT: "Salvar alterações",
    CREATE: "Adicionar papel"
  };

  const onSubmit = async (form: any) => {
    const role = {
      ...form,
      levelId: form.levelId === undefined || form.levelId === "empty" ? undefined : Number(form.levelId)
    } as RoleResponseInterface;
    role.client = client;
    setLoading(true);

    try {
      if(initialData) {
        await roleService.updateRole(initialData?.id, role);
      } else {
        await roleService.createRole(role)
      }

      toast({
        title: toastMessage,
        description: `O papel ${role.name} foi ${initialData ? "atualizado" : "criado"} com sucesso.`
      });
      onSuccessSubmit?.();
      navigate(`/dashboard/systems/${client?.clientId}/roles`);
    } catch (error) {
      toast({
        title: `Erro ao ${toastMessage}`,
        description: `O papel ${role.name} não foi ${initialData ? "atualizado" : "criado"}.`,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading || loadingLevels) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <HighlightLoader />
      </div>
    );
  }

  return (
    <>

    </>
  );
};
