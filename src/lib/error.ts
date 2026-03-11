import { ApiError } from '../services/api';

/**
 * Безопасно извлекает сообщение ошибки из любого типа.
 */
export function extractErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof ApiError) return e.detail;
  if (e instanceof Error) return e.message;
  return fallback;
}
