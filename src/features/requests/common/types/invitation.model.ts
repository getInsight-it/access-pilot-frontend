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

export type InvitationListResponse = PaginatedResponse<InvitationListItemInterface>;
