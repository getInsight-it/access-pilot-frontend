import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { httpClient } from "../../../../config/http/http.ts";
import { RoleResponseInterface } from "../types/role.model.ts";

export const ROLE_API = {
  ROLES: "/v1/roles",
  SYNCHRONOUS: "/v1/roles/synchronous",
  PAGINATED: "/v1/roles/paginated"
};

export class RoleService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getRoleById(id?: string): Promise<RoleResponseInterface | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${ROLE_API.ROLES}/${id}`);

    if(response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as RoleResponseInterface;
    } else {
      console.error("Erro ao buscar role");
    }

    return null;
  }

  async getRolesByClientId(clientId: string): Promise<RoleResponseInterface[] | null> {
    if(!clientId) {
      console.error("clientId está undefined ou null");
      return null;
    }

    const queryParams = new URLSearchParams({ clientId: clientId.toString() });

    try {
      const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${ROLE_API.ROLES}?${queryParams.toString()}`);

      if(response instanceof HttpRequestResponse) {
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        return data as RoleResponseInterface[];
      } else {
        console.error("Erro ao buscar roles");
      }
    } catch (error) {
      console.error("Erro durante a requisição:", error);
    }

    return null;
  }

  async getRolesByClientIdV2(clientId: string): Promise<HttpRequestResponse | HttpRequestError> {
    const queryParams = new URLSearchParams({ clientId: clientId.toString() });
    return this.httpClient.get(`${ROLE_API.ROLES}?${queryParams.toString()}`);
  }

  async update(data: RoleResponseInterface[]): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(ROLE_API.ROLES, data);

    if(!(response instanceof HttpRequestResponse)) {
      console.error("Erro ao atualizar client");
    }
  }

  async deleteRole(roleId?: number): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.delete(`${ROLE_API.ROLES}/${roleId}`);

    if(!(response instanceof HttpRequestResponse)) {
      console.error("Erro ao deletar role");
    }
  }

  async createRole(roleData: RoleResponseInterface): Promise<RoleResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(ROLE_API.ROLES, roleData);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return JSON.parse(response.data) as RoleResponseInterface;
  }

  async updateRole(id?: number, roleData?: RoleResponseInterface): Promise<RoleResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(`${ROLE_API.ROLES}/${id}`, roleData);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return JSON.parse(response.data) as RoleResponseInterface;
  }
}

export const roleService: RoleService = new RoleService(httpClient);
