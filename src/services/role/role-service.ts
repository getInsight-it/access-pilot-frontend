import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { ROLE_API } from './role-api.ts';
import { RoleDTO } from "./role-dto.ts";

export class RoleService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
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

  async getRoleById(id?: string): Promise<RoleDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${ROLE_API.ROLES}/${id}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as RoleDTO;
    } else {
      console.error('Erro ao buscar role');
    }

    return null;
  }

  async getRolesByClientId(clientId: string): Promise<RoleDTO[] | null> {
    console.log("clientId:", clientId);
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
  async update(data: RoleDTO[]): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(ROLE_API.ROLES, data);

    if (!(response instanceof HttpRequestResponse)) {
      console.error('Erro ao atualizar client');
    }

  }

  async deleteRole(roleId?: number): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.delete(`${ROLE_API.ROLES}/${roleId}`);

    if (!(response instanceof HttpRequestResponse)) {
      console.error('Erro ao deletar role');
    }
  }

  async createRole(roleData: RoleDTO): Promise<RoleDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(ROLE_API.ROLES, roleData);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as RoleDTO;
    } else {
      console.error('Erro ao criar role');
    }

    return null;
  }

  async updateRole(id?: number,roleData?: RoleDTO): Promise<RoleDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(`${ROLE_API.ROLES}/${id}`, roleData);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as RoleDTO;
    } else {
      console.error('Erro ao atualizar role');
    }

    return null;
  }



}
