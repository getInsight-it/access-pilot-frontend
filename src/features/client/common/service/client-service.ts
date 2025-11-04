import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";

import { PaginatedResponse } from "../../../../common/types/util/paginated-response.ts";
import { httpClient } from "../../../../config/http/http.ts";
import { ClientResponseInterface } from "../model/client.model.ts";

export const CLIENT_API = {
  CLIENTS: "/v1/clients",
  CLIENTS_PUBLISHES: "/v1/clients/publishes",
  CLIENTS_ME_ASSOCIATIONS: "/v1/clients/me/associations",
  CLIENTS_BY_CLIENT_ID: "/v1/clients/client-id",
  PAGINATED: "/v1/clients/paginated",
  SYNCHRONOUS: "/v1/clients/synchronous",
  CLIENT_CONFIGURATION_PREVIEW: "/v1/clients/attachments-configurations-import-preview"
};

export class ClientService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getClients(): Promise<ClientResponseInterface[]> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(CLIENT_API.CLIENTS_PUBLISHES);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientResponseInterface[];
  }

  async getClientsAssociates(attached: boolean): Promise<ClientResponseInterface[]> {
    const queryParams = new URLSearchParams({ attached: attached.toString() });
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.CLIENTS_ME_ASSOCIATIONS}?${queryParams.toString()}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientResponseInterface[];
  }

  async getClientsPaginated(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string,
    filter?: string
  ): Promise<PaginatedResponse<ClientResponseInterface>> {
    const queryParams = new URLSearchParams({
      pageIndex: (pageIndex).toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if(filter) {
      queryParams.append("clientId", filter);
      queryParams.append("description", filter);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.PAGINATED}?${queryParams.toString()}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as PaginatedResponse<ClientResponseInterface>;
  }

  async createClient(clientData: ClientResponseInterface): Promise<ClientResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(CLIENT_API.CLIENTS, clientData);

    if(!(response instanceof HttpRequestResponse)) {
      throw response;
    }

    return response.data as ClientResponseInterface;
  }

  async updateClient(clientId: number, clientData: ClientResponseInterface): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(`${CLIENT_API.CLIENTS}/${clientId}`, clientData);

    if(!(response instanceof HttpRequestResponse)) {
      throw response;
    }
  }

  async updateSystemPublication(id: number, status: string): Promise<ClientResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.patch(`${CLIENT_API.CLIENTS}/${id}`, { "status": status });

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientResponseInterface;
  }

  async syncClient(clientId: string): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(`${CLIENT_API.SYNCHRONOUS}`, [clientId]);

    if(response instanceof HttpRequestError) {
      throw response;
    }
  }

  async fetchByClientId(clientId?: string): Promise<ClientResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${CLIENT_API.CLIENTS_BY_CLIENT_ID}/${clientId}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientResponseInterface;
  }

  async clientConfigurationPreview(csv: File): Promise<HttpRequestResponse | HttpRequestError> {
    const headers = new Map<string, string>([["Content-Type", "multipart/form-data"]]);
    const formData = new FormData();
    formData.append("file", csv, csv.name);
    return this.httpClient.post(`${CLIENT_API.CLIENT_CONFIGURATION_PREVIEW}`, formData, headers);
  }
}

export const clientService: ClientService = new ClientService(httpClient);
