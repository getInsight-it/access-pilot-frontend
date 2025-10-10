import { ApiErrorMessage } from "../types/error/api-error.model.ts";

export function formatErrorMessages(messages: ApiErrorMessage[]): string {
  if (!messages || messages.length === 0) {
    return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  return messages
    .map(errorItem => errorItem.message)
    .filter(message => message && message.trim() !== "")
    .join("\n");
}

