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
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(CLIENT_API.CLIENTS);

    if (response instanceof HttpRequestResponse) {
      // return response.data as ClientDTO[];
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
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(`${CLIENT_API.SYNCHRONOUS}`,  data);

    if (!(response instanceof HttpRequestResponse)) {
      console.error('Erro ao sincronizar client');
    }

  }
}
