export interface ApiErrorMessage {
  message: string;
}

export interface ApiErrorResponse {
  messages: ApiErrorMessage[];
  status?: number;
  timestamp?: string;
}

