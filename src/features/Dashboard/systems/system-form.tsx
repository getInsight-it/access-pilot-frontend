import * as z from "zod"
import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "../../../components/ui/input.tsx"
import { Button } from "../../../components/ui/button.tsx"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx"
import { Separator } from "../../../components/ui/separator.tsx"
import { useToast } from "../../../components/ui/use-toast.ts"
import { clientService } from "../../../services/client"
import { Switch } from "../../../components/ui/switch.tsx"
import { Textarea } from "../../../components/ui/textarea.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { AlertCircle } from "lucide-react"

const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string(),
})

export const IMG_MAX_LIMIT = 3

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  clientId: z
    .string()
    .min(3, { message: "O client Id do sistema deve conter no mínimo 3 caracteres" })
    .regex(/^[a-z][a-z0-9-]*$/, { message: "client Id deve ser separado por hífen" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  // status: z.string().min(1, {message: 'Selecione um status'}),
  // status: z.boolean().default(false),
  baseUrl: z
    .string()
    .min(3, { message: "O baseUrl do sistema deve conter no mínimo 3 caracteres" })
    .regex(/^(https|http?:\/\/)?([\w.-:?-]+)$/, { message: "baseUrl inválido" }),
  managed: z.boolean().default(false),
})

interface SystemFormProps {
  initialData: any | null
  onSuccessSubmit: () => any
  readonly: boolean
}

export const SystemForm: React.FC<SystemFormProps> = ({ initialData, onSuccessSubmit, readonly }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  //const description = descriptionMap[getActionStyle()];

  function getActionStyle() {
    if (readonly) {
      return "DETAIL"
    } else if (initialData && !readonly) {
      return "EDIT"
    } else {
      return "CREATE"
    }
  }

  const titleMap = {
    DETAIL: "Detalhes do sistema",
    EDIT: "Editar sistema",
    CREATE: "Adicionar sistema",
  }

  const actionMap = {
    DETAIL: "",
    EDIT: "Salvar alterações",
    CREATE: "Adicionar sistema",
  }

  const status = [
    { _id: "PUBLISHED", name: "Publicado" },
    { _id: "UNPUBLISHED", name: "Não Publicado" },
  ]

  const defaultValues = initialData || {
    id: "",
    name: "",
    label: "",
    clientId: "",
    description: "",
    managed: false,
    baseUrl: "",
    status: "",
  }

  const onSubmit = async (form) => {
    try {
      setLoading(true)
      if (initialData?.id) {
        form = { ...form, id: initialData.id }
        await clientService.updateClient(initialData.id, form).then(() => {
          toast({
            title: "Sistema atualizado",
            description: "O sistema foi atualizado com sucesso",
          })
          navigate("/dashboard/systems/" + form.clientId + "/details")
        })
      } else {
        await clientService.createClient(form).then(() => {
          toast({
            title: "Sistema criado",
            description: "O sistema foi criado com sucesso",
          })
          navigate("/dashboard/systems/" + form.clientId + "/details")
        })
      }
    } catch (error: any) {
      if (error.response) {
        toast({
          title: "Erro ao realizar operação sistema",
          description: error.response.data.message,
          variant: "destructive",
        })
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  return (
    <>
      {/* <div className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <h2 className="text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
            {titleMap[getActionStyle()]}
          </h2>

          <p>
            {description}
          </p>
        </div>
      </div> */}

      {/* <Separator/> */}
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
                              <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.name?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {/* <FormMessage /> */}
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
                              <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.clientId?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {/* <FormMessage /> */}
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
                    {/* <FormMessage /> */}
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
                              <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.baseUrl?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* <FormField
                name="managed"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Gerenciado</FormLabel>
                    <FormControl className="flex flex-col">
                      <Checkbox
                        className="w-10 h-10 grid items-center"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              /> */}

              <FormField
                control={methods.control}
                name="managed"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">
                      Gerenciado <span className="italic text-sm">(opcional)</span>
                    </FormLabel>
                    <div className="mb-2 flex flex-row items-center justify-between rounded-lg border border-primary p-4">
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

              {/* <FormField
                name="status"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Status</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecione um status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {status.map((status) => (
                          <SelectItem key={status._id} value={status._id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
              /> */}

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
                              field.onChange(checked ? "published" : "unpublished")
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
  )
}

