import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { CLIENT_API } from './client-api.ts';
import { ClientDTO } from './client-dto.ts';

export class ClientService {
  httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
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

}
