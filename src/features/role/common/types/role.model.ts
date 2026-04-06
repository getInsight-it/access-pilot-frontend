import { LevelInterface } from "../../../level/common/types/level.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";

export type ApprovalPolicyType = "AUTO_APPROVAL" | "LATERAL_APPROVAL";

export interface ApprovalPolicyRoleRequestInterface {
  roleId: number;
  canApprove: boolean;
  canReject: boolean;
  canRevoke: boolean;
}

export interface ApprovalPolicyRoleResponseInterface extends ApprovalPolicyRoleRequestInterface {
  roleName?: string;
  roleLabel?: string;
}

export interface ApprovalPolicyRequestInterface {
  type: ApprovalPolicyType;
  enabled: boolean;
  roles: ApprovalPolicyRoleRequestInterface[];
}

export interface ApprovalPolicyResponseInterface {
  id?: number;
  type: ApprovalPolicyType;
  enabled: boolean;
  roles: ApprovalPolicyRoleResponseInterface[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  role: string;
  parentRole: string;
  verified: boolean;
}

export interface RoleResponseInterface {
  id: number;
  roleExternalId?: string;
  name: string;
  label: string;
  icon: string;
  description: string;
  idRoleParent?: number;
  idClient?: number;
  clientName: string;
  roleParent?: RoleResponseInterface;
  client?: ClientResponseInterface;
  level: LevelInterface;
  levelId?: number;
  approvalPolicies?: ApprovalPolicyResponseInterface[];
}

export interface RoleUpsertInterface {
  id?: number;
  roleExternalId?: string;
  name: string;
  label: string;
  icon?: string;
  description: string;
  roleParent?: RoleResponseInterface;
  client?: ClientResponseInterface;
  levelId?: number;
  approvalPolicies: ApprovalPolicyRequestInterface[];
}
