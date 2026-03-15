import { apiRequest } from './client';
import type {
  GetAvailableCardsResponse,
  ConfirmBuyCardPayload,
  ConfirmBuyCardResponse,
  GetAvailableEsimResponse,
  ConfirmBuyEsimPayload,
  ConfirmBuyEsimResponse,
} from './types';

export async function getAvailableCards(): Promise<GetAvailableCardsResponse> {
  return apiRequest<GetAvailableCardsResponse>('/api/v1/get_available_cards_for_issue');
}

export async function confirmBuyCard(payload: ConfirmBuyCardPayload): Promise<ConfirmBuyCardResponse> {
  return apiRequest<ConfirmBuyCardResponse>('/api/v1/confirm_buy_card', {
    body: payload,
  });
}

export async function getAvailableEsim(): Promise<GetAvailableEsimResponse> {
  return apiRequest<GetAvailableEsimResponse>('/api/v1/get_available_esim');
}

export async function confirmBuyEsim(payload: ConfirmBuyEsimPayload): Promise<ConfirmBuyEsimResponse> {
  return apiRequest<ConfirmBuyEsimResponse>('/api/v1/confirm_buy_esim', {
    body: payload,
  });
}
