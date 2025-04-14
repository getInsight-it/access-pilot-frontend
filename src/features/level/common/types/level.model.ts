export interface LevelInterface {
  id: number;
  uuid: string;
  sigla: string;
  name: string;
  description: string;
  type: string;
  parent?: LevelInterface;
}
