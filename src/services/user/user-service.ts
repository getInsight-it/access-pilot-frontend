import {HttpClient, HttpRequestError, HttpRequestResponse} from '@getinsight.it/getinsight-common';
import { USER_API } from './user-api.ts';
import { UserDTO } from './user-dto.ts';

export class UserService {
  
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getUser(): Promise<UserDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(USER_API.USER);
    if (response instanceof HttpRequestResponse) {
    // return response.data as UserDTO[];
    return JSON.parse(response.data) as UserDTO;
    } else {
      console.error('Erro ao buscar usuário');
    }
    return null;
  }

}
