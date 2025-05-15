import { RoleResponseInterface } from "../../../role/common/types/role.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import { UserInfo } from "../../../../store/authStore.ts";
import { LevelInterface } from "../../../level/common/types/level.model.ts";

export interface RequestInterface {
  id: number;
  uuid: string;
  status: string;
  description: string;
  finalReason: string;
  protocolCode: string;
  codeItem: string;
  criacao: string;
  role: RoleResponseInterface;
  client: ClientResponseInterface;
  level: LevelInterface;
  requestingUser: UserInfo;
  approvingUser: UserInfo;
}
