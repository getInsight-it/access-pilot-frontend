import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";

import { httpClient } from "@config/http/http.ts";
import { InvitationListResponse } from "../types/invitation.model.ts";

const INVITATION_STATUS = "pending";

export const INVITATION_API = {
  INVITATIONS: "/v1/invitations",
  MY_INVITATIONS: "/v1/invitations/me"
} as const;

export class InvitationService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getMyInvitationsPaginated(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string,
    filter?: string
  ): Promise<InvitationListResponse> {
    return this.getPaginatedInvitations(
      INVITATION_API.MY_INVITATIONS,
      pageIndex,
      pageSize,
      sortField,
      sortType,
      filter
    );
  }

  async getManageInvitationsPaginated(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string,
    filter?: string
  ): Promise<InvitationListResponse> {
    return this.getPaginatedInvitations(
      INVITATION_API.INVITATIONS,
      pageIndex,
      pageSize,
      sortField,
      sortType,
      filter
    );
  }

  private async getPaginatedInvitations(
    endpoint: string,
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string,
    filter?: string
  ): Promise<InvitationListResponse> {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField,
      sortType,
      status: INVITATION_STATUS
    });

    if (filter) {
      queryParams.append("protocolCode", filter);
      queryParams.append("roleLabel", filter);
      queryParams.append("clientLabel", filter);
      queryParams.append("clientId", filter);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${endpoint}?${queryParams.toString()}`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as InvitationListResponse;
  }
}

export const invitationService = new InvitationService(httpClient);
