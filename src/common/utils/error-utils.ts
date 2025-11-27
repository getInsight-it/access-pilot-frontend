import { HttpRequestError } from "@getinsight.it/getinsight-common";
import { ApiErrorMessage } from "../types/error/api-error.model.ts";

/**
 * Formats error messages for display to users
 * Handles various error formats from the API and provides fallback messages
 *
 * @param messages - Error messages from API (array, object, or unknown)
 * @returns Formatted error message string
 *
 * @example
 * // With array of errors
 * const formatted = formatErrorMessages([
 *   { message: "Invalid email" },
 *   { message: "Password too short" }
 * ]);
 * // Returns: "Invalid email\nPassword too short"
 *
 * @example
 * // With single error
 * const formatted = formatErrorMessages({ message: "Not found" });
 * // Returns: "Not found"
 *
 * @example
 * // With unknown error
 * const formatted = formatErrorMessages(null);
 * // Returns: "Ocorreu um erro inesperado. Por favor, tente novamente."
 */
export function formatErrorMessages(messages: unknown): string {
  let error = messages;
  if(messages instanceof HttpRequestError) {
    error = messages.error;
  }
  if (!error) {
    return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  if (typeof error === 'object' && error !== null && 'message' in error && !Array.isArray(error)) {
    const errorObj = error as { message: string };
    return errorObj.message || "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  if (Array.isArray(error)) {
    if (error.length === 0) {
      return "Ocorreu um erro inesperado. Por favor, tente novamente.";
    }

    return error
      .map((errorItem: ApiErrorMessage) => errorItem.message)
      .filter((message: string) => message && message.trim() !== "")
      .join("\n");
  }

  return "Ocorreu um erro inesperado. Por favor, tente novamente.";
}

