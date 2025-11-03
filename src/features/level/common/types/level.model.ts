import { LevelType } from "./level-type.enum.ts";

export interface LevelInterface {
  id: number;
  uuid: string;
  sigla: string;
  name: string;
  description: string;
  type: LevelType | string;
  parent?: LevelInterface;
  externalUrl?: string;
  apiKey?: string;
}

export interface LevelResponseInterface {
  total: number;
  items: LevelInterface[];
}

export interface CreateLevelData {
  name: string;
  sigla: string;
  type: LevelType | string;
  description?: string;
  parentId?: number;
  externalUrl?: string;
  apiKey?: string;
  uuid?: string;
}

export interface UpdateLevelData extends CreateLevelData {
  id: number;
}
