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

  async getRoleById(id?: string): Promise<RoleResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${ROLE_API.ROLES}/${id}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as RoleResponseInterface;
  }

  async getRolesByClientId(clientId: string): Promise<RoleResponseInterface[]> {
    if(!clientId) {
      throw new Error("Client ID is required");
    }

    const queryParams = new URLSearchParams({ clientId });

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${ROLE_API.ROLES}?${queryParams.toString()}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as RoleResponseInterface[];
  }

  async getRolesByClientIdV2(clientId: string): Promise<HttpRequestResponse | HttpRequestError> {
    const queryParams = new URLSearchParams({ clientId });
    return this.httpClient.get(`${ROLE_API.ROLES}?${queryParams.toString()}`);
  }

  async update(data: RoleResponseInterface[]): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(ROLE_API.ROLES, data);

    if(!(response instanceof HttpRequestResponse)) {
      throw response;
    }
  }

  async deleteRole(roleId?: number): Promise<void> {
    if(!roleId) {
      throw new Error("Role ID is required");
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.delete(`${ROLE_API.ROLES}/${roleId}`);

    if(!(response instanceof HttpRequestResponse)) {
      throw response;
    }
  }

  async createRole(roleData: RoleResponseInterface): Promise<RoleResponseInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(ROLE_API.ROLES, roleData);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as RoleResponseInterface;
  }

  async updateRole(id?: number, roleData?: RoleResponseInterface): Promise<RoleResponseInterface> {
    if(!id || !roleData) {
      throw new Error("Role ID and data are required");
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(`${ROLE_API.ROLES}/${id}`, roleData);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as RoleResponseInterface;
  }
}

export const roleService: RoleService = new RoleService(httpClient);
