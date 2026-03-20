import { PaginatedResponse } from "@common/types/util/paginated-response.ts";

export interface InvitationListItemInterface {
  id: number;
  protocolCode: string;
  expiresAt: string;
  roleId: number;
  roleLabel: string;
  clientId: string;
  clientLabel: string;
}

export interface InvitationRequestContextInterface {
  invitationToken: string;
  clientId: string;
  roleId: number;
  roleLabel: string;
  clientLabel: string;
  levelId: number;
  levelName: string;
  codeItem: string;
  description: string;
}

export interface InvitationDetailsInterface {
  id: number;
  protocolCode: string;
  status: string;
  expiresAt: string;
  email: string;
  roleId: number;
  roleLabel: string;
  clientId: string;
  clientLabel: string;
  codeItem: string;
  description: string;
}

export interface CreateInvitationPayload {
  emails: string[];
  roleId: number;
  codeItem?: string;
  description: string;
  expiresAt: string;
}

export type InvitationListResponse = PaginatedResponse<InvitationListItemInterface>;
