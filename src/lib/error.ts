import { ApiError } from '../services/api';

const ERROR_RU: Record<string, string> = {
  'Not enough balance': 'Недостаточно средств на балансе',
  'User not found': 'Пользователь не найден',
  'Card not found': 'Карта не найдена',
  'Card does not belong to the user': 'Карта не принадлежит пользователю',
  'eSIM category not found': 'Категория eSIM не найдена',
  'Invalid init_data format': 'Некорректный формат данных авторизации',
  'Invalid telegram hash': 'Ошибка авторизации Telegram',
  'auth_date is too old': 'Сессия устарела, перезайдите в приложение',
};

function translateError(message: string): string {
  return ERROR_RU[message] ?? message;
}

/**
 * Безопасно извлекает сообщение ошибки из любого типа.
 */
export function extractErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof ApiError) return translateError(e.detail);
  if (e instanceof Error) return e.message;
  return fallback;
}
