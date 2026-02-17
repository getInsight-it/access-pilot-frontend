import { LevelType } from "./level-type.enum.ts";

export interface LevelItemExport {
  name: string;
  description?: string;
  externalCode?: string;
  parentName?: string;
  parentCode?: string;
  parentExternalCode?: string;
}

export interface LevelExport {
  name: string;
  sigla?: string;
  description?: string;
  type: LevelType | string;
  parentName?: string;
  externalUrl?: string;
  icon?: string;
  apiKey?: string;
  uuid?: string;
  items?: LevelItemExport[];
}

export interface LevelImportRequest {
  exports: LevelExport[];
}

export interface LevelImportResult {
  name?: string;
  status: string;
  message?: string;
}

export interface LevelImportSummary {
  created: number;
  updated: number;
  ignored: number;
  errors: number;
  duration: number;
  results: LevelImportResult[];
}
