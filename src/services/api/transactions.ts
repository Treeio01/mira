import { apiRequestValidated } from './client';
import { TransactionsResponseSchema } from './schemas';
import type { TransactionsPayload, TransactionsResponse } from './types';

export async function getTransactions(
  payload: TransactionsPayload,
  signal?: AbortSignal,
): Promise<TransactionsResponse> {
  return apiRequestValidated(TransactionsResponseSchema, '/api/v1/list_transactions', {
    body: payload,
    signal,
  });
}
