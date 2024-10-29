import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { ROLE_API } from './role-api.ts';
import { RoleDTO } from "./role-dto.ts";

export class RoleService {
  httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getRoles(): Promise<RoleDTO[] | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(ROLE_API.ROLES);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data);
    } else {
      console.error('Erro ao buscar roles');
    }

    return null;
  }

  async getRolesByClientId(clientId: number): Promise<RoleDTO[] | null> {
    console.log("clientId:", clientId);  // Adicione isso para verificar o valor
    if (!clientId) {
        console.error("clientId está undefined ou null");
        return null;
    }

    const queryParams = new URLSearchParams({ clientId: clientId.toString() });

    try {
        const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${ROLE_API.ROLES}?${queryParams.toString()}`);

        if (response instanceof HttpRequestResponse) {
            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            return data as RoleDTO[];
        } else {
            console.error('Erro ao buscar roles');
        }
    } catch (error) {
        console.error('Erro durante a requisição:', error);
    }

    return null;
}



}
