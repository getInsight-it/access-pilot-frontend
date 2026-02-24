import { RoleResponseInterface } from "./role.model.ts";

export interface ArboristNode {
  id: string;
  name: string;
  levelName: string;
  children?: ArboristNode[];
}

export interface RoleHierarchyProps {
  data?: RoleResponseInterface[];
  onSuccess?: () => Promise<void>;
}

export interface RoleUpdatePayload {
  id: number;
  parentId?: number;
  clientId: number;
}
