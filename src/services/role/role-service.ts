import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { ROLE_API } from './role-api.ts';
import {RoleDTO} from "./role-dto.ts";

export class RoleService {
  httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getRoles(): Promise<RoleDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(ROLE_API.ROLES);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data);
    } else {
      console.error('Erro ao buscar roles');
    }

    return null;
  }


}
