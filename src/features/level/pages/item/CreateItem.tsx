import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useAuthStore from "../../../../store/authStore.ts"

import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx"
import { Heading } from "../../../../components/ui/heading.tsx"
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx"
import { Separator } from "../../../../components/ui/separator.tsx"
import { motion } from "framer-motion"
import { toast } from "../../../../components/ui/use-toast.ts"
import { Label } from "../../../../components/ui/label.tsx"
import { Input } from "../../../../components/ui/input.tsx"
import { Button } from "../../../../components/ui/button.tsx"
import { Textarea } from "../../../../components/ui/textarea.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.tsx"
import HighlightLoader from "../../../../components/highlightloader/HighLightLoader.tsx"
import { levelService } from "../../common/api/level-service.ts";

interface Sphere {
  id: string
  name: string
  type: string
  parent?: {
    id: number
    name: string
  } | null
}

interface ParentItem {
  id: number
  name: string
  parentId?: number
}

interface SphereHierarchy {
  id: string
  name: string
  parent?: {
    id: number
    name: string
  } | null
}

export const CreateItem = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated)
  const [sphere, setSphere] = useState<Sphere | null>(null)
  const [loading, setLoading] = useState(true)
  const [parentItems, setParentItems] = useState<ParentItem[]>([])
  const [hierarchyItems, setHierarchyItems] = useState<Record<string, ParentItem[]>>({})
  const [selectedHierarchyItems, setSelectedHierarchyItems] = useState<Record<string, string | null>>({})
  const [selectedParentItem, setSelectedParentItem] = useState<string | null>(null)
  const [parentSphere, setParentSphere] = useState<Sphere | null>(null)
  const [sphereHierarchy, setSphereHierarchy] = useState<SphereHierarchy[]>([])
  // Novo estado para armazenar a relação entre itens pai e filhos
  const [itemRelationships, setItemRelationships] = useState<Record<string, ParentItem[]>>({})

  const { id: sphereId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [externalCode, setExternalCode] = useState("")
  const [isBuiltIn, setIsBuiltIn] = useState(false)

  useEffect(() => {
    if (isAuthenticated && sphereId) {
      checkSphereType()
    }
  }, [isAuthenticated, sphereId])

  // Modificar o método checkSphereType para redirecionar se for uma esfera externa
  // e para buscar a hierarquia de esferas
  const checkSphereType = async () => {
    if (!sphereId) return

    try {
      setLoading(true)
      const sphereData = await levelService.getLevelById(sphereId)

      if (!sphereData) {
        throw new Error("Falha ao carregar dados da esfera")
      }

      // Se for uma esfera externa, redirecionar para a listagem com uma mensagem
      if (sphereData.type === "EXTERNAL") {
        toast({
          title: "Informação",
          description:
            "Esferas externas não permitem a criação direta de itens. Os itens são gerenciados pelo sistema externo.",
          variant: "default",
        })
        navigate(`/dashboard/levels/${sphereId}/items`)
        return
      }

      setIsBuiltIn(sphereData.type === "BUILT_IN")
      setSphere({
        id: sphereData.id.toString(),
        name: sphereData.name,
        type: sphereData.type,
        parent: sphereData.parent,
      })

      // Buscar a hierarquia completa da esfera atual
      const hierarchy = await fetchSphereHierarchy(sphereId)
      setSphereHierarchy(hierarchy)

      // Se a esfera atual tem um pai, buscar os itens do pai
      if (sphereData.parent) {
        setParentSphere({
          id: sphereData.parent.id.toString(),
          name: sphereData.parent.name,
          type: "", // Não temos essa informação aqui, mas não é necessária
          parent: null,
        })

        // Buscar os itens da esfera pai
        await fetchParentItems(sphereData.parent.id.toString())
      }

      setLoading(false)
    } catch (error) {
      console.error("Error checking sphere type:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados da esfera",
        variant: "destructive",
      })
      navigate("/dashboard/levels")
    }
  }

  // Modificar a função fetchSphereHierarchy para garantir que todos os itens sejam carregados
  const fetchSphereHierarchy = async (sphereId: string): Promise<SphereHierarchy[]> => {
    const hierarchy: SphereHierarchy[] = []
    let currentId = sphereId
    const newHierarchyItems: Record<string, ParentItem[]> = {}
    const newSelectedItems: Record<string, string | null> = {}
    const newItemRelationships: Record<string, ParentItem[]> = {}

    while (currentId) {
      try {
        const sphere = await levelService.getLevelById(currentId)
        if (!sphere) break

        hierarchy.unshift({
          id: sphere.id.toString(),
          name: sphere.name,
          parent: sphere.parent
            ? {
              id: sphere.parent.id,
              name: sphere.parent.name,
            }
            : null,
        })

        // Buscar os itens desta esfera - aumentar pageSize para 5000 para garantir que todos os itens sejam carregados
        try {
          const itemsData = await levelService.getLevelItems(sphere.id.toString(), 1, 5568, "name", "ASC")
          if (itemsData && itemsData.items) {
            console.log(`Carregados ${itemsData.items.length} itens para a esfera ${sphere.name} (${sphere.id})`)

            // Armazenar os itens com suas relações de parentesco
            const items = itemsData.items.map((item) => ({
              id: item.id,
              name: item.name,
              parentId: item.parent?.id || item.parentId || null,
            }))

            newHierarchyItems[sphere.id.toString()] = items

            // Organizar os itens por parentId para facilitar a filtragem
            items.forEach((item) => {
              if (item.parentId) {
                const parentKey = item.parentId.toString()
                if (!newItemRelationships[parentKey]) {
                  newItemRelationships[parentKey] = []
                }
                newItemRelationships[parentKey].push(item)
              }
            })
          } else {
            newHierarchyItems[sphere.id.toString()] = []
          }
          // Inicializar o item selecionado como null
          newSelectedItems[sphere.id.toString()] = null
        } catch (itemError) {
          console.error(`Erro ao buscar itens da esfera ${sphere.id}:`, itemError)
          newHierarchyItems[sphere.id.toString()] = []
          newSelectedItems[sphere.id.toString()] = null
        }

        currentId = sphere.parent ? sphere.parent.id.toString() : ""
      } catch (error) {
        console.error(`Erro ao buscar esfera ${currentId}:`, error)
        break
      }
    }

    // Atualizar os estados com os itens buscados
    setHierarchyItems(newHierarchyItems)
    setSelectedHierarchyItems(newSelectedItems)
    setItemRelationships(newItemRelationships)

    // Log para depuração
    console.log(
      "Hierarquia de esferas:",
      hierarchy.map((h) => `${h.name} (${h.id})`),
    )
    console.log(
      "Total de itens por esfera:",
      Object.entries(newHierarchyItems).map(
        ([key, items]) => `${hierarchy.find((h) => h.id === key)?.name || key}: ${items.length} itens`,
      ),
    )

    // Log para verificar as relações entre itens
    console.log("Total de relações pai-filho:", Object.keys(newItemRelationships).length)

    // Verificar alguns estados específicos para depuração
    const estadosParaVerificar = ["Roraima", "São Paulo", "Rio de Janeiro", "Minas Gerais"]
    estadosParaVerificar.forEach((estado) => {
      const estadoItem = Object.values(newHierarchyItems)
        .flat()
        .find((item) => item.name === estado)

      if (estadoItem) {
        const municipios = newItemRelationships[estadoItem.id.toString()] || []
        console.log(`Estado ${estado} (ID: ${estadoItem.id}) tem ${municipios.length} municípios`)
      }
    })

    return hierarchy
  }

  // Modificar a função fetchParentItems para buscar todos os itens
  const fetchParentItems = async (parentSphereId: string) => {
    try {
      setLoading(true)
      const itemsData = await levelService.getLevelItems(parentSphereId, 1, 1000, "name", "ASC")

      if (itemsData && itemsData.items) {
        setParentItems(
          itemsData.items.map((item) => ({
            id: item.id,
            name: item.name,
            parentId: item.parent?.id || item.parentId || null,
          })),
        )
      } else {
        setParentItems([])
      }
    } catch (error) {
      console.error("Error fetching parent items:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar itens da esfera pai",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Modificar a função handleHierarchyItemSelect para filtrar os itens das esferas inferiores
  const handleHierarchyItemSelect = (sphereId: string, itemId: string | null) => {
    // Atualizar o item selecionado para esta esfera
    setSelectedHierarchyItems((prev) => ({
      ...prev,
      [sphereId]: itemId,
    }))

    // Se o usuário desmarcar um item, limpar todas as seleções de esferas de nível inferior
    if (itemId === null) {
      const updatedSelections = { ...selectedHierarchyItems }

      // Encontrar o índice desta esfera na hierarquia
      const sphereIndex = sphereHierarchy.findIndex((s) => s.id === sphereId)

      // Limpar seleções de todas as esferas abaixo desta na hierarquia
      if (sphereIndex >= 0) {
        sphereHierarchy.forEach((sphere, index) => {
          if (index > sphereIndex) {
            updatedSelections[sphere.id] = null
          }
        })
      }

      setSelectedHierarchyItems(updatedSelections)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!sphereId) {
        throw new Error("ID da esfera não encontrado")
      }

      // Preparar dados para criação
      const itemData: any = {
        name,
        description,
        externalCode,
      }

      // Verificar se há itens selecionados na hierarquia
      const selectedItems = Object.entries(selectedHierarchyItems)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => ({ sphereId: key, itemId: value }))

      // Se houver pelo menos um item selecionado, usar o último como parentId
      if (selectedItems.length > 0) {
        // Ordenar os itens conforme a hierarquia (do mais alto para o mais baixo)
        const orderedItems = selectedItems.sort((a, b) => {
          const aIndex = sphereHierarchy.findIndex((s) => s.id === a.sphereId)
          const bIndex = sphereHierarchy.findIndex((s) => s.id === b.sphereId)
          return aIndex - bIndex
        })

        // Usar o último item (mais próximo da esfera atual) como parent
        const lastItem = orderedItems[orderedItems.length - 1]
        if (lastItem && lastItem.itemId) {
          itemData.parentId = Number.parseInt(lastItem.itemId)
        }
      } else if (selectedParentItem) {
        // Manter compatibilidade com o código existente
        itemData.parentId = Number.parseInt(selectedParentItem)
      }

      console.log("Enviando dados para criação:", JSON.stringify(itemData, null, 2))

      // Chamar o endpoint real para criar o item
      const result = await levelService.createLevelItem(sphereId, itemData)

      if (!result) {
        throw new Error("Falha ao adicionar o item")
      }

      toast({
        title: "Sucesso",
        description: "Item adicionado com sucesso!",
      })

      // Limpar o formulário e navegar de volta
      setName("")
      setDescription("")
      setExternalCode("")
      setSelectedParentItem(null)
      setSelectedHierarchyItems({})

      navigate(`/dashboard/levels/${sphereId}/items`)
    } catch (error) {
      console.error("Error adding item:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao adicionar o item. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Modificar a função getFilteredItems para melhorar a lógica de filtragem
  const getFilteredItems = (sphereId: string, index: number) => {
    // Se for a primeira esfera na hierarquia, mostrar todos os itens
    if (index === 0) {
      return hierarchyItems[sphereId] || []
    }

    // Para as esferas subsequentes, verificar se há uma seleção na esfera anterior
    const previousSpheres = sphereHierarchy.slice(0, index)
    const lastSelectedSphere = previousSpheres[previousSpheres.length - 1]

    if (!lastSelectedSphere) {
      return []
    }

    const selectedItemId = selectedHierarchyItems[lastSelectedSphere.id]

    // Se não há item selecionado na esfera anterior, não mostrar itens
    if (!selectedItemId || selectedItemId === "-1") {
      return []
    }

    // Filtrar os itens que têm o item selecionado como pai
    const filteredItems = itemRelationships[selectedItemId] || []

    return filteredItems
  }

  // Modificar o renderSphereHierarchy para adicionar mais informações de depuração
  const renderSphereHierarchy = () => {
    if (sphereHierarchy.length <= 1) return null // Não mostrar se só tiver a esfera atual

    // Remover a esfera atual da hierarquia para mostrar
    const parentHierarchy = [...sphereHierarchy]
    parentHierarchy.pop()

    if (parentHierarchy.length === 0) return null

    return (
      <div className="">
        <div className="space-y-4">
          {parentHierarchy.map((sphere, index) => {
            // Verificar se todas as esferas anteriores têm itens selecionados
            const isEnabled =
              index === 0 ||
              parentHierarchy
                .slice(0, index)
                .every((s) => selectedHierarchyItems[s.id] !== null && selectedHierarchyItems[s.id] !== undefined)

            // Obter os itens filtrados para esta esfera
            const filteredItems = getFilteredItems(sphere.id, index)

            // Obter o total de itens disponíveis para esta esfera
            const totalItems = hierarchyItems[sphere.id]?.length || 0

            return (
              <div key={sphere.id} className="mb-2">
                <Label className="text-base font-medium">
                  Selecione um item da esfera {sphere.name}
                  {index === 0 && <span className="text-xs text-gray-500 ml-1">({totalItems} itens disponíveis)</span>}
                  {index > 0 && selectedHierarchyItems[parentHierarchy[index - 1].id] && (
                    <span className="text-xs text-gray-500 ml-1">({filteredItems.length} itens disponíveis)</span>
                  )}
                </Label>
                <div className="mt-1">
                  <Select
                    value={selectedHierarchyItems[sphere.id] || ""}
                    onValueChange={(value) => handleHierarchyItemSelect(sphere.id, value === "" ? null : value)}
                    disabled={!isEnabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Selecione um item da esfera ${sphere.name}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="-1">Nenhum</SelectItem>
                      {filteredItems.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {index > 0 && filteredItems.length === 0 && selectedHierarchyItems[parentHierarchy[index - 1].id] && (
                    <p className="text-sm text-amber-600 mt-1">Não há itens disponíveis para a seleção atual.</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Esferas", link: "/dashboard/levels" },
    { title: sphere?.name || "", link: `/dashboard/levels/${sphereId}/items` },
    { title: "Criar novo item", link: "" },
  ]

  if (loading) {
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />{" "}
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-full ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
          className="flex-1 space-y-4 p-4 pt-6 md:p-8">

          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-start justify-between">
            <Heading title={`Criar novo item na Esfera: ${sphere?.name}`} description="Gerenciar esferas." />
          </div>

          <Separator className="" />

          <form onSubmit={handleSubmit} className="w-full flex flex-row">
            <div className="w-full flex flex-col">
              <Label className="text-xl font-bold mb-4">Informações gerais do item</Label>
              <div className="flex flex-col gap-4">
                <div>
                  <Label className="text-base font-semibold" htmlFor="name">Nome</Label>
                  <Input
                    placeholder="Escreva o nome do item"
                    className="mt-2"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />
                </div>
                <div>
                  <Label className="text-base font-semibold" htmlFor="description">Descrição</Label>
                  <Textarea
                    placeholder="Escreva uma descrição para o item"
                    className="resize-none mt-2"
                    rows={6}
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required/>
                </div>
                <div>
                  <Label className="text-base font-semibold" htmlFor="externalCode">Código externo</Label>
                  <Input
                    placeholder="Escreva o código externo do item"
                    id="externalCode"
                    className="mt-2"
                    value={externalCode}
                    onChange={(e) => setExternalCode(e.target.value)}
                    required/>
                </div>
              </div>
            </div>
            <Separator orientation="vertical" className="mx-6 h-auto" />
            <div className="w-full flex flex-col">
              <Label className="text-xl font-bold mb-4">Selecione os itens da hierarquia de níveis</Label>
              { renderSphereHierarchy() }
            </div>
          </form>
        </motion.div>
        <div className="flex flex-row gap-2 px-4">
          <Button className="mr-2" onClick={() => navigate(-1)} variant="ghost">Voltar</Button>
          <Button type="submit">Adicionar Item</Button>
        </div>
      </ScrollArea>
    </>
  )
}

