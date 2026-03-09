import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { toast } from "@common/external/ui/use-toast.ts";
import { Button } from "@common/external/ui/button.tsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import HighlightLoader from "@common/components/loading/HighLightLoader.tsx";
import { levelService } from "@features/level/common/api/level-service.ts";
import { LevelInterface } from "@features/level/common/types/level.model.ts";
import DynamicSphereForm from "@features/level/common/components/DynamicSphereForm.tsx";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import "./CreateItem.scss";

interface FormData {
  name: string;
  externalCode: string;
  description: string;
  parentId?: string;
}

export const CreateItem: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [level, setLevel] = useState<LevelInterface | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>();
  const { id: levelId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const descriptionValue = watch("description", "");

  const pageTitle = "Novo item";
  const pageDescription = "Preencha os dados para criar um novo item para a esfera selecionada.";

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
      navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(":id", levelId!));
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

    void initPage();
  }, [levelId]);

  if (loading) {
    return (
      <div className="create-item__loader">
        <HighlightLoader />
      </div>
    );
  }

  return (
    <motion.div
      className="create-item"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <HeaderContainer className="create-item__header-container">
        <div className="create-item__header">
          <div className="create-item__header-main">
            <button
              type="button"
              className="create-item__back-button"
              onClick={() => navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(":id", levelId!))}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="create-item__heading-content">
              <div className="create-item__title-row">
                <h2 className="create-item__title">{pageTitle}</h2>
              </div>
              <p className="create-item__description">{pageDescription}</p>
              <p className="create-item__context">
                Esfera: <span className="create-item__context-value">{level?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </HeaderContainer>

      <ScrollArea className="create-item__scroll-area" viewportClassName="create-item__scroll-viewport">
        <div className="create-item__content-wrapper">
          <form className="create-item__form" onSubmit={handleSubmit(onSubmit)}>
            <div className="create-item__card">
              <div className="create-item__card-content">
                <div className="create-item__row">
                  <div className="create-item__field">
                    <label className="create-item__label" htmlFor="name">
                      Nome <span className="create-item__required">*</span>
                    </label>
                    <input
                      id="name"
                      placeholder="Escreva o nome do item"
                      className={`app-input create-item__input${errors.name ? " create-item__input--error" : ""}`}
                      {...register("name", {
                        required: "Nome é obrigatório",
                        minLength: { value: 3, message: "O nome deve conter no mínimo 3 caracteres" },
                      })}
                    />
                    {errors.name && <p className="create-item__error">{errors.name.message}</p>}
                  </div>

                  <div className="create-item__field">
                    <label className="create-item__label" htmlFor="externalCode">
                      Código <span className="create-item__required">*</span>
                    </label>
                    <input
                      id="externalCode"
                      placeholder="Escreva o código do item"
                      className={`app-input create-item__input${errors.externalCode ? " create-item__input--error" : ""}`}
                      {...register("externalCode", {
                        required: "O Código é obrigatório",
                        minLength: { value: 3, message: "O código externo deve conter no mínimo 3 caracteres" },
                        pattern: { value: /^[a-zA-Z0-9-_]+$/, message: "O código não deve conter espaços em branco" }
                      })}
                    />
                    {errors.externalCode ? (
                      <p className="create-item__error">{errors.externalCode.message}</p>
                    ) : (
                      <p className="create-item__hint">Use apenas letras, números, hífen e sublinhado.</p>
                    )}
                  </div>
                </div>

                <div className="create-item__field">
                  <label className="create-item__label" htmlFor="description">
                    Descrição <span className="create-item__required">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder="Escreva uma descrição para o item"
                    maxLength={200}
                    className={`app-textarea create-item__textarea${errors.description ? " create-item__textarea--error" : ""}`}
                    {...register("description", {
                      required: "Descrição é obrigatória",
                      minLength: { value: 3, message: "A descrição deve conter no mínimo 3 caracteres" }
                    })}
                  />
                  {errors.description ? (
                    <p className="create-item__error">{errors.description.message}</p>
                  ) : (
                    <p className="create-item__counter">{descriptionValue.length}/200 caracteres</p>
                  )}
                </div>

                {level?.parent && (
                  <div className="create-item__field">
                    <label className="create-item__label" htmlFor="parentId">
                      Selecione o item pai <span className="create-item__required">*</span>
                    </label>
                    <Controller
                      name="parentId"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Item pai é obrigatório" }}
                      render={({ field }) => (
                        <div className="create-item__sphere-wrapper">
                          <DynamicSphereForm
                            initialId={level.parent!.id}
                            simpleLabel={true}
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
                    {errors.parentId && <p className="create-item__error">{errors.parentId.message}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="create-item__actions">
              <Button
                type="submit"
                className="create-item__action-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="create-item__spinner" />
                    Criando...
                  </>
                ) : (
                  "Criar item"
                )}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
