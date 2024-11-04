import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { REQUEST_API } from './request-api.ts';
import { RequestDTO } from "./request-dto.ts";
import { PaginatedResponse } from '../../lib/paginated-response.ts';
import { ClientDTO } from '../client/client-dto.ts';

export class RequestService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {  // Removi o `private` aqui
    this.httpClient = httpClient;
  }

  async getRequests(): Promise<RequestDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(REQUEST_API.REQUESTS);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data);
    } else {
      console.error('erro ao buscar solicitações');
    }

    return null;
  }

  async getRequestsPaginated(pageIndex: number, pageSize: number, sortField: string, sortType: string, name?: string): Promise<PaginatedResponse<RequestDTO> | null> {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if (name) {
      queryParams.append('name', name);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${REQUEST_API.PAGINATED}?${queryParams.toString()}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as PaginatedResponse<RequestDTO>;
    } else {
      console.error('Erro ao buscar clients paginados');
    }

    return null;
  }

  // Ajustei o método para aceitar FormData
  async createRequest(formData: FormData, headers?: Map<string, string>): Promise<HttpRequestResponse | HttpRequestError> {
    try {
      console.log("enviando requisição para:", REQUEST_API.REQUESTS);

      // Remove o JSON.stringify e envia o FormData diretamente
      const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(
        REQUEST_API.REQUESTS, 
        formData, // FormData sendo passado diretamente
        headers
      );
      
      if (response instanceof HttpRequestResponse) {
        return response;
      } else {
        console.error('erro ao criar solicitação');
        return response;
      }
    } catch (error) {
      console.error('erro ao enviar solicitação', error);
      throw error;
    }
  }
}
