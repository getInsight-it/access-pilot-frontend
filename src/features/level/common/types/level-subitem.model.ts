import { LevelItemStatus } from "./level-status.enum.ts";

export interface LevelSubItemInterface {
  id: number;
  uuid: string;
  description: string;
  name: string;
  externalCode: string;
  status: LevelItemStatus | string;
  parentId: number;
}

export interface LevelSubItemResponseInterface {
  total: number;
  items: LevelSubItemInterface[];
}
