import { LevelInterface } from "./level.model.ts";

export interface ItemHierarchyInterface {
  id: number
  uuid: string
  name: string
  externalCode: string
  level: LevelInterface
  parent?: ItemHierarchyInterface
}
