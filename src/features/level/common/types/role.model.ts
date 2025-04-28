import { LevelInterface } from "./level.model.ts";

export interface RoleInterface {
  id: number;
  name: string;
  level: LevelInterface;
}
