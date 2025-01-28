import {RoleDTO} from "../role/role-dto.ts";

export interface RequestDTO {
  id: number;
  description: string;
  requestingUser: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    externalId: string;
  };
  approvingUser: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  },
  clientIcon: string;
  clientId: string;
  uuid: string;
  role: RoleDTO;
  protocolCode: string;
  criacao: string;
  status: string;
}
