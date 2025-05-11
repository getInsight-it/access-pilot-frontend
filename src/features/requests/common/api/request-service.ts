import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { REQUEST_API } from '../types/request.enum.ts';
import { RequestModel } from "../types/request.model.ts";
import { PaginatedResponse } from '../../../../common/types/util/paginated-response.ts';
import { httpClient } from "../../../../config/http/http.ts";

export class RequestService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getRequestsMePaginated(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string,
    type?: string,
    filter?: string
  ): Promise<PaginatedResponse<RequestModel> | null> {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if (type) {
      queryParams.append('type', type);
    }

    if(filter) {
      queryParams.append('protocolCode', filter);
      queryParams.append('roleName', filter);
      queryParams.append('clientName', filter);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${REQUEST_API.ME_REQUESTS}?${queryParams.toString()}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as PaginatedResponse<RequestModel>;
    } else {
      console.error('Erro ao buscar clients paginados');
    }

    return null;
  }

  async createRequest(formData: FormData): Promise<HttpRequestResponse | HttpRequestError> {
    const headers = new Map<string, string>();
    headers.set("Content-Type", "multipart/form-data");
    return await this.httpClient.post(REQUEST_API.REQUESTS, formData, headers);
  }

  async updateRequest(id: number, formData: FormData): Promise<void> {
      const headers = new Map<string, string>();
      headers.set("Content-Type", "multipart/form-data");
      const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(
        `${REQUEST_API.REQUESTS}/${id}`,
        formData,
        headers
      );

      if (response instanceof HttpRequestError) {
        console.error('Erro ao atualizar solicitação');
      }
  }

  async findRequestById(id: string): Promise<RequestModel | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${REQUEST_API.REQUESTS}/${id}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as RequestModel;
    } else {
      console.error('Erro ao buscar solicitação');
    }

    return null;
  }

  async getClientAttachments(id: number): Promise<HttpRequestResponse | HttpRequestError> {
    return await this.httpClient.get(`${REQUEST_API.REQUESTS}/${id}/attachments`);
  }
}

export const requestService: RequestService = new RequestService(httpClient);
