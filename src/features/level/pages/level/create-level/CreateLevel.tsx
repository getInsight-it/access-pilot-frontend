import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { Input } from "../../../../../common/external/ui/input.tsx";
import { Label } from "../../../../../common/external/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "../../../../../common/external/ui/radio-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../common/external/ui/select.tsx";
import { Textarea } from "../../../../../common/external/ui/textarea.tsx";
import { Breadcrumbs } from "../../../../../common/components/breadcrumbs.tsx";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { Separator } from "../../../../../common/external/ui/separator.tsx";
import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import useAuthStore, { AuthState } from "../../../../../store/authStore.ts";
import HighlightLoader from "../../../../../common/components/loading/HighLightLoader.tsx";
import { motion } from "framer-motion";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { useCreateLevelData, useCreateLevelOperations } from "./useCreateLevel.ts";

export default function CreateOrEditLevel() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const formData = useCreateLevelData();
  const { handleSubmit } = useCreateLevelOperations(formData);
  const [errors, setErrors] = useState<{ name?: string; sigla?: string; description?: string; endpoint?: string; apiKey?: string }>({});

  const breadcrumbItems = [
    { title: "Gerenciar Esferas", link: PRIVATE_ROUTES.LEVELS },
    { title: formData.isEditing ? "Editar esfera" : "Criar esfera", link: "" }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      formData.initializeForm();
    }
  }, [isAuthenticated, formData.initializeForm]);

  if (formData.loading)
    return (
      <div>
        <HighlightLoader />{" "}
      </div>
    );

  const validateForm = (): boolean => {
    const newErrors: { name?: string; sigla?: string; description?: string; endpoint?: string; apiKey?: string } = {};
    const name = formData.name?.trim() || "";
    const sigla = formData.sigla?.trim() || "";
    const description = formData.description?.trim() || "";

    if (name.length < 3) {
      newErrors.name = "O nome da esfera deve conter no mínimo 3 caracteres";
    }

    const siglaRegex = /^[A-Za-z0-9]+$/;
    if (sigla.length === 0) {
      newErrors.sigla = "A sigla é obrigatória";
    } else if (!siglaRegex.test(sigla)) {
      newErrors.sigla = "A sigla deve conter apenas letras e números, sem espaços ou caracteres especiais.";
    }

    if (description.length < 3) {
      newErrors.description = "A descrição da esfera deve conter no mínimo 3 caracteres";
    }

    if (formData.type === "EXTERNAL") {
      const endpoint = formData.endpoint?.trim() || "";

      if (endpoint.length < 3) {
        newErrors.endpoint = "O endpoint é obrigatório para esferas externas.";
      }

      const apiKeyValue = formData.apiKey?.trim() || "";

      if(apiKeyValue.length === 0 && !formData.hasExistingApiKey) {
        newErrors.apiKey = "A API Key é obrigatória para esferas externas.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;
    handleSubmit(e);
  };

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
                title={formData.isEditing ? "Editar esfera" : "Nova esfera"}
                returnButton={true}
                onReturnClick={() => { navigate(PRIVATE_ROUTES.LEVELS); }}
                code={formData.sphereId}
              />
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea>
          <div className="max-w-content-container m-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(e); }} className="max-w-content-container m-auto">
              <div>
                <div>
                  <div>
                    <Label htmlFor="name">
                      Nome <span className="text-primary-600">*</span>
                    </Label>
                    <Input
                      className={errors.name ? "border-red-500" : ""}
                      id="name"
                      value={formData.name}
                      onChange={(e) => { formData.setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                      placeholder="Nome da esfera"
                      required
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="sigla">
                      Sigla <span className="text-primary-600">*</span>
                    </Label>
                    <Input
                      className={errors.sigla ? "border-red-500" : ""}
                      id="sigla"
                      value={formData.sigla}
                      onChange={(e) => { formData.setSigla(e.target.value); if (errors.sigla) setErrors(prev => ({ ...prev, sigla: undefined })); }}
                      placeholder="Sigla da esfera (ex: FED, EST)"
                      required />
                    {errors.sigla ? (
                      <p className="text-red-500">{errors.sigla}</p>
                    ) : (
                      <p>A sigla deve conter apenas letras e números, sem espaços ou caracteres especiais.</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="parentSphere">
                      Esfera pai <span className="text-primary-600">*</span>
                    </Label>
                    <div>
                      <Select
                        value={formData.parentId ?? "0"}
                        onValueChange={(value) => {
                          formData.setParentId(value);
                          const selectedSphere = formData.allSpheres.find((s) => s.id === value);
                          formData.setSelectedSphereName(value === "0" ? "Nenhuma (esfera pai)" : selectedSphere?.name || "");
                        }}
                        disabled={formData.isEditing && formData.hasItems}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a esfera pai">{formData.selectedSphereName}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Nenhuma (esfera pai)</SelectItem>
                          {formData.allSpheres.filter((s) => s.name !== formData.name).map((sphere) => (
                            <SelectItem key={sphere.id} value={sphere.id}>
                              {sphere.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.isEditing && formData.hasItems && (
                        <p className="text-blue-600">
                          A esfera pai não pode ser alterada porque esta esfera já possui itens.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    Descrição <span className="text-primary-600">*</span>
                  </Label>
                  <Textarea
                    placeholder="Escreva uma descrição para a esfera"
                    className="resize-none"
                    id="description"
                    value={formData.description}
                    onChange={(e) => { formData.setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: undefined })); }}
                    required
                    maxLength={200}
                  />
                  {errors.description ? (
                    <p className="text-red-500">{errors.description}</p>
                  ) : (
                    <div>{formData.description.length}/200 caracteres</div>
                  )}
                </div>

                <div>
                  <Label>
                    Tipo <span className="text-primary-600">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value: "BUSINESS" | "EXTERNAL") => {
                      formData.setType(value);

                      if (value !== "EXTERNAL") {
                        formData.setHasExistingApiKey(false);
                      }
                    }}
                    disabled={formData.isEditing}>
                    <div>
                      <RadioGroupItem value="BUSINESS" id="BUSINESS" disabled={formData.isEditing} />
                      <Label htmlFor="BUSINESS">Negocial</Label>
                    </div>
                    <div>
                      <RadioGroupItem value="EXTERNAL" id="EXTERNAL" disabled={formData.isEditing} />
                      <Label htmlFor="EXTERNAL">Externa</Label>
                    </div>
                  </RadioGroup>
                  {formData.isEditing && (
                    <p className="text-blue-600">O tipo da esfera não pode ser alterado após a criação.</p>
                  )}
                </div>

                {formData.type === "EXTERNAL" && (
                  <div>
                    <div>
                      <Label htmlFor="endpoint">
                        Endpoint <span className="text-primary-600">*</span>
                      </Label>
                      <Input
                        placeholder="https://api.exemplo.com"
                        className={errors.endpoint ? "border-red-500" : ""}
                        id="endpoint"
                        value={formData.endpoint}
                        onChange={(e) => { formData.setEndpoint(e.target.value); if (errors.endpoint) setErrors(prev => ({ ...prev, endpoint: undefined })); }}
                        required />
                      {errors.endpoint && <p className="text-red-500">{errors.endpoint}</p>}
                      <div>
                        <span><span className="bold text-primary-600 cursor-pointer font-bold">Clique aqui</span> Para mais informações sobre a criação do seu endpoint.</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="apiKey">
                        API Key <span className="text-primary-600">*</span>
                      </Label>
                      <Input
                        placeholder={formData.isEditing ? "Digite apenas para substituir a API Key existente" : "***************************"}
                        className={errors.apiKey ? "border-red-500" : ""}
                        id="apiKey"
                        value={formData.apiKey}
                        onChange={(e) => { formData.setApiKey(e.target.value); if (errors.apiKey) setErrors(prev => ({ ...prev, apiKey: undefined })); }}
                        required={!formData.isEditing} />
                      {errors.apiKey && <p className="text-red-500">{errors.apiKey}</p>}
                    </div>
                  </div>
                )}

              </div>
            </form>
          </div>
        </ScrollArea>

        <footer>
          <Button onClick={handleSave}>
            {formData.isEditing ? "Atualizar esfera" : "Criar esfera"}
          </Button>
        </footer>

      </motion.div>
    </ScrollArea>
  );
}
