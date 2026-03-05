import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "@common/components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { Separator } from "@common/external/ui/separator.tsx";
import { motion } from "framer-motion";
import { toast } from "@common/external/ui/use-toast.ts";
import { Label } from "@common/external/ui/label.tsx";
import { Input } from "@common/external/ui/input.tsx";
import { Button } from "@common/external/ui/button.tsx";
import { Textarea } from "@common/external/ui/textarea.tsx";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../../../../common/external/ui/tooltip.tsx";
import { AlertCircle, Loader2 } from "lucide-react";
import HighlightLoader from "@common/components/loading/HighLightLoader.tsx";
import { levelService } from "@features/level/common/api/level-service.ts";
import { LevelInterface } from "@features/level/common/types/level.model.ts";
import { LevelItemInterface } from "@features/level/common/types/level-item.model.ts";
import DynamicSphereForm from "@features/level/common/components/DynamicSphereForm.tsx";
import { goToPreviousRoute } from "@common/utils/NavigationStateManager.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";

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
      await levelService.createLevelItem(levelId!, {
        name: data.name,
        description: data.description,
        externalCode: data.externalCode,
        parentId: data.parentId ? Number(data.parentId) : undefined
      });

      toast({ title: "Sucesso", description: "Item adicionado com sucesso!" });
      navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(':id', levelId!));
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
      <div>
        <HighlightLoader />
      </div>
    );
  }

  const breadcrumbItems = [
    { title: "Gerenciar esferas", link: PRIVATE_ROUTES.LEVELS },
    { title: "Itens", link: PRIVATE_ROUTES.LEVEL_ITEMS.replace(':id', levelId!) },
    { title: "Criar item", link: "" }
  ];

  return (
    <ScrollArea>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div>
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div>
              <Heading
                title={`Criar item`}
                returnButton={true}
                onReturnClick={() => goToPreviousRoute(navigate)}
                customDescription={
                  <span>
                    Esfera: <span className="text-primary-600">{level?.name}</span>
                  </span>
                }
              />
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea>
          <div className="max-w-content-container m-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-content-container m-auto">
              <div>
                <div>
                  <div>
                    <Label htmlFor="name">Nome <span className="text-primary-600">*</span></Label>
                    <div>
                      <Input
                        id="name"
                        placeholder="Escreva o nome do item"
                        className={errors.name ? "border-red-500" : ""}
                        {...register("name", {
                          required: "Nome é obrigatório",
                          minLength: { value: 3, message: "O nome deve conter no mínimo 3 caracteres" },
                        })}
                      />
                      {errors.name && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="text-red-500" />
                              </TooltipTrigger>
                            </Tooltip>
                          </TooltipProvider>
                          <p className="text-red-500">{errors.name.message}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="externalCode">Código <span className="text-primary-600">*</span></Label>
                    <div>
                      <Input
                        id="externalCode"
                        placeholder="Escreva o código do item"
                        className={errors.externalCode ? "border-red-500" : ""}
                        {...register("externalCode", {
                          required: "O Código é obrigatório",
                          minLength: { value: 3, message: "O código externo deve conter no mínimo 3 caracteres" },
                          pattern: { value: /^[a-zA-Z0-9-_]+$/, message: "O código não deve conter espaços em branco" }
                        })}
                      />
                      {errors.externalCode && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="text-red-500" />
                              </TooltipTrigger>
                            </Tooltip>
                          </TooltipProvider>
                          <p className="text-red-500">{errors.externalCode.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição <span className="text-primary-600">*</span></Label>
                  <div>
                    <Textarea
                      id="description"
                      placeholder="Escreva uma descrição para o item"
                      className={errors.description ? "border-red-500" : ""}
                      {...register("description", {
                        required: "Descrição é obrigatória",
                        minLength: { value: 3, message: "A descrição deve conter no mínimo 3 caracteres" }
                      })}
                    />
                    {errors.description && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="text-red-500" />
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-red-500">{errors.description.message}</p>
                      </>
                    )}
                  </div>
                </div>

                {level?.parent && (
                  <div>
                    <Label htmlFor="parentId">Selecione o item pai:</Label>
                    <Controller
                      name="parentId"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Item pai é obrigatório" }}
                      render={({ field }) => (
                        <div>
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

        <footer>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
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
