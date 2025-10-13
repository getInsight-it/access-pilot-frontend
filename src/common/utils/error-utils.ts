import { ApiErrorMessage } from "../types/error/api-error.model.ts";

export function formatErrorMessages(messages: ApiErrorMessage[] | { message: string }): string {
  if (!messages) {
    return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  if (!Array.isArray(messages)) {
    return messages.message || "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  if (messages.length === 0) {
    return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  return messages
    .map(errorItem => errorItem.message)
    .filter(message => message && message.trim() !== "")
    .join("\n");
}

