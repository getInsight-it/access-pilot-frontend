import { LevelInterface } from "./level.model.ts";

export interface LevelItemInterface {
  id: number;
  uuid: string;
  description: string;
  name: string;
  externalCode: string;
  status: string;
  level: LevelInterface;
  parent: LevelItemInterface;
}
