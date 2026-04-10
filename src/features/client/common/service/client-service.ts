import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import axios, { AxiosResponse } from "axios";

import { httpClient } from "@config/http/http.ts";
import { ColorUsage } from "@common/types/color-usage.model.ts";
import { ClientResponseInterface, ClientSyncSummaryInterface } from "../model/client.model.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "../enum/client-status.enum";
import { PaginatedResponse } from "@common/types/util/paginated-response.ts";
import { authService } from "../../../auth/common/AuthService.ts";
import { AttachmentConfigurationInterface } from "../model/configuration.model.ts";
import { ClientExport, ClientImportRequest, ClientImportSummary } from "../model/client-export.model.ts";

export const CLIENT_API = {
  CLIENTS: "/v1/clients",
  CLIENTS_PUBLISHES: "/v1/clients/publishes",
  CLIENTS_ME_ASSOCIATIONS: "/v1/clients/me/associations",
  CLIENTS_BY_CLIENT_ID: "/v1/clients/client-id",
  PAGINATED: "/v1/clients/paginated",
  CLIENTS_EXPORT: "/v1/clients/export",
  SYNCHRONOUS: "/v1/clients/synchronous",
  SYNCHRONOUS_ALL: "/v1/clients/synchronous/all",
  CLIENT_CONFIGURATION_PREVIEW: "/v1/clients/attachments-configurations-import-preview",
  CLIENT_CONFIGURATION_EXPORT_PREVIEW: "/v1/clients/attachments-configurations-export-preview",
  CLIENT_EXPORT_IMPORT: "/v1/clients/import",
  CLIENT_CONFIGURATION_COLORS: "/v1/clients/attachments-configurations/colors"
};

const normalizeString = (value: string) =>
  value.normalize("NFD").replace(/[^\w\s]/g, "").toLowerCase().trim();

const appendClientFilterParams = (queryParams: URLSearchParams, filter?: string) => {
  if (!filter) {
    return;
  }

  queryParams.append("clientId", filter);
  queryParams.append("name", filter);
  queryParams.append("description", filter);

  const normalizedFilter = normalizeString(filter);
  const statusEntry = Object.entries(ClientStatusTranslationEnum).find(
    ([, value]) => normalizeString(value) === normalizedFilter
  );

  if (statusEntry) {
    const [statusKey] = statusEntry;
    queryParams.append("status", ClientStatusEnum[statusKey as keyof typeof ClientStatusEnum]);
  }
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

    appendClientFilterParams(queryParams, filter);

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

  async syncAllClients(syncRoles: boolean = false): Promise<ClientSyncSummaryInterface> {
    const queryParams = new URLSearchParams({ syncRoles: syncRoles.toString() });
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(
      `${CLIENT_API.SYNCHRONOUS_ALL}?${queryParams.toString()}`,
      {}
    );

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientSyncSummaryInterface;
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

  async exportAttachmentConfigurationsPreview(configurations: AttachmentConfigurationInterface[]): Promise<AxiosResponse<Blob>> {
    const token = await authService.getBearerToken();
    const apiClient = axios.create({
      baseURL: window.env.API_URL,
      headers: {
        Authorization: `${token}`
      }
    });

    return apiClient.post(CLIENT_API.CLIENT_CONFIGURATION_EXPORT_PREVIEW, configurations, {
      responseType: "blob"
    });
  }

  async exportClient(clientId: number, includeRoles: boolean = true, includeConfigurations: boolean = true): Promise<AxiosResponse<Blob>> {
    const token = await authService.getBearerToken();
    const apiClient = axios.create({
      baseURL: window.env.API_URL,
      headers: {
        Authorization: `${token}`
      }
    });

    return apiClient.get(`${CLIENT_API.CLIENTS}/${clientId}/export`, {
      params: {
        includeRoles,
        includeConfigurations
      },
      responseType: "blob"
    });
  }

  async exportClientData(clientId: number, includeRoles: boolean = true, includeConfigurations: boolean = true): Promise<ClientExport> {
    const queryParams = new URLSearchParams({
      includeRoles: includeRoles.toString(),
      includeConfigurations: includeConfigurations.toString()
    });
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${CLIENT_API.CLIENTS}/${clientId}/export?${queryParams.toString()}`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientExport;
  }

  async exportClientsPage(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string,
    filter?: string,
    includeRoles: boolean = true,
    includeConfigurations: boolean = true
  ): Promise<ClientExport[]> {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType,
      includeRoles: includeRoles.toString(),
      includeConfigurations: includeConfigurations.toString()
    });

    appendClientFilterParams(queryParams, filter);

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${CLIENT_API.CLIENTS_EXPORT}?${queryParams.toString()}`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientExport[];
  }

  async importClients(request: ClientImportRequest): Promise<ClientImportSummary> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(CLIENT_API.CLIENT_EXPORT_IMPORT, request);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ClientImportSummary;
  }

  async getAttachmentConfigurationColors(clientId?: string): Promise<ColorUsage[]> {
    const queryParams = new URLSearchParams();

    if (clientId?.trim()) {
      queryParams.set("clientId", clientId.trim());
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      queryParams.toString()
        ? `${CLIENT_API.CLIENT_CONFIGURATION_COLORS}?${queryParams.toString()}`
        : CLIENT_API.CLIENT_CONFIGURATION_COLORS
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ColorUsage[];
  }
}

export const clientService: ClientService = new ClientService(httpClient);
