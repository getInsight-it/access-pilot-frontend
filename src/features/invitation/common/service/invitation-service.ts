import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";

import {
  InvitationAuthIntentInterface,
  InvitationDetailsInterface
} from "../model/invitation.model.ts";

const publicHttpClient = new HttpClient(window.env.API_URL);

export const INVITATION_API = {
  DETAILS: "/public/invitations",
};

export class InvitationService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getInvitationDetails(token: string): Promise<InvitationDetailsInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${INVITATION_API.DETAILS}/${token}`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as InvitationDetailsInterface;
  }

  async getInvitationAuthIntent(token: string): Promise<InvitationAuthIntentInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${INVITATION_API.DETAILS}/${token}/auth-intent`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as InvitationAuthIntentInterface;
  }
}

export const invitationService = new InvitationService(publicHttpClient);
