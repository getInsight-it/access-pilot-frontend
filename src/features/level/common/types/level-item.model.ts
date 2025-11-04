import { LevelInterface } from "./level.model.ts";
import { LevelItemStatus } from "./level-status.enum.ts";

export interface LevelItemInterface {
  id: number;
  uuid: string;
  description: string;
  name: string;
  externalCode: string;
  status: LevelItemStatus | string;
  level: LevelInterface;
  parent?: LevelItemInterface;
}

export interface LevelItemsResponseInterface {
  total: number;
  items: LevelItemInterface[];
}

export interface CreateLevelItemData {
  name: string;
  description?: string;
  externalCode?: string;
  parentId?: number;
}

export interface UpdateLevelItemData extends CreateLevelItemData {
  id: number;
  status: LevelItemStatus | string;
}
