import { useState, useEffect } from "react"
import { Button, buttonVariants } from "../../../../components/ui/button.tsx"
import { Tree, TreeItem } from "../../../../components/ui/tree.tsx"
import { ChevronRight, ChevronDown, Edit, Trash, Globe2, List } from "lucide-react"
import { toast } from "../../../../components/ui/use-toast.ts"
import { Link, useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog.tsx"
import { motion } from "framer-motion"
import { Heading } from "../../../../components/ui/heading.tsx"
import { Separator } from "../../../../components/ui/separator.tsx"
import { Plus } from "lucide-react"
import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx"
import { cn } from "../../../../config/lib/utils.ts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip.tsx"
import useAuthStore from "../../../../store/authStore.ts"
import HighlightLoader from "../../../../components/highlightloader/HighLightLoader.tsx"
import { levelService } from "../../common/api/level-service.ts";

interface SphereItem {
  id: string
  name: string
  description: string
  type: "negocial" | "externa" | "BUILT_IN" | "BUSINESS" | "EXTERNAL"
  parent?: {
    id: number
    name: string
  } | null
  children?: SphereItem[]
  isBuiltIn?: boolean
  sigla?: string
  uuid?: string
  externalUrl?: string
}

const BUILT_IN_SPHERES = ["FEDERAL", "ESTADUAL", "MUNICIPAL"]

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Gerenciar esferas", link: "/dashboard/levels" },
]

// Função para obter o nome amigável do tipo
const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case "BUSINESS":
      return "Negocial"
    case "EXTERNAL":
      return "Externa"
    case "BUILT_IN":
      return "Interna"
    default:
      return type
  }
}

export default function Levels() {
  const [spheres, setSpheres] = useState<SphereItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>()
    BUILT_IN_SPHERES.forEach((sphere) => initialExpanded.add(sphere))
    return initialExpanded
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sphereToDelete, setSphereToDelete] = useState<SphereItem | null>(null)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) fetchSpheres();
  }, [isAuthenticated]);

  const fetchSpheres = async () => {
    try {
      setLoading(true)
      const data = await levelService.getLevels(1, 100, "id", "ASC")

      if (!data) {
        throw new Error("Falha ao carregar esferas")
      }

      // Transformar os dados da API para o formato esperado pelo componente
      const spheresData: SphereItem[] = data.items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || "",
        type: item.type as "negocial" | "externa" | "BUILT_IN" | "BUSINESS" | "EXTERNAL", // Cast type to match SphereItem
        parent: item.parent
          ? {
              id: item.parent.id,
              name: item.parent.name,
            }
          : null,
        isBuiltIn: item.type === "BUILT_IN",
        sigla: item.sigla,
        uuid: item.uuid,
        externalUrl: item.externalUrl,
      }))

      const spheresWithBuiltInFlag = spheresData.map((sphere) => ({
        ...sphere,
        isBuiltIn: sphere.type === "BUILT_IN" || BUILT_IN_SPHERES.includes(sphere.name),
      }))

      const treeStructure = buildTreeStructure(spheresWithBuiltInFlag)
      setSpheres(treeStructure)

      // Expandir inicialmente as esferas built-in
      setExpandedItems((prev) => {
        const next = new Set(prev)
        spheresWithBuiltInFlag.forEach((sphere) => {
          if (sphere.isBuiltIn) {
            next.add(sphere.id)
          }
        })
        return next
      })

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro enquanto as esferas eram carregadas")
      console.error("Erro ao carregar esferas:", err)
    } finally {
      setLoading(false)
    }
  }

  const buildTreeStructure = (items: SphereItem[]): SphereItem[] => {
    const itemMap = new Map<string, SphereItem>()

    // Primeiro, criar cópias de todos os itens no mapa
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] })
    })

    const rootItems: SphereItem[] = []

    // Depois, organizar a estrutura pai-filho
    items.forEach((item) => {
      if (!item.parent) {
        // Item raiz
        rootItems.push(itemMap.get(item.id)!)
      } else if (itemMap.has(item.parent.id.toString())) {
        // Item com pai válido
        const parent = itemMap.get(item.parent.id.toString())!
        parent.children = parent.children || []
        parent.children.push(itemMap.get(item.id)!)
      } else {
        // Item com pai inválido, tratar como raiz
        rootItems.push(itemMap.get(item.id)!)
      }
    })

    const sortItems = (items: SphereItem[]): SphereItem[] => {
      return items
        .sort((a, b) => {
          if (a.isBuiltIn && b.isBuiltIn) {
            // Ordenar esferas built-in conforme a ordem em BUILT_IN_SPHERES
            const aIndex = BUILT_IN_SPHERES.indexOf(a.name)
            const bIndex = BUILT_IN_SPHERES.indexOf(b.name)
            if (aIndex >= 0 && bIndex >= 0) {
              return aIndex - bIndex
            }
            // Se não estiver na lista, ordenar por nome
            return a.name.localeCompare(b.name)
          }
          if (a.isBuiltIn) return -1
          if (b.isBuiltIn) return 1
          return a.name.localeCompare(b.name)
        })
        .map((item) => ({
          ...item,
          children: item.children ? sortItems(item.children) : [],
        }))
    }

    return sortItems(rootItems);
  }

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  const handleDelete = (item: SphereItem) => {
    if (item.isBuiltIn) {
      toast({ title: "Erro", description: "Esferas built-in não podem ser excluídas", variant: "destructive" })
      return
    }

    setSphereToDelete(item)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!sphereToDelete) return

    try {
      const success = await levelService.deleteLevel(sphereToDelete.id)

      if (success) {
        toast({
          title: "Sucesso",
          description: `Esfera "${sphereToDelete.name}" excluída com sucesso!`,
        })
        await fetchSpheres() // Atualizar a lista após a exclusão
      } else {
        throw new Error("Falha ao excluir esfera")
      }
    } catch (err) {
      console.error("Erro ao excluir esfera:", err)
      toast({
        title: "Erro",
        description:
          "Não foi possível excluir a esfera. Verifique se ela não possui esferas filhas ou outros itens associados.",
        variant: "destructive",
      })
    } finally {
      setDeleteModalOpen(false)
      setSphereToDelete(null)
    }
  }

  const handleViewItems = async (item: SphereItem) => {
    try {
      // Implementar a verificação de itens para o endpoint real
      // Por enquanto, vamos manter o comportamento existente
      navigate(`/dashboard/levels/${item.id}/items`)
    } catch (error) {
      console.error("Erro ao verificar itens:", error)
      toast({
        title: "Aviso",
        description: "Não foi possível verificar os itens. Redirecionando para criar novo item.",
        variant: "default",
      })
      navigate(`/dashboard/levels/${item.id}/items/create`)
    }
  }

  const renderTree = (items: SphereItem[], level = 0) => {
    return (
      <Tree>
        {items.map((item) => (
          <TreeItem key={item.id}>

            <div className="flex items-center justify-between w-full pr-2  transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" style={{ paddingLeft: `${level * 20}px` }}>
              <div className="flex items-center h-16">
                {item.children && item.children.length > 0 ? (
                  <Button variant="ghost" size="icon" onClick={() => toggleExpand(item.id)}>
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  <div className="w-8" />
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Globe2 className="h-4 w-4 mr-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="capitalize">{getTypeDisplayName(item.type)}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>
                        {item.name}
                        {!item.isBuiltIn ? (
                          <span className="capitalize italic text-sm"> - {getTypeDisplayName(item.type)}</span>
                        ) : (
                          ""
                        )}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{item.description}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                {item.isBuiltIn || item.type === "BUSINESS" || item.type === "EXTERNAL" ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleViewItems(item)}>
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Ver itens</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                {item.isBuiltIn ? (
                  <>
                    <Button variant="ghost" size="icon" disabled>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dashboard/levels/create?id=${item.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <hr className="absolute left-0 w-full h-[1px] bg-[#b3b3b3]" />
            {item.children && item.children.length > 0 && expandedItems.has(item.id) && (
              <div>{renderTree(item.children, level + 1)}</div>
            )}
          </TreeItem>
        ))}
      </Tree>
    )
  }


  if (loading) return <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center"><HighlightLoader /> </div>
  if (error) return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Erro: {error}</div>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
      className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={`Esferas`} description="" />
        <Link to="/dashboard/levels/create" className={cn(buttonVariants({ variant: "default" }))}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar nova esfera
        </Link>
      </div>

      <Separator />

      <div className="w-full max-w-content-container m-auto">
        <div className="rounded-md border border-[#b3b3b3] relative mb-10">
          <div className=" w-full  flex justify-between items-center px-4 h-[48px] border-b border-b3b3b3">
            <p className="uppercase font-medium text-muted-foreground">Nome</p>
            <p className="uppercase font-medium text-muted-foreground">Ações</p>
          </div>
          {spheres.length > 0 ? <div className="">{renderTree(spheres)}</div> : <p>Nenhuma esfera encontrada.</p>}
        </div>

        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>
              Tem certeza que deseja excluir a esfera
              {sphereToDelete && <strong> "{sphereToDelete.name}"</strong>}?
            </p>
            <p className="mt-2">Esta ação não pode ser desfeita. A esfera será permanentemente removida do sistema.</p>
            <p className="mt-2 text-red-500 font-semibold">
              Atenção: Certifique-se de que esta esfera não possui esferas filhas ou outros itens associados.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* <Globe />  */}
    </motion.div>
  )
}





