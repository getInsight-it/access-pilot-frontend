export interface RoleDTO {
  id?: number;
  roleExternalId?: string;
  name: string;
  description: string;
  idRoleParent?: number;
  idClient?: number;
  clientName?: string;
}
