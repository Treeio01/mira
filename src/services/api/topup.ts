import { apiRequest } from './client';
import type {
  GetTopUpsMethodResponse,
  GetTopUpsFinalAmountPayload,
  GetTopUpsFinalAmountResponse,
  GetTopUpsMethodCardResponse,
  GetTopUpsFinalAmountCardResponse,
  CreateTopUpBalancePayload,
  CreateTopUpBalanceResponse,
  CreateTopUpCardPayload,
  CreateTopUpCardResponse,
} from './types';

// ── Balance Top-Up ──

export async function getTopUpsMethods(): Promise<GetTopUpsMethodResponse> {
  return apiRequest<GetTopUpsMethodResponse>('/api/v1/get_top_ups_method');
}

export async function getTopUpsFinalAmount(payload: GetTopUpsFinalAmountPayload): Promise<GetTopUpsFinalAmountResponse> {
  return apiRequest<GetTopUpsFinalAmountResponse>('/api/v1/get_top_ups_final_amount', {
    body: payload,
  });
}

export async function createTopUpBalance(payload: CreateTopUpBalancePayload): Promise<CreateTopUpBalanceResponse> {
  return apiRequest<CreateTopUpBalanceResponse>('/api/v1/create_top_up_balance', {
    body: payload,
  });
}

// ── Card Top-Up ──

export async function getTopUpsMethodsCard(): Promise<GetTopUpsMethodCardResponse> {
  return apiRequest<GetTopUpsMethodCardResponse>('/api/v1/get_top_ups_method_card');
}

export async function getTopUpsFinalAmountCard(payload: GetTopUpsFinalAmountPayload): Promise<GetTopUpsFinalAmountCardResponse> {
  return apiRequest<GetTopUpsFinalAmountCardResponse>('/api/v1/get_top_ups_final_amount_card', {
    body: payload,
  });
}

export async function createTopUpCard(payload: CreateTopUpCardPayload): Promise<CreateTopUpCardResponse> {
  return apiRequest<CreateTopUpCardResponse>('/api/v1/create_top_up_card', {
    body: payload,
  });
}
