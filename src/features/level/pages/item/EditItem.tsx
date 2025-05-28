import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { Heading } from "../../../../components/ui/heading.tsx";
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import { motion } from "framer-motion";
import { toast } from "../../../../components/ui/use-toast.ts";
import { Label } from "../../../../components/ui/label.tsx";
import { Input } from "../../../../components/ui/input.tsx";
import { Button } from "../../../../components/ui/button.tsx";
import { Textarea } from "../../../../components/ui/textarea.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip.tsx";
import { AlertCircle, Loader2 } from "lucide-react";
import HighlightLoader from "../../../../components/highlightloader/HighLightLoader.tsx";
import { levelService } from "../../common/api/level-service.ts";
import { LevelInterface } from "../../common/types/level.model.ts";
import { LevelItemInterface } from "../../common/types/level-item.model.ts";
import { goToPreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import DynamicSphereForm from "../../common/components/DynamicSphereForm.tsx";

interface FormData {
  name: string;
  externalCode: string;
  description: string;
  parentId: string;
}

export const EditItem: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [level, setLevel] = useState<LevelInterface | null>(null);
  const [item, setItem] = useState<LevelItemInterface | null>(null);

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormData>();
  const { id: levelId, itemId } = useParams<{ id: string; itemId: string }>();
  const navigate = useNavigate();

  const retrieveLevel = async (id: string) => {
    try {
      const levelResponse = await levelService.getLevelById(id);
      setLevel(levelResponse);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao buscar informações da esfera.",
        variant: "destructive"
      });
    }
  };

  const loadItemData = async () => {
    if (!levelId || !itemId) return;

    try {
      const itemData = await levelService.getLevelItem(levelId, itemId);
      if (!itemData) {
        throw new Error("Falha ao carregar dados do item");
      }
      setItem(itemData);

      setValue("name", itemData.name || "");
      setValue("description", itemData.description || "");
      setValue("externalCode", itemData.externalCode || "");

      if (itemData.parent) {
        setValue("parentId", itemData.parent.id.toString());
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar dados do item.",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        externalCode: data.externalCode,
        parentId: data.parentId ? Number(data.parentId) : null
      };

      const result = await levelService.updateLevelItem(levelId!, itemId!, payload);
      if (!result) throw new Error("Falha ao atualizar o item.");

      toast({ title: "Sucesso", description: "Item atualizado com sucesso!" });
      navigate(`/dashboard/levels/${levelId}/items`);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao atualizar o item. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      if (levelId) {
        await retrieveLevel(levelId);
        await loadItemData();
        setLoading(false);
      }
    };

    initPage();
  }, [levelId, itemId]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />
      </div>
    );
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Esferas", link: "/dashboard/levels" },
    { title: level?.name || "", link: `/dashboard/levels/${levelId}/items` },
    { title: "Editar item", link: "" }
  ];

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3 } }}
        className="flex-1 p-4 pt-6 md:p-8">
        <div className="space-y-4 pb-10 mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={`Editar item na Esfera: ${level?.name}`} description="Gerenciar esferas." />
          <Separator />
          <div className="max-w-content-container m-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col md:flex-row md:gap-4 mb-4">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <Label htmlFor="name">Nome</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      placeholder="Escreva o nome do item"
                      className={`mt-2 ${errors.name ? "border-red-500" : ""}`}
                      {...register("name", {
                        required: "Nome é obrigatório",
                        minLength: { value: 3, message: "O nome deve conter no mínimo 3 caracteres" }
                      })}
                    />
                    {errors.name && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                          </TooltipTrigger>
                          <TooltipContent>{errors.name.message}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <Label htmlFor="externalCode">Código externo</Label>
                  <div className="relative">
                    <Input
                      id="externalCode"
                      placeholder="Escreva o código externo do item"
                      className={`mt-2 ${errors.externalCode ? "border-red-500" : ""}`}
                      {...register("externalCode", {
                        required: "Código externo é obrigatório",
                        minLength: { value: 3, message: "O código externo deve conter no mínimo 3 caracteres" }
                      })}
                    />
                    {errors.externalCode && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                          </TooltipTrigger>
                          <TooltipContent>{errors.externalCode.message}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full mb-4">
                <Label htmlFor="description">Descrição</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Escreva uma descrição para o item"
                    className={`resize-none mt-2 ${errors.description ? "border-red-500" : ""}`}
                    rows={6}
                    {...register("description", {
                      required: "Descrição é obrigatória",
                      minLength: { value: 3, message: "A descrição deve conter no mínimo 3 caracteres" }
                    })}
                  />
                  {errors.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                        </TooltipTrigger>
                        <TooltipContent>{errors.description.message}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              {level?.parent && (
                <div className="w-full">
                  <Label htmlFor="parentId">Selecione o item pai:</Label>
                  <Controller
                    name="parentId"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Item pai é obrigatório" }}
                    render={({ field }) => (
                      <div className="relative mt-2">
                        <DynamicSphereForm
                          initialId={level.parent!.id}
                          simpleLabel={true}
                          codeItem={itemId}
                          onHierarchyNotCompleted={() => {
                            field.onChange("");
                          }}
                          onHierarchyComplete={(itemId) => {
                            field.onChange(itemId.toString());
                          }}
                          hasError={!!errors.parentId}
                          onErrorClear={() => {
                            if(errors.parentId) {
                              Object.assign(errors, { parentId: undefined });
                              control.unregister("parentId");
                              control.register("parentId");
                            }
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="max-w-content-container m-auto">
          <Separator />
          <div className="flex justify-between w-full mt-6">
            <Button onClick={() => goToPreviousRoute(navigate)} variant="ghost">Voltar</Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Item"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </ScrollArea>
  );
};
