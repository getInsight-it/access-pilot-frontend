export interface ClientDTO {
  id?: number;
  clientExternalId?: string;
  name: string;
  description: string;
  status: string;
  idParent?: number;
}
