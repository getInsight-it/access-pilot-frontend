export type ClientDTO = {
  id?: number;
  clientExternalId?: string;
  description?: string;
  name?: string;
  clientId: string,
  clientUUID: string,
  managed: boolean,
  status?: string;
  baseUrl?: string;
}
