import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";

import { httpClient } from "@config/http/http.ts";
import {
  CreateInvitationPayload,
  InvitationDetailsInterface,
  InvitationListResponse,
  InvitationRequestContextInterface
} from "../types/invitation.model.ts";

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

  async getInvitationRequestContext(token: string): Promise<InvitationRequestContextInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${INVITATION_API.INVITATIONS}/${token}/request-context`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as InvitationRequestContextInterface;
  }

  async getInvitationById(id: string | number): Promise<InvitationDetailsInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${INVITATION_API.INVITATIONS}/${id}`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as InvitationDetailsInterface;
  }

  async createInvitation(data: CreateInvitationPayload): Promise<void> {
    const payload = {
      ...data,
      codeItem: data.codeItem || "",
      expiresAt: new Date(`${data.expiresAt}T23:59:59`).toISOString(),
      // TODO: Replace this temporary hardcoded protocol code when the backend invitation contract is finalized.
      protocolCode: "TEMP-INVITATION-PROTOCOL"
    };

    const response = await this.httpClient.post(INVITATION_API.INVITATIONS, payload);

    if (response instanceof HttpRequestError) {
      throw response;
    }
  }

  async cancelInvitation(id: number): Promise<void> {
    const cancelEndpoint = `${INVITATION_API.INVITATIONS}/${id}/cancel`;
    const response = await this.httpClient.post(cancelEndpoint, {});

    if (response instanceof HttpRequestError && response.status === 405) {
      const fallbackResponse = await this.httpClient.put(cancelEndpoint, {});

      if (fallbackResponse instanceof HttpRequestError) {
        throw fallbackResponse;
      }

      return;
    }

    if (response instanceof HttpRequestError) {
      throw response;
    }
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
