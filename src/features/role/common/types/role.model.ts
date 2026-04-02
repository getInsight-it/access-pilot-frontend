import { LevelInterface } from "../../../level/common/types/level.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";

export type RoleApprovalPolicyType = "AUTO_APPROVAL" | "LATERAL_APPROVAL";

export interface RoleApprovalPolicyTargetRequestInterface {
  roleId: number;
  canApprove: boolean;
  canReject: boolean;
  canRevoke: boolean;
}

export interface RoleApprovalPolicyTargetResponseInterface extends RoleApprovalPolicyTargetRequestInterface {
  roleName?: string;
  roleLabel?: string;
}

export interface RoleApprovalPolicyRequestInterface {
  type: RoleApprovalPolicyType;
  enabled: boolean;
  targetRoles: RoleApprovalPolicyTargetRequestInterface[];
}

export interface RoleApprovalPolicyResponseInterface {
  id?: number;
  type: RoleApprovalPolicyType;
  enabled: boolean;
  targetRoles: RoleApprovalPolicyTargetResponseInterface[];
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
  approvalPolicies?: RoleApprovalPolicyResponseInterface[];
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
  approvalPolicies: RoleApprovalPolicyRequestInterface[];
}
