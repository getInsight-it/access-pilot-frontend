import {HttpClient, HttpRequestError, HttpRequestResponse} from '@getinsight.it/getinsight-common';
import {CLIENT_API} from './client-api.ts';
import {ClientDTO} from './client-dto.ts';
import {PaginatedResponse} from "../../lib/paginated-response.ts";

export class ClientService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getClients(): Promise<ClientDTO[] | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(CLIENT_API.CLIENTS_PUBLISHES);

    if (response instanceof HttpRequestResponse) {
      // return response.data as ClientDTO[];
      return JSON.parse(response.data) as ClientDTO[];
    } else {
      console.error('Erro ao buscar clients');
    }

    return null;
  }

  async getClientsAssociates(attached: boolean): Promise<ClientDTO[] | null> {
    const queryParams = new URLSearchParams({
      attached: attached?.toString()
    });


    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.CLIENTS_ME_ASSOCIATIONS}?${queryParams.toString()}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as ClientDTO[];
    } else {
      console.error('Erro ao buscar clients');
    }

    return null;
  }

  async getClientsPaginated(pageIndex: number, pageSize: number, sortField: string, sortType: string, name?: string): Promise<PaginatedResponse<ClientDTO> | null> {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if (name) {
      queryParams.append('name', name);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.PAGINATED}?${queryParams.toString()}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as PaginatedResponse<ClientDTO>;
    } else {
      console.error('Erro ao buscar clients paginados');
    }

    return null;
  }

  async createClient(clientData: ClientDTO): Promise<ClientDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(CLIENT_API.CLIENTS, clientData);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as ClientDTO;
    } else {
      console.error('Erro ao criar client');
    }

    return null;
  }

  async updateClient(clientId: number, clientData: ClientDTO): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(`${CLIENT_API.CLIENTS}/${clientId}`, clientData);

    if (!(response instanceof HttpRequestResponse)) {
      console.error('Erro ao atualizar client');
    }

  }

  async publish(id: number): Promise<ClientDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.patch(`${CLIENT_API.CLIENTS}/${id}`, {"status": "PUBLISHED"});

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as ClientDTO;
    } else {
      console.error('Erro ao publicar client');
    }

    return null;
  }

  async unpublish(id: number): Promise<ClientDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.patch(`${CLIENT_API.CLIENTS}/${id}`, {"status": "UNPUBLISHED"});

    if (response instanceof HttpRequestResponse) {
      return response.data as ClientDTO;
    } else {
      console.error('Erro ao publicar client');
    }

    return null;
  }


  async synchronousByClientId(clientId: string): Promise<void> {
    const data = [clientId];
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(`${CLIENT_API.SYNCHRONOUS}`, data);

    if (!(response instanceof HttpRequestResponse)) {
      console.error('Erro ao sincronizar client');
    }

  }

  async fetchByFilter(filters: {
    clientId?: string,
    name?: string,
    description?: string,
    status?: string,
    manager?: boolean,
  }): Promise<ClientDTO | undefined> {
    const queryParams = new Map<string, string>();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, value.toString());
      }
    })

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.CLIENTS}`, queryParams);
    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as ClientDTO;
    }
  }

  async fetchByClientId(clientId?: string): Promise<ClientDTO | undefined> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.CLIENTS_BY_CLIENT_ID}/${clientId}`);
    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as ClientDTO;
    }
  }

}

// import { HttpClient, type HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common"
// import { CLIENT_API } from "./client-api"
// import type { ClientDTO } from "./client-dto"
// import type { PaginatedResponse } from "../../lib/paginated-response"

// const TIMEOUT = 30000 // 30 seconds
// const MAX_RETRY_ATTEMPTS = 3
// const DEBUG = true

// export class ClientService {
//   private httpClient: HttpClient

//   constructor(httpClient: HttpClient) {
//     this.httpClient = httpClient
//   }

//   private async retry<T>(operation: () => Promise<T>, maxAttempts: number = MAX_RETRY_ATTEMPTS): Promise<T> {
//     let lastError
//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         return await operation()
//       } catch (error) {
//         console.error(`Tentativa ${attempt} falhou:`, error)
//         lastError = error
//         if (attempt < maxAttempts) {
//           const delay = 1000 * attempt
//           console.log(`Aguardando ${delay}ms antes da próxima tentativa...`)
//           await new Promise((resolve) => setTimeout(resolve, delay))
//         }
//       }
//     }
//     console.error(`Todas as ${maxAttempts} tentativas falharam. Último erro:`, lastError)
//     throw lastError
//   }

//   async getClients(): Promise<ClientDTO[] | null> {
//     return this.retry(async () => {
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(CLIENT_API.CLIENTS_PUBLISHES, {
//         timeout: TIMEOUT,
//       })

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO[]
//       } else {
//         console.error("Erro ao buscar clients")
//         throw new Error(`Falha ao buscar clients: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async getClientsAssociates(attached: boolean): Promise<ClientDTO[] | null> {
//     return this.retry(async () => {
//       const queryParams = new URLSearchParams({
//         attached: attached.toString(),
//       })

//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
//         `${CLIENT_API.CLIENTS_ME_ASSOCIATIONS}?${queryParams.toString()}`,
//         { timeout: TIMEOUT },
//       )

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO[]
//       } else {
//         console.error("Erro ao buscar clients associados")
//         throw new Error(`Falha ao buscar clients associados: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async getClientsPaginated(
//     pageIndex: number,
//     pageSize: number,
//     sortField: string,
//     sortType: string,
//     name?: string,
//   ): Promise<PaginatedResponse<ClientDTO> | null> {
//     return this.retry(async () => {
//       console.log(
//         `getClientsPaginated chamado com: pageIndex=${pageIndex}, pageSize=${pageSize}, sortField=${sortField}, sortType=${sortType}, name="${name}"`,
//       )
//       const queryParams = new URLSearchParams({
//         pageIndex: pageIndex.toString(),
//         pageSize: pageSize.toString(),
//         sortField: sortField,
//         sortType: sortType,
//       })

//       if (name && name.trim() !== "") {
//         queryParams.append("name", encodeURIComponent(name.trim()))
//       }

//       const url = `${CLIENT_API.PAGINATED}?${queryParams.toString()}`
//       console.log(`Fazendo requisição para: ${url}`)

//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(url, { timeout: TIMEOUT })

//       if (response instanceof HttpRequestResponse) {
//         console.log("Resposta bruta da API:", response.data)
//         console.log("Status da resposta:", response.status)
//         console.log("Headers da resposta:", response.headers)
//         const parsedData = JSON.parse(response.data) as PaginatedResponse<ClientDTO>
//         console.log("Dados parseados:", parsedData)

//         // Garantir que items seja sempre um array, mesmo que vazio
//         if (!Array.isArray(parsedData.items)) {
//           parsedData.items = []
//         }

//         console.log("Número de itens retornados:", parsedData.items.length)
//         console.log("Total de itens:", parsedData.total)
//         return parsedData
//       } else {
//         console.error("Erro ao buscar clients paginados:", response)
//         throw new Error(`Falha ao buscar clients paginados: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async createClient(clientData: ClientDTO): Promise<ClientDTO | null> {
//     return this.retry(async () => {
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(
//         CLIENT_API.CLIENTS,
//         clientData,
//         { timeout: TIMEOUT },
//       )

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO
//       } else {
//         console.error("Erro ao criar client")
//         throw new Error(`Falha ao criar client: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async updateClient(clientId: number, clientData: ClientDTO): Promise<void> {
//     return this.retry(async () => {
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(
//         `${CLIENT_API.CLIENTS}/${clientId}`,
//         clientData,
//         { timeout: TIMEOUT },
//       )

//       if (!(response instanceof HttpRequestResponse)) {
//         console.error("Erro ao atualizar client")
//         throw new Error(`Falha ao atualizar client: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async publish(id: number): Promise<ClientDTO | null> {
//     return this.retry(async () => {
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.patch(
//         `${CLIENT_API.CLIENTS}/${id}`,
//         { status: "PUBLISHED" },
//         { timeout: TIMEOUT },
//       )

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO
//       } else {
//         console.error("Erro ao publicar client")
//         throw new Error(`Falha ao publicar client: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async unpublish(id: number): Promise<ClientDTO | null> {
//     return this.retry(async () => {
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.patch(
//         `${CLIENT_API.CLIENTS}/${id}`,
//         { status: "UNPUBLISHED" },
//         { timeout: TIMEOUT },
//       )

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO
//       } else {
//         console.error("Erro ao despublicar client")
//         throw new Error(`Falha ao despublicar client: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async synchronousByClientId(clientId: string): Promise<void> {
//     return this.retry(async () => {
//       const data = [clientId]
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(
//         `${CLIENT_API.SYNCHRONOUS}`,
//         data,
//         { timeout: TIMEOUT },
//       )

//       if (!(response instanceof HttpRequestResponse)) {
//         console.error("Erro ao sincronizar client")
//         throw new Error(`Falha ao sincronizar client: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async fetchByFilter(filters: {
//     clientId?: string
//     name?: string
//     description?: string
//     status?: string
//     manager?: boolean
//   }): Promise<ClientDTO | undefined> {
//     return this.retry(async () => {
//       const queryParams = new URLSearchParams()

//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== undefined) {
//           queryParams.append(key, value.toString())
//         }
//       })

//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
//         `${CLIENT_API.CLIENTS}?${queryParams.toString()}`,
//         { timeout: TIMEOUT },
//       )

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO
//       } else {
//         console.error("Erro ao buscar client por filtro")
//         throw new Error(`Falha ao buscar client por filtro: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }

//   async fetchByClientId(clientId?: string): Promise<ClientDTO | undefined> {
//     return this.retry(async () => {
//       const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
//         `${CLIENT_API.CLIENTS_BY_CLIENT_ID}/${clientId}`,
//         { timeout: TIMEOUT },
//       )

//       if (response instanceof HttpRequestResponse) {
//         return JSON.parse(response.data) as ClientDTO
//       } else {
//         console.error("Erro ao buscar client por ID")
//         throw new Error(`Falha ao buscar client por ID: ${response.errorType} - ${response.message}`)
//       }
//     })
//   }
// }

// export const clientService = new ClientService(new HttpClient())

