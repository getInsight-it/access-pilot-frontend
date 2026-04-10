import { AttachmentConfigurationInterface } from "./configuration.model.ts";
import {ItemTreeInterface} from "../../../summary/pages/partials/ClientCard.tsx";

export type ClientResponseInterface = {
  id?: number;
  clientExternalId?: string;
  description?: string;
  name?: string;
  label: string;
  clientId: string;
  clientUUID: string;
  managed: boolean;
  status?: string;
  baseUrl?: string;
  configurations: AttachmentConfigurationInterface[];
  allowedItemsHierarchy: ItemTreeInterface[];

}

export type ClientSyncSummaryInterface = {
  created: number;
  updated: number;
  ignored: number;
  errors: number;
  duration: number;
};
