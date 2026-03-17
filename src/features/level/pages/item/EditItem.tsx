import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { toast } from "@common/external/ui/use-toast.ts";
import { Button } from "@common/external/ui/button.tsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SectionLoader } from "@common/components/loading/section-loader/SectionLoader.tsx";
import { levelService } from "@features/level/common/api/level-service.ts";
import { LevelInterface } from "@features/level/common/types/level.model.ts";
import DynamicSphereForm from "@features/level/common/components/DynamicSphereForm.tsx";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { goToPreviousRoute } from "@common/utils/NavigationStateManager.ts";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import { CreateLevelItemData } from "@features/level/common/types/level-item.model.ts";
import "./EditItem.scss";

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    clearErrors,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const { id: levelId, itemId } = useParams<{ id: string; itemId: string }>();
  const navigate = useNavigate();
  const descriptionValue = watch("description", "");

  const retrieveLevel = async (id: string) => {
    try {
      const levelResponse = await levelService.getLevelById(id);
      if(levelResponse && (levelResponse.type === "BUILT_IN" || levelResponse.type === "EXTERNAL")) {
        toast({
          title: "Ação não permitida",
          description: "Não é possível gerenciar itens de esferas do tipo Negocial ou Externa.",
          variant: "destructive"
        });
        goToPreviousRoute(navigate);
        return;
      }

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

  const loadItemData = async () => {
    if(!levelId || !itemId) return;

    try {
      const itemData = await levelService.getLevelItem(levelId, itemId);
      setValue("name", itemData.name || "");
      setValue("description", itemData.description || "");
      setValue("externalCode", itemData.externalCode || "");

      if(itemData.parent) {
        setValue("parentId", itemData.parent.id.toString());
      }
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao carregar dados do item",
        description: errorMessage,
        variant: "destructive"
      });
      goToPreviousRoute(navigate);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const payload: CreateLevelItemData = {
        name: data.name,
        description: data.description,
        externalCode: data.externalCode,
        parentId: data.parentId ? Number(data.parentId) : undefined
      };

      await levelService.updateLevelItem(levelId!, itemId!, payload);

      toast({ title: "Sucesso", description: "Item atualizado com sucesso!" });
      navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(":id", levelId!));
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao atualizar item",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      if(levelId) {
        await retrieveLevel(levelId);
        await loadItemData();
        setLoading(false);
      }
    };

    void initPage();
  }, [levelId, itemId]);

  if(loading) {
    return (
      <div className="edit-item__loader">
        <SectionLoader />
      </div>
    );
  }

  const pageTitle = "Editar item";
  const pageDescription = "Atualize os dados para editar o item da esfera selecionada.";

  return (
    <motion.div
      className="edit-item"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <HeaderContainer className="edit-item__header-container">
        <div className="edit-item__header">
          <div className="edit-item__header-main">
            <button
              type="button"
              className="edit-item__back-button"
              onClick={() => navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(":id", levelId!))}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="edit-item__heading-content">
              <div className="edit-item__title-row">
                <h2 className="edit-item__title">{pageTitle}</h2>
              </div>
              <p className="edit-item__description">{pageDescription}</p>
              <p className="edit-item__context">
                Esfera: <span className="edit-item__context-value">{level?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </HeaderContainer>

      <ScrollArea className="edit-item__scroll-area" viewportClassName="edit-item__scroll-viewport">
        <div className="edit-item__content-wrapper">
          <form className="edit-item__form" onSubmit={handleSubmit(onSubmit)}>
            <div className="edit-item__card">
              <div className="edit-item__card-content">
                <div className="edit-item__row">
                  <div className="edit-item__field">
                    <label className="edit-item__label" htmlFor="name">
                      Nome <span className="edit-item__required">*</span>
                    </label>
                    <input
                        id="name"
                        placeholder="Escreva o nome do item"
                        className={`app-input edit-item__input${errors.name ? " edit-item__input--error" : ""}`}
                        {...register("name", {
                          required: "Nome é obrigatório",
                          minLength: { value: 3, message: "O nome deve conter no mínimo 3 caracteres" }
                        })}
                      />
                    {errors.name && <p className="edit-item__error">{errors.name.message}</p>}
                  </div>

                  <div className="edit-item__field">
                    <label className="edit-item__label" htmlFor="externalCode">
                      Código <span className="edit-item__required">*</span>
                    </label>
                    <input
                        id="externalCode"
                        placeholder="Escreva o código do item"
                        className={`app-input edit-item__input${errors.externalCode ? " edit-item__input--error" : ""}`}
                        {...register("externalCode", {
                          required: "O código é obrigatório",
                          minLength: { value: 3, message: "O código deve conter no mínimo 3 caracteres" },
                          pattern: { value: /^[a-zA-Z0-9-_]+$/, message: "O código não deve conter espaços em branco" }
                        })}
                      />
                    {errors.externalCode ? (
                      <p className="edit-item__error">{errors.externalCode.message}</p>
                    ) : (
                      <p className="edit-item__hint">Use apenas letras, números, hífen e sublinhado.</p>
                    )}
                  </div>
                </div>

                <div className="edit-item__field">
                  <label className="edit-item__label" htmlFor="description">
                    Descrição <span className="edit-item__required">*</span>
                  </label>
                  <textarea
                      id="description"
                      placeholder="Escreva uma descrição para o item"
                      maxLength={200}
                      className={`app-textarea edit-item__textarea${errors.description ? " edit-item__textarea--error" : ""}`}
                      {...register("description", {
                        required: "Descrição é obrigatória",
                        minLength: { value: 3, message: "A descrição deve conter no mínimo 3 caracteres" }
                      })}
                    />
                  {errors.description ? (
                    <p className="edit-item__error">{errors.description.message}</p>
                  ) : (
                    <p className="edit-item__counter">{descriptionValue.length}/200 caracteres</p>
                  )}
                </div>

                {level?.parent && (
                  <div className="edit-item__field">
                    <label className="edit-item__label" htmlFor="parentId">
                      Selecione o item pai <span className="edit-item__required">*</span>
                    </label>
                    <Controller
                      name="parentId"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Item pai é obrigatório" }}
                      render={({ field }) => (
                        <div className="edit-item__sphere-wrapper">
                          <DynamicSphereForm
                            initialId={level.parent!.id}
                            simpleLabel={true}
                            codeItem={itemId}
                            onHierarchyNotCompleted={() => {
                              field.onChange("");
                            }}
                            onHierarchyComplete={(itemId) => {
                              field.onChange(itemId.toString());
                              clearErrors("parentId");
                            }}
                            hasError={!!errors.parentId}
                            onErrorClear={() => clearErrors("parentId")}
                          />
                        </div>
                      )}
                    />
                    {errors.parentId && <p className="edit-item__error">{errors.parentId.message}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="edit-item__actions">
              <Button
                type="submit"
                className="edit-item__action-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="edit-item__spinner" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar item"
                )}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
