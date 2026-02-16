import { AttachmentConfigurationInterface } from "./configuration.model.ts";

export type ClientExportClient = {
  clientId: string;
  name?: string;
  label?: string;
  description?: string;
  baseUrl?: string;
  managed?: boolean;
  status?: string;
};

export type ClientExportRole = {
  name: string;
  label?: string;
  description?: string;
  icon?: string;
  parentName?: string;
  levelName?: string;
  levelType?: string;
};

export type ClientExport = {
  client: ClientExportClient;
  configurations?: AttachmentConfigurationInterface[];
  roles?: ClientExportRole[];
};

export type ClientImportRequest = {
  force?: boolean;
  importRoles?: boolean;
  importConfigurations?: boolean;
  exports: ClientExport[];
};

export type ClientImportResult = {
  clientId?: string;
  status?: string;
  rolesCreated?: number;
  rolesUpdated?: number;
  rolesDeleted?: number;
  configurationsCreated?: number;
  configurationsUpdated?: number;
  configurationsDeleted?: number;
  message?: string;
};

export type ClientImportSummary = {
  created: number;
  updated: number;
  ignored: number;
  errors: number;
  duration: number;
  results: ClientImportResult[];
};
