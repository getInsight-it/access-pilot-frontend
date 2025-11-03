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
  if (!messages) {
    return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  if (typeof messages === 'object' && messages !== null && 'message' in messages && !Array.isArray(messages)) {
    const errorObj = messages as { message: string };
    return errorObj.message || "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }

  if (Array.isArray(messages)) {
    if (messages.length === 0) {
      return "Ocorreu um erro inesperado. Por favor, tente novamente.";
    }

    return messages
      .map((errorItem: ApiErrorMessage) => errorItem.message)
      .filter((message: string) => message && message.trim() !== "")
      .join("\n");
  }

  return "Ocorreu um erro inesperado. Por favor, tente novamente.";
}

