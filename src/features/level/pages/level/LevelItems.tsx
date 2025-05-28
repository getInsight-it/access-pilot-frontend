import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../components/ui/button.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table.tsx"
import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx"
import { Heading } from "../../../../components/ui/heading.tsx"
import { Separator } from "../../../../components/ui/separator.tsx"
import { Link } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog.tsx"
import { toast } from "../../../../components/ui/use-toast.ts"
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx"
import { Edit, File, Trash, Search, ArrowLeft, ArrowRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import useAuthStore from "../../../../store/authStore.ts"
import { Input } from "../../../../components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.tsx"

import { motion } from "framer-motion"
import HighlightLoader from "../../../../components/highlightloader/HighLightLoader.tsx"
import { levelService } from "../../common/api/level-service.ts"
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";

interface Item {
  id: number
  name: string
  description: string
  parent?: {
    id: number
    name: string
    uuid: string
    sigla: string
    description: string
    type: string
  }
  externalCode?: string
  status?: string
}

interface Sphere {
  id: string
  name: string
  type: string
  parent?: {
    id: number
    name: string
  } | null
}

interface SphereHierarchy {
  id: string
  name: string
  parent?: {
    id: number
    name: string
  } | null
}

export default function LevelItems() {
  const { id } = useParams<{ id: string }>()
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [sphere, setSphere] = useState<Sphere | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [parentSpheres, setParentSpheres] = useState<Record<string, string>>({})
  const [sphereHierarchies, setSphereHierarchies] = useState<Record<string, SphereHierarchy[]>>({})
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated)

  // Adicionar estados para paginação e pesquisa
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalPages, setTotalPages] = useState(1)

  // Opções de tamanho de página
  const pageSizeOptions = [5, 10, 20, 50, 100]

  // Adicionar um mecanismo para atualizar a lista de itens após uma edição
  // Modificar o useEffect para incluir uma verificação de atualização
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchSphereAndItems()

      // Adicionar listener para evento de atualização
      const handleItemUpdated = () => {
        console.log("Detectada atualização de item, recarregando lista...")
        fetchSphereAndItems()
      }

      window.addEventListener("item-updated", handleItemUpdated)

      return () => {
        window.removeEventListener("item-updated", handleItemUpdated)
      }
    }
  }, [isAuthenticated, id, currentPage, pageSize])

  // Efeito para filtrar itens com base no termo de pesquisa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(items)
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase()
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseSearchTerm) ||
          item.description?.toLowerCase().includes(lowercaseSearchTerm) ||
          item.externalCode?.toLowerCase().includes(lowercaseSearchTerm),
      )
      setFilteredItems(filtered)
    }
  }, [searchTerm, items])

  // Modificar o método fetchSphereAndItems para limpar o cache
  const fetchSphereAndItems = async () => {
    if (!id) return

    try {
      setLoading(true)

      // Fetch sphere data
      const sphereData = await levelService.getLevelById(id)
      if (!sphereData) {
        throw new Error("Falha ao buscar dados da esfera")
      }

      // Transformar os dados da API para o formato esperado
      const sphere: Sphere = {
        id: sphereData.id.toString(),
        name: sphereData.name,
        type: sphereData.type,
        parent: sphereData.parent
          ? {
              id: sphereData.parent.id,
              name: sphereData.parent.name,
            }
          : null,
      }
      setSphere(sphere)

      const itemsData = await levelService.getLevelItems(id, currentPage, pageSize, "id", "ASC")

      if (itemsData) {
        setItems(itemsData.items || [])
        setFilteredItems(itemsData.items || [])
        setTotalItems(itemsData.total || 0)

        const totalPages = Math.ceil((itemsData.total || 0) / pageSize)
        setTotalPages(totalPages > 0 ? totalPages : 1)

        if (itemsData.items && itemsData.items.length > 0) {
          await fetchParentSpheres(itemsData.items)
        }
      } else {
        setItems([])
        setFilteredItems([])
        setTotalItems(0)
        setTotalPages(1)
      }
      setError(null)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao buscar dados")
      console.error("Erro ao buscar esfera e itens:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchParentSpheres = async (itemsData: Item[]) => {
    try {
      // Filtrar apenas itens que têm parent
      const itemsWithParent = itemsData.filter((item) => item.parent)

      if (itemsWithParent.length === 0) return

      const uniqueParentIds = [...new Set(itemsWithParent.map((item) => item.parent?.id))]
      const parentSpheresData: Record<string, string> = {}
      const hierarchies: Record<string, SphereHierarchy[]> = {}

      // Buscar dados das esferas pais
      for (const parentId of uniqueParentIds) {
        if (!parentId) continue

        try {
          // Aqui estamos buscando a esfera pai do item pai
          // Primeiro, precisamos encontrar a esfera pai correta
          // Vamos usar o primeiro item que tem este parent para obter a esfera pai
          const itemWithThisParent = itemsWithParent.find((item) => item.parent?.id === parentId)

          if (itemWithThisParent && itemWithThisParent.parent) {
            // Usar o nome do item pai diretamente da propriedade parent
            parentSpheresData[parentId.toString()] = itemWithThisParent.parent.name || `Item ${parentId}`

            // Tentar buscar a hierarquia da esfera pai
            if (sphere && sphere.parent) {
              try {
                hierarchies[parentId.toString()] = await fetchSphereHierarchy(sphere.parent.id.toString())
              } catch (hierarchyError) {
                console.error(`Erro ao buscar hierarquia para esfera pai:`, hierarchyError)
                // Criar uma hierarquia mínima com apenas o nome da esfera pai
                hierarchies[parentId.toString()] = [
                  {
                    id: sphere.parent.id.toString(),
                    name: sphere.parent.name,
                    parent: null,
                  },
                ]
              }
            } else {
              // Se não conseguirmos determinar a hierarquia, usar apenas o nome do item pai
              hierarchies[parentId.toString()] = [
                {
                  id: parentId.toString(),
                  name: itemWithThisParent.parent.name,
                  parent: null,
                },
              ]
            }
          } else {
            // Fallback se não encontrarmos o item com este parent
            parentSpheresData[parentId.toString()] = `Item ${parentId}`
            hierarchies[parentId.toString()] = [
              {
                id: parentId.toString(),
                name: `Item ${parentId}`,
                parent: null,
              },
            ]
          }
        } catch (error) {
          console.error(`Erro ao processar item pai ${parentId}:`, error)
          // Adicionar um nome genérico para itens que não puderam ser processados
          parentSpheresData[parentId.toString()] = `Item ${parentId}`
          hierarchies[parentId.toString()] = [
            {
              id: parentId.toString(),
              name: `Item ${parentId}`,
              parent: null,
            },
          ]
        }
      }

      setParentSpheres(parentSpheresData)
      setSphereHierarchies(hierarchies)
    } catch (error) {
      console.error("Erro ao buscar esferas pais:", error)
      // Não interromper o fluxo principal se houver erro aqui
    }
  }

  const fetchSphereHierarchy = async (sphereId: string): Promise<SphereHierarchy[]> => {
    const hierarchy: SphereHierarchy[] = []
    let currentId = sphereId

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

        currentId = sphere.parent ? sphere.parent.id.toString() : ""
      } catch (error) {
        console.error(`Erro ao buscar esfera ${currentId}:`, error)
        // Se houver erro, interromper a busca da hierarquia, mas manter o que já foi encontrado
        break
      }
    }

    // Se a hierarquia estiver vazia (o que não deveria acontecer), adicionar pelo menos a esfera atual
    if (hierarchy.length === 0) {
      hierarchy.push({
        id: sphereId,
        name: `Esfera ${sphereId}`,
        parent: null,
      })
    }

    return hierarchy
  }

  const handleDelete = (item: Item) => {
    setItemToDelete(item)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete || !sphere || !id) return

    try {
      const success = await levelService.deleteLevelItem(id, itemToDelete.id.toString())

      if (success) {
        toast({
          title: "Sucesso",
          description: "Item excluído com sucesso!",
        })

        // Recarregar os itens após a exclusão
        fetchSphereAndItems()
      } else {
        throw new Error("Falha ao excluir o item")
      }
    } catch (error) {
      console.error("Erro ao excluir item:", error)
      toast({
        title: "Erro",
        description: "Falha ao excluir o item. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const renderParentItem = (item: Item) => {
    if (!item.parent) return "Nenhum"

    return item.parent.name || `Item ${item.parent.id}`
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Esferas", link: "/dashboard/levels" },
    { title: "Itens", link: `/dashboard/levels/${id}/items` },
  ]

  if (loading) return (
    <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
      <HighlightLoader />{" "}
    </div>
  );

  const location = useLocation();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3, delay: 0.3, ease: "easeOut" },
      }}
      className="flex-1 space-y-4 p-4 pt-6 md:p-8"
    >
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={`Itens da Esfera: ${sphere?.name}`} description={`Total: ${totalItems} itens`} />
        <div className="flex space-x-4 items-center">
          {sphere?.type !== "BUILT_IN" && sphere?.type !== "EXTERNAL" && (
            <>
              <Button className="border-primary" variant="outline" asChild>
                <Link to={``}>
                  <File className="w-4 h-4 mr-3" />
                  Importar CSV
                </Link>
              </Button>
              <Button
                className="cursor-pointer"
                asChild
                onClick={() => {
                  savePreviousRoute(location.pathname + location.search);
                  navigate(`/dashboard/levels/${id}/items/create`);
                }}>
                <span>Adicionar novo item</span>
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator />

      <>
        {/* Campo de pesquisa */}
        <div className="max-w-content-container m-auto">
          <div className="relative w-full md:w-1/3 mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar itens..." className="pl-8" value={searchTerm} onChange={handleSearchChange} />
          </div>

          <ScrollArea className="h-[calc(80vh-320px)] rounded-md border">
            {loading ? (
              <div className="grid justify-center items-center h-full">
                {/* <ShuffleLoader /> */}
                <HighlightLoader />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="uppercase">
                    <TableHead>Nome</TableHead>
                    {sphere?.type !== "BUILT_IN" && (
                      <>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Código externo</TableHead>
                        <TableHead>Item da esfera pai</TableHead>
                        <TableHead>Ações</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={sphere?.type !== "BUILT_IN" ? 7 : 2} className="text-center py-6">
                        {searchTerm
                          ? "Nenhum item encontrado para esta pesquisa."
                          : "Nenhum item encontrado para esta esfera."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        {sphere?.type !== "BUILT_IN" && (
                          <>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.externalCode}</TableCell>
                            <TableCell>{renderParentItem(item)}</TableCell>
                            <TableCell>
                              <Button
                                className="h-[2rem] cursor-pointer"
                                variant="ghost"
                                asChild
                                onClick={() => {
                                  savePreviousRoute(location.pathname + location.search);
                                  navigate(`/dashboard/levels/${id}/items/${item.id}/edit`)
                                }}>
                                  <span>
                                    <Edit className="w-3.5 h-3.5" />
                                  </span>
                              </Button>
                              <Button className="h-[2rem]" variant="ghost" onClick={() => handleDelete(item)}>
                                <Trash className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </ScrollArea>

          {/* Controles de paginação */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                  <div className="flex items-center space-x-2">
                    <p className="whitespace-nowrap text-sm font-medium">Linhas por página</p>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value))
                        setCurrentPage(1) // Reset to first page when changing page size
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={String(pageSize)} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {pageSizeOptions.map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
                <div className="flex w-[110px] items-center justify-center text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    aria-label="Primeira página"
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label="Página anterior"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label="Próxima página"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label="Última página"
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>

      <div className="max-w-content-container m-auto">
        <Button className="" onClick={() => navigate(PRIVATE_ROUTES.LEVELS)} variant="ghost">
          Voltar
        </Button>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
          </DialogHeader>
          <p>
            Esta ação não pode ser desfeita. Isso irá permanentemente excluir o item
            {itemToDelete && <strong> {itemToDelete.name}</strong>}.
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
    </motion.div>
  )
}
