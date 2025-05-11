import { LevelInterface } from "../../../level/common/types/level.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";

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
  level: LevelInterface
}
