import {RoleDTO} from "../role/role-dto.ts";

export interface RequestDTO {
  id: number;
  clientId: string;
  uuid: string;
  role: RoleDTO;
  protocolCode: string;
  criacao: string;
  status: string;
}
