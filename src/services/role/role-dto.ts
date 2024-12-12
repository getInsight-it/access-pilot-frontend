import { ClientDTO } from "../client/client-dto";

export interface RoleDTO {
  id?: number;
  roleExternalId?: string;
  name?: string;
  label?: string;
  icon?: string;
  description?: string;
  icon?: string;
  label?: string;
  idRoleParent?: number;
  idClient?: number;
  clientName?: string;
  roleParent?: RoleDTO;
  client?: ClientDTO;
}
