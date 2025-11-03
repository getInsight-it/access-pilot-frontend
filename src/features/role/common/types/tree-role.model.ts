import { RoleResponseInterface } from "./role.model.ts";

export type TreeRoleType = {
  index: string;
  isFolder: boolean;
  children: string[];
  data: string;
}

export interface TreeRoleProps {
  data?: RoleResponseInterface[];
  onSuccess?: () => Promise<void>;
}

export interface RoleUpdatePayload {
  id: number;
  parentId?: number;
  clientId: number;
}
