import { ClientResponseInterface } from "../../../../core/client/model/client-dto.ts";

export interface Role {
  id: number;
  name: string;
  description: string;
  role: string;
  parentRole: string;
  verified: boolean;
}

export interface RoleResponseInterface {
  id?: number;
  roleExternalId?: string;
  name?: string;
  label?: string;
  icon?: string;
  description?: string;
  idRoleParent?: number;
  idClient?: number;
  clientName?: string;
  roleParent?: RoleResponseInterface;
  client?: ClientResponseInterface;
}
