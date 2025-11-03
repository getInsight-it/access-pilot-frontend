import { AttachmentConfigurationInterface } from "./configuration.model.ts";

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
}
