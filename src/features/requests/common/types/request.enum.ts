export enum REQUEST_API {
  REQUESTS = '/v1/requests',
  PAGINATED = '/v1/requests/paginated',
  ME_REQUESTS = '/v1/requests/me/paginated',
};

export enum REQUEST_STATUS_ENUM {
  CREATED =  "CREATED",
  APPROVED = "APPROVED",
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  REJECTED = "REJECTED"
}

export enum REQUEST_STATUS_PRESENTATION_NAME_ENUM {
  CREATED =  "Criado",
  APPROVED = "Aprovado",
  CANCELED = "Cancelado",
  PENDING = "Em análise",
  REJECTED = "Rejeitado"
}
