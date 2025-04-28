"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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
import useAuthStore from "../../../../store/authStore.ts"
import { Loader2 } from "lucide-react"
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

interface ItemData {
  id: number
  name: string
  description: string
  status: string
  externalCode: string
  parent?: {
    id: number
    name: string
  }
  parentId?: number
}

export const EditItem = () => {
  const navigate = useNavigate()
  const { id: sphereId, itemId } = useParams<{ id: string; itemId: string }>()
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated)

  const [sphere, setSphere] = useState<Sphere | null>(null)
  const [isBuiltIn, setIsBuiltIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [parentItems, setParentItems] = useState<ParentItem[]>([])
  const [selectedParentItem, setSelectedParentItem] = useState<string | null>(null)
  const [originalParentItem, setOriginalParentItem] = useState<string | null>(null)
  const [parentSphere, setParentSphere] = useState<Sphere | null>(null)
  const [sphereHierarchy, setSphereHierarchy] = useState<SphereHierarchy[]>([])

  // Novos estados para gerenciar a hierarquia de itens
  const [hierarchyItems, setHierarchyItems] = useState<Record<string, ParentItem[]>>({})
  const [selectedHierarchyItems, setSelectedHierarchyItems] = useState<Record<string, string | null>>({})
  const [originalHierarchyItems, setOriginalHierarchyItems] = useState<Record<string, string | null>>({})
  // Novo estado para armazenar a relação entre itens pai e filhos
  const [itemRelationships, setItemRelationships] = useState<Record<string, ParentItem[]>>({})

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    externalCode: "",
  })

  // Original data for comparison
  const [originalData, setOriginalData] = useState({
    name: "",
    description: "",
    status: "",
    externalCode: "",
  })

  // Fetch sphere and item data
  useEffect(() => {
    if (isAuthenticated && sphereId && itemId) {
      fetchData()
    }
  }, [isAuthenticated, sphereId, itemId])

  // Modificar o método fetchData para sempre usar a hierarquia atual da esfera
  const fetchData = async () => {
    if (!sphereId || !itemId) return

    try {
      setLoading(true)

      // Fetch sphere data
      const sphereData = await levelService.getLevelById(sphereId)
      if (!sphereData) {
        throw new Error("Falha ao carregar dados da esfera")
      }

      // Se for uma esfera externa, redirecionar para a listagem com uma mensagem
      if (sphereData.type === "EXTERNAL") {
        toast({
          title: "Informação",
          description:
            "Esferas externas não permitem a edição direta de itens. Os itens são gerenciados pelo sistema externo.",
          variant: "default",
        })
        navigate(`/dashboard/levels/${sphereId}/items`)
        return
      }

      setSphere({
        id: sphereData.id.toString(),
        name: sphereData.name,
        type: sphereData.type,
        parent: sphereData.parent,
      })

      setIsBuiltIn(sphereData.type === "BUILT_IN")

      // Buscar a hierarquia completa da esfera atual
      const hierarchy = await fetchSphereHierarchy(sphereId)
      setSphereHierarchy(hierarchy)

      // IMPORTANTE: Sempre configurar o parentSphere com base na hierarquia atual da esfera
      // e não na relação pai do item (que pode estar desatualizada)
      if (sphereData.parent) {
        setParentSphere({
          id: sphereData.parent.id.toString(),
          name: sphereData.parent.name,
          type: "", // Não temos essa informação aqui, mas não é necessária
          parent: null,
        })

        // Buscar os itens da esfera pai atual
        await fetchParentItems(sphereData.parent.id.toString())
      } else {
        // Se a esfera não tem pai, limpar os estados relacionados
        setParentSphere(null)
        setParentItems([])
      }

      // Fetch item data using the real endpoint
      const itemData = await levelService.getLevelItem(sphereId, itemId)

      if (!itemData) {
        throw new Error("Falha ao carregar dados do item")
      }

      // Set both form and original data
      const data = {
        name: itemData.name || "",
        description: itemData.description || "",
        status: itemData.status || "",
        externalCode: itemData.externalCode || "",
      }

      setFormData(data)
      setOriginalData(data)

      // Se o item tem um parent, configurar o selectedParentItem
      if (itemData.parent) {
        setOriginalParentItem(itemData.parent.id.toString())
        setSelectedParentItem(itemData.parent.id.toString())

        // Verificar se o parent do item pertence à esfera pai atual
        // Se não pertencer, isso significa que a hierarquia mudou
        if (sphereData.parent && itemData.parent.id.toString() !== sphereData.parent.id.toString()) {
          // Mostrar um aviso ao usuário
          toast({
            title: "Atenção",
            description: "A hierarquia de esferas foi alterada. O item pai pode precisar ser atualizado.",
            variant: "warning",
          })
        }

        // Tentar encontrar o item pai na hierarquia e configurar os itens selecionados
        await findParentInHierarchy(itemData.parent.id)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar os dados do item.",
        variant: "destructive",
      })
      navigate(`/dashboard/levels/${sphereId}/items`)
    } finally {
      setLoading(false)
    }
  }

  // Nova função para encontrar o item pai na hierarquia e configurar os itens selecionados
  const findParentInHierarchy = async (parentId: number) => {
    // Primeiro, buscar os dados do item pai
    try {
      // Precisamos saber a qual esfera este item pertence
      // Vamos verificar em cada esfera da hierarquia
      for (const sphere of sphereHierarchy) {
        const items = hierarchyItems[sphere.id] || []
        const foundItem = items.find((item) => item.id === parentId)

        if (foundItem) {
          // Encontramos o item pai nesta esfera
          console.log(`Item pai encontrado na esfera ${sphere.name}:`, foundItem)

          // Atualizar a seleção para esta esfera
          setSelectedHierarchyItems((prev) => ({
            ...prev,
            [sphere.id]: parentId.toString(),
          }))

          // Também salvar como original para comparação
          setOriginalHierarchyItems((prev) => ({
            ...prev,
            [sphere.id]: parentId.toString(),
          }))

          return true
        }
      }

      // Se chegamos aqui, não encontramos o item pai em nenhuma esfera da hierarquia
      console.log("Item pai não encontrado na hierarquia atual:", parentId)
      return false
    } catch (error) {
      console.error("Erro ao buscar item pai na hierarquia:", error)
      return false
    }
  }

  // Modificar a função fetchSphereHierarchy para buscar todos os itens e suas relações
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
          itemsData.items.map((item: { id: number; name: string }) => ({
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

  // Função para lidar com a seleção de itens na hierarquia
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

  // Check for changes by comparing current form data with original data
  const hasChanges = (): boolean => {
    const formChanged =
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.status !== originalData.status ||
      formData.externalCode !== originalData.externalCode

    // Verificar se houve mudanças na hierarquia de itens selecionados
    let hierarchyChanged = false
    for (const sphereId in selectedHierarchyItems) {
      const original = originalHierarchyItems[sphereId] || null
      const current = selectedHierarchyItems[sphereId] || null
      if (original !== current) {
        hierarchyChanged = true
        break
      }
    }

    const parentChanged = selectedParentItem !== originalParentItem

    return formChanged || parentChanged || hierarchyChanged
  }

  // Modificar o método handleSubmit para atualizar a interface local sem criar novos itens
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar mudanças antes de qualquer ação
    if (!hasChanges()) {
      toast({
        title: "Informação",
        description: "Não há alterações para salvar.",
      })
      return // Retorna sem fazer nada mais
    }

    // Se chegou aqui, existem mudanças para salvar
    try {
      if (!sphereId || !itemId) {
        throw new Error("IDs da esfera ou item não encontrados")
      }

      setSubmitting(true)

      // Preparar dados para atualização
      const updateData: any = {
        ...formData,
        status: formData.status || "ACTIVE", // Garantir que status tenha um valor padrão
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
          updateData.parentId = Number.parseInt(lastItem.itemId)
        }
      } else if (selectedParentItem) {
        // Manter compatibilidade com o código existente
        updateData.parentId = Number.parseInt(selectedParentItem)
      } else if (originalParentItem) {
        // Se não há item pai selecionado, mas havia antes, enviar null para remover
        updateData.parentId = null
      }

      console.log("Enviando dados para atualização:", JSON.stringify(updateData, null, 2))

      // Chamar o endpoint para atualizar o item
      const result = await levelService.updateLevelItem(sphereId, itemId, updateData)

      if (!result) {
        throw new Error("Falha ao atualizar o item")
      }

      // Adicionar um pequeno atraso para dar a impressão de processamento
      await new Promise((resolve) => setTimeout(resolve, 300))

      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso!",
      })

      // Atualizar os dados originais para evitar que o usuário veja mudanças se voltar a esta tela
      setOriginalData({ ...formData })

      // Atualizar os itens originais da hierarquia
      setOriginalHierarchyItems({ ...selectedHierarchyItems })

      if (selectedParentItem) {
        setOriginalParentItem(selectedParentItem)
      }

      // Disparar evento para notificar que um item foi atualizado
      // Isso fará com que a lista de itens seja recarregada quando o usuário voltar
      window.dispatchEvent(new Event("item-updated"))

      // Só navega após sucesso na atualização
      navigate(`/dashboard/levels/${sphereId}/items`)
    } catch (error) {
      console.error("Erro ao atualizar item:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar o item. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Função para obter os itens filtrados com base na seleção da esfera pai
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

    // Log para depuração
    console.log(`Filtrando itens para esfera ${sphereId} (índice ${index})`)
    console.log(`Item pai selecionado: ${selectedItemId}`)
    console.log(`Encontrados ${filteredItems.length} itens filhos`)

    return filteredItems
  }

  // Modificar o componente Select para mostrar mais itens na lista suspensa e filtrar corretamente
  const renderSphereHierarchy = () => {
    if (sphereHierarchy.length <= 1) return null // Não mostrar se só tiver a esfera atual

    // Remover a esfera atual da hierarquia para mostrar
    const parentHierarchy = [...sphereHierarchy]
    parentHierarchy.pop()

    if (parentHierarchy.length === 0) return null

    return (
      <div className="mb-4 p-3 bg-gray-50 rounded-md border">
        <p className="text-sm text-gray-500 mb-2">Hierarquia de esferas:</p>
        <div className="flex items-center mb-4">
          {parentHierarchy.map((sphere, index) => (
            <div key={sphere.id} className="flex items-center">
              <span className="font-medium">{sphere.name}</span>
              {index < parentHierarchy.length - 1 && <span className="mx-2 text-gray-400">→</span>}
            </div>
          ))}
        </div>

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
                <Label className="text-sm font-medium">
                  Selecione um item da esfera {sphere.name}:
                  {index === 0 && <span className="text-xs text-gray-500 ml-1">({totalItems} itens disponíveis)</span>}
                  {index > 0 && selectedHierarchyItems[parentHierarchy[index - 1].id] && (
                    <span className="text-xs text-gray-500 ml-1">({filteredItems.length} itens disponíveis)</span>
                  )}
                </Label>
                <div className="mt-1">
                  <Select
                    value={selectedHierarchyItems[sphere.id] || ""}
                    onValueChange={(value) => handleHierarchyItemSelect(sphere.id, value === "" ? null : value)}
                    disabled={!isEnabled || submitting}
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
    { title: "Editar item", link: "" },
  ]

  if (loading) {
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />{" "}
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" },
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8"
      >
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Editar item na Esfera: ${sphere?.name}`} description="Gerenciar esferas." />
        </div>

        <Separator />

        <div className="w-128">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-lg font-bold" htmlFor="name">
                Nome do item
              </Label>
              <Input
                className="mt-2"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label className="text-lg font-bold" htmlFor="description">
                Descrição
              </Label>
              <Textarea
                className="mt-2"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label className="text-lg font-bold" htmlFor="externalCode">
                Código externo
              </Label>
              <Input
                className="mt-2"
                id="externalCode"
                name="externalCode"
                value={formData.externalCode}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Mostrar a hierarquia de esferas */}
            {renderSphereHierarchy()}

            <div className="flex gap-2">
              <Button onClick={() => navigate(-1)} variant="ghost" type="button" disabled={submitting}>
                Voltar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar item"
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </ScrollArea>
  )
}

