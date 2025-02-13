// import type React from "react"
// import { useState, useMemo } from "react"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

// // Mock data
// const mockData = [
//   { id: 1, clientId: "app-1", description: "john@example.com", status: "Publicado" },
//   { id: 2, clientId: "app-2", description: "jane@example.com", status: "Não gerenciado" },
//   { id: 3, clientId: "app-3", description: "bob@example.com", status: "Não publicado" },
//   { id: 4, clientId: "app-4", description: "alice@example.com", status: "Não gerenciado" },
//   { id: 5, clientId: "app-5", description: "charlie@example.com", status: "Não gerenciado" },
//   { id: 6, clientId: "app-6", description: "eva@example.com", status: "Não gerenciado" },
//   { id: 7, clientId: "app-7", description: "frank@example.com", status: "Não gerenciado" },
//   { id: 8, clientId: "app-8", description: "grace@example.com", status: "Não gerenciado" },
//   { id: 9, clientId: "app-9", description: "henry@example.com", status: "Não gerenciado" },
//   { id: 10, clientId: "app-10", description: "ivy@example.com", status: "Não gerenciado" },
//   { id: 11, clientId: "app-11", description: "jack@example.com", status: "Não gerenciado" },
//   { id: 12, clientId: "app-12", description: "karen@example.com", status: "Não gerenciado" },
// ]

// export default function TablePaginationSearch() {
//   const [currentPage, setCurrentPage] = useState(1)
//   const [searchTerm, setSearchTerm] = useState("")
//   const itemsPerPage = 5

//   const filteredData = useMemo(() => {
//     return mockData.filter((item) =>
//       Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
//     )
//   }, [searchTerm])

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)
//   const startIndex = (currentPage - 1) * itemsPerPage
//   const endIndex = startIndex + itemsPerPage
//   const currentData = filteredData.slice(startIndex, endIndex)

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page)
//   }

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value)
//     setCurrentPage(1)
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-4">
//         <Input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} className="max-w-sm" />
//       </div>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>SISTEMA</TableHead>
//             <TableHead>DESCRIÇÃO</TableHead>
//             <TableHead>STATUS</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {currentData.map((item) => (
//             <TableRow key={item.id}>
//               <TableCell>{item.clientId}</TableCell>
//               <TableCell>{item.description}</TableCell>
//               <TableCell>{item.status}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <div className="mt-4 flex justify-between items-center">
//         <div>
//           Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
//         </div>
//         <div className="space-x-2">
//           <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//             Previous
//           </Button>
//           <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import type { ClientDTO } from "../services/client/client-dto.ts"
import { clientService } from "../services/client"

export default function TablePaginationSearch() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<ClientDTO[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 5

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log(`Fetching clients: page=${currentPage}, search="${searchTerm}"`)
      const response = await clientService.getClientsPaginated(
        currentPage - 1,
        itemsPerPage,
        "clientId",
        "asc",
        searchTerm,
      )
      console.log("API Response:", response)
      if (response && Array.isArray(response.items)) {
        setClients(response.items)
        setTotalItems(response.total || 0)
      } else {
        setClients([])
        setTotalItems(0)
        setError("Resposta inválida do servidor")
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      setClients([])
      setTotalItems(0)
      setError("Erro ao buscar clientes. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={handleSearch} className="max-w-sm" />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SISTEMA</TableHead>
            <TableHead>DESCRIÇÃO</TableHead>
            <TableHead>STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.clientId}</TableCell>
                <TableCell>{client.description}</TableCell>
                <TableCell>{client.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Mostrando {clients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} entradas
        </div>
        <div className="space-x-2">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>
            Anterior
          </Button>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}



