import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { REQUEST_API } from "../types/request.enum.ts";
import { PaginatedResponse } from "../../../../common/types/util/paginated-response.ts";
import { httpClient } from "../../../../config/http/http.ts";
import { RequestAttachmentInterface } from "../types/request-attachment.model.ts";
import { RequestInterface } from "../types/request.model.ts";

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
  ): Promise<PaginatedResponse<RequestInterface> | null> {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if(type) {
      queryParams.append("type", type);
    }

    if(filter) {
      queryParams.append("protocolCode", filter);
      queryParams.append("roleName", filter);
      queryParams.append("clientName", filter);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${REQUEST_API.ME_REQUESTS}?${queryParams.toString()}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return JSON.parse(response.data) as PaginatedResponse<RequestInterface>;
  }

  async createRequest(formData: FormData): Promise<void> {
    const headers = new Map<string, string>();
    headers.set("Content-Type", "multipart/form-data");

    const response = await this.httpClient.post(REQUEST_API.REQUESTS, formData, headers);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return;
  }

  async updateRequest(id: number, formData: FormData): Promise<void> {
    const headers = new Map<string, string>();
    headers.set("Content-Type", "multipart/form-data");
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(
      `${REQUEST_API.REQUESTS}/${id}`,
      formData,
      headers
    );

    if(response instanceof HttpRequestError) {
      console.error("Erro ao atualizar solicitação");
    }
  }

  async findRequestById(id: string): Promise<RequestInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${REQUEST_API.REQUESTS}/${id}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return JSON.parse(response.data) as RequestInterface;
  }

  async getClientAttachments(id: number): Promise<RequestAttachmentInterface[]> {
    const response = await this.httpClient.get(`${REQUEST_API.REQUESTS}/${id}/attachments`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return JSON.parse(response.data) as RequestAttachmentInterface[];
  }
}

export const requestService: RequestService = new RequestService(httpClient);
