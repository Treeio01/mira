import { apiRequest } from './client';
import type {
  GetTopUpsMethodResponse,
  GetTopUpsFinalAmountPayload,
  GetTopUpsFinalAmountResponse,
} from './types';

export async function getTopUpsMethods(): Promise<GetTopUpsMethodResponse> {
  return apiRequest<GetTopUpsMethodResponse>('/api/v1/get_top_ups_method');
}

export async function getTopUpsFinalAmount(payload: GetTopUpsFinalAmountPayload): Promise<GetTopUpsFinalAmountResponse> {
  return apiRequest<GetTopUpsFinalAmountResponse>('/api/v1/get_top_ups_final_amount', {
    body: payload,
  });
}
