import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../../../common/components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { motion } from "framer-motion";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { Label } from "../../../../common/external/ui/label.tsx";
import { Input } from "../../../../common/external/ui/input.tsx";
import { Button } from "../../../../common/external/ui/button.tsx";
import { Textarea } from "../../../../common/external/ui/textarea.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../common/external/ui/tooltip.tsx";
import { AlertCircle, Loader2 } from "lucide-react";
import HighlightLoader from "../../../../common/components/loading/HighLightLoader.tsx";
import { levelService } from "../../common/api/level-service.ts";
import { LevelInterface } from "../../common/types/level.model.ts";
import { LevelItemInterface } from "../../common/types/level-item.model.ts";
import DynamicSphereForm from "../../common/components/DynamicSphereForm.tsx";
import { goToPreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";

interface FormData {
  name: string;
  externalCode: string;
  description: string;
  parentId?: string;
}

interface PageablePresentationLevelItemInterface {
  items: LevelItemInterface[];
  total: number;
  hasMorePages: boolean;
  page: number;
}

export const CreateItem: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [level, setLevel] = useState<LevelInterface | null>(null);
  const [pageableAvailableParentItens, setPageableAvailableParentItens] = useState<PageablePresentationLevelItemInterface>({
    items: [],
    total: 0,
    hasMorePages: true,
    page: 1
  });

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>();
  const { id: levelId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const retrieveLevel = async (id: string) => {
    try {
      const levelResponse = await levelService.getLevelById(id);
      setLevel(levelResponse);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar informações da esfera",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const retriveAvailableParentItemOptions = async (
    parentId: string,
    incremental?: boolean
  ) => {
    const { page, hasMorePages } = pageableAvailableParentItens;
    if (!parentId || !hasMorePages) return;
    try {
      const availableItems = await levelService.getLevelItems(parentId, page, 30, "id", "ASC");
      if (incremental) {
        setPageableAvailableParentItens((prev) => ({
          ...prev,
          page: prev.page + 1,
          items: [...prev.items, ...availableItems.items],
          hasMorePages: prev.items.length + availableItems.items.length < availableItems.total
        }));
      } else {
        setPageableAvailableParentItens({
          items: availableItems.items,
          total: availableItems.total,
          hasMorePages: availableItems.items.length < availableItems.total,
          page: 2
        });
      }
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar opções de itens pais",
        description: errorMessage,
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

      const result = await levelService.createLevelItem(levelId!, payload);
      if (!result) throw new Error("Falha ao adicionar o item.");

      toast({ title: "Sucesso", description: "Item adicionado com sucesso!" });
      navigate(`/dashboard/levels/${levelId}/items`);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao adicionar item",
        description: errorMessage,
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
        setLoading(false);
      }
    };

    initPage();
  }, [levelId]);

  useEffect(() => {
    if (level && level.parent) {
      retriveAvailableParentItemOptions(level.parent.id.toString());
    }
  }, [level]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />
      </div>
    );
  }

  const breadcrumbItems = [
    { title: "Gerenciar esferas", link: "/dashboard/levels" },
    { title: "Itens", link: `/dashboard/levels/${levelId}/items` },
    { title: "Criar item", link: "" }
  ];

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
                title={`Criar item`}
                returnButton={true}
                onReturnClick={() => goToPreviousRoute(navigate)}
                customDescription={
                  <span className="text-md">
                    Esfera: <span className="text-primary-600">{level?.name}</span>
                  </span>
                }
              />
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b">
          <div className="px-6 py-6 max-w-content-container m-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-content-container m-auto">
              <div className="space-y-4 pb-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="name">Nome <span className="text-primary-600">*</span></Label>
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

                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="externalCode">Código externo <span className="text-primary-600">*</span></Label>
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

                <div>
                  <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="description">Descrição <span className="text-primary-600">*</span></Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      placeholder="Escreva uma descrição para o item"
                      className={`mt-2 ${errors.description ? "border-red-500" : ""}`}
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
                  <div>
                    <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="parentId">Selecione o item pai:</Label>
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
                            onHierarchyNotCompleted={() => {
                              field.onChange("");
                            }}
                            onHierarchyComplete={(itemId) => {
                              field.onChange(itemId.toString());
                            }}
                            hasError={!!errors.parentId}
                            onErrorClear={() => {
                              if (errors.parentId) {
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
              </div>
            </form>
          </div>
        </ScrollArea>

        <footer className="px-6 h-[88px] flex items-center justify-end dark:bg- border-t">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Item"
            )}
          </Button>
        </footer>
      </motion.div>
    </ScrollArea>
  );
};
