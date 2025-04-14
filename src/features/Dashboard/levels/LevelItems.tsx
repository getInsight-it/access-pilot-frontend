import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Breadcrumbs } from "../../../components/breadcrumbs"
import { Heading } from "../../../components/ui/heading"
import { Separator } from "../../../components/ui/separator"
import { Link } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { toast } from "../../../components/ui/use-toast"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Edit, File, Trash, Search } from "lucide-react"
import useAuthStore from "../../../store/authStore"
import { Input } from "../../../components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination"

import { motion } from "framer-motion"
import HighlightLoader from "../../../components/highlightloader/HighLightLoader"
import { levelService } from "../../level/common/api/level-service.ts";

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

interface ItemsResponse {
  total: number
  items: Item[]
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

      // Verificar se é uma esfera externa
      if (sphereData.type === "EXTERNAL") {
        // Para esferas externas, não tentamos buscar itens da API
        setItems([])
        setFilteredItems([])
        setTotalItems(0)
        setTotalPages(1)
        setError(
          "Esferas externas não possuem itens gerenciáveis diretamente. Os itens são gerenciados pelo sistema externo.",
        )
      } else {
        // Adicionar um timestamp para evitar cache
        const timestamp = new Date().getTime()
        // Para esferas não-externas, buscar itens normalmente com paginação
        const itemsData = await levelService.getLevelItems(id, currentPage, pageSize, "id", "ASC")

        if (itemsData) {
          setItems(itemsData.items || [])
          setFilteredItems(itemsData.items || [])
          setTotalItems(itemsData.total || 0)

          // Calcular o número total de páginas
          const totalPages = Math.ceil((itemsData.total || 0) / pageSize)
          setTotalPages(totalPages > 0 ? totalPages : 1)

          // Buscar hierarquia de esferas pais se houver itens
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
      }
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

  // Função para lidar com a mudança de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Função para lidar com a mudança no termo de pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Gerar array de páginas para exibição
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Se houver menos páginas que o máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Caso contrário, mostrar um subconjunto com a página atual no centro
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  // Função para renderizar o item pai de forma segura
  const renderParentItem = (item: Item) => {
    if (!item.parent) return "Nenhum"

    // Usar diretamente o nome do item pai da propriedade parent
    return item.parent.name || `Item ${item.parent.id}`
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Esferas", link: "/dashboard/levels" },
    // { title: sphere?.name || "", link: `/dashboard/levels/${id}` },
    { title: "Itens", link: `/dashboard/levels/${id}/items` },
  ]

  // if (loading)
  //   return (
  //     <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
  //       <HighlightLoader />{" "}
  //     </div>
  //   )
  if (error) return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Erro: {error}</div>

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
              <Button asChild>
                <Link to={`/dashboard/levels/${id}/items/create`}>Adicionar novo item</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator />

      {sphere?.type === "EXTERNAL" ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Nota: </strong>
          <span className="block sm:inline">
            Esferas externas não possuem itens gerenciáveis diretamente. Os itens são gerenciados pelo sistema externo.
          </span>
        </div>
      ) : (
        <>
          {/* Campo de pesquisa */}
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
                              <Button className="h-[2rem]" variant="ghost" asChild>
                                <Link to={`/dashboard/levels/${id}/items/${item.id}/edit`}>
                                  <Edit className="w-3.5 h-3.5" />
                                </Link>
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
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <Button className="" onClick={() => navigate(-1)} variant="ghost">
        Voltar
      </Button>

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

