import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { REQUEST_API } from './request-api.ts';
import { RequestDTO } from "./request-dto.ts";

export class RequestService {
  httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
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


  async createRequest(data: RequestDTO): Promise<HttpRequestResponse | HttpRequestError> {
    try {
      console.log("enviando requisição para:", REQUEST_API.REQUESTS);
      const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(
        REQUEST_API.REQUESTS, 
        JSON.stringify(data)
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

