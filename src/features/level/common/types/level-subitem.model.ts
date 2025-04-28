export interface LevelSubItemInterface {
  id: number;
  uuid: string;
  description: string;
  name: string;
  externalCode: string;
  status: string;
  levelId: number;
  parentId: number;
}

export interface LevelSubItemResponseInterface {
  total: number;
  items: LevelSubItemInterface[];
}
