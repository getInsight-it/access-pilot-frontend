export interface InvitationRoleInterface {
  id: number;
  name: string;
  label: string;
}

export interface InvitationClientInterface {
  id: number;
  name: string;
  label: string;
}

export type InvitationStatus = "VALID" | "EXPIRED" | "USED" | "REVOKED" | "INVALID";

export interface InvitationDetailsInterface {
  status: InvitationStatus;
  expiresAt: string;
  emailMasked: string;
  role: InvitationRoleInterface;
  client: InvitationClientInterface;
}

export type InvitationAuthNextStep = "REDIRECT_TO_LOGIN" | "REDIRECT_TO_REGISTRATION" | string;

export interface InvitationAuthIntentInterface {
  status: InvitationStatus;
  nextStep: InvitationAuthNextStep;
  loginHint: string;
  invitationToken: string;
}
