import * as z from "zod";
import type React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../../components/ui/form.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { useToast } from "../../../components/ui/use-toast.ts";
import { Switch } from "../../../components/ui/switch.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip.tsx";
import { AlertCircle } from "lucide-react";
import { clientService } from "../common/service/client-service.ts";

const formSchema = z.object({
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
  managed: z.boolean().default(false)
});

interface SystemFormProps {
  initialData: any | null;
  readonly: boolean;
}

export const SystemForm: React.FC<SystemFormProps> = ({ initialData, readonly }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  function getActionStyle() {
    if(readonly) {
      return "DETAIL";
    } else if(initialData && !readonly) {
      return "EDIT";
    } else {
      return "CREATE";
    }
  }

  const actionMap = {
    DETAIL: "",
    EDIT: "Salvar alterações",
    CREATE: "Adicionar sistema"
  };

  const defaultValues = initialData || {
    id: "",
    name: "",
    label: "",
    clientId: "",
    description: "",
    managed: false,
    baseUrl: "",
    status: ""
  };

  const onSubmit = async (form) => {
    try {
      setLoading(true);
      if(initialData?.id) {
        form = { ...form, id: initialData.id };
        await clientService.updateClient(initialData.id, form).then(() => {
          toast({
            title: "Sistema atualizado",
            description: "O sistema foi atualizado com sucesso"
          });
          navigate("/dashboard/systems/" + form.clientId + "/details");
        });
      } else {
        await clientService.createClient(form).then(() => {
          toast({
            title: "Sistema criado",
            description: "O sistema foi criado com sucesso"
          });
          navigate("/dashboard/systems/" + form.clientId + "/details");
        });
      }
    } catch (error: any) {
      if(error.response) {
        toast({
          title: "Erro ao realizar operação sistema",
          description: error.response.data.message,
          variant: "destructive"
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="">
            <div className="flex flex-col gap-y-4">
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Nome</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Nome do sistema"
                          {...field}
                          className={methods.formState.errors.name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.name && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle
                                className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.name?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Client Id</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="ClientId do IDP"
                          {...field}
                          className={methods.formState.errors.clientId ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.clientId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle
                                className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.clientId?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Descrição</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Descrição do sistema"
                          {...field}
                          className={methods.formState.errors.description ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.description && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.description?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="baseUrl"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Url</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Url do sistema"
                          {...field}
                          className={methods.formState.errors.baseUrl ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.baseUrl && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle
                                className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.baseUrl?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="managed"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">
                      Gerenciado <span className="italic text-sm">(opcional)</span>
                    </FormLabel>
                    <div
                      className="mb-2 flex flex-row items-center justify-between rounded-lg border border-primary p-4">
                      <div className="space-y-0.5">
                        <FormDescription>Ative para indicar que o sistema é gerenciado</FormDescription>
                      </div>
                      <div className="flex items-center">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                        </FormControl>
                        {methods.formState.errors.managed && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{methods.formState.errors.managed?.message?.toString()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">
                      Status <span className="italic text-sm">(opcional)</span>
                    </FormLabel>
                    <div className="flex flex-row items-center justify-between rounded-lg border border-primary p-4">
                      <div className="space-y-0.5">
                        <FormDescription>
                          {field.value === "published" ? "Sistema publicado" : "Sistema não publicado"}
                        </FormDescription>
                      </div>
                      <div className="flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value === "published"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "published" : "unpublished");
                            }}
                            disabled={loading}
                          />
                        </FormControl>
                        {methods.formState.errors.status && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{methods.formState.errors.status?.message?.toString()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="mt-10" />

          <div className="mt-6 flex justify-between">
            <Button className="" onClick={() => navigate(-1)} variant="ghost">
              Voltar
            </Button>
            {getActionStyle() === "DETAIL" ? null : (
              <Button disabled={loading} className="" type="submit">
                {actionMap[getActionStyle()]}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

