import { RoleResponseInterface } from "../../../role/common/types/role.model.ts";

export interface RequestModel {
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
  role: RoleResponseInterface;
  protocolCode: string;
  criacao: string;
  status: string;
}
