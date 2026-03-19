import { apiRequest, apiRequestValidated } from './client';
import { ListCardsResponseSchema, CardInfoResponseSchema } from './schemas';
import type {
  CardInfoPayload,
  ListCardsResponse,
  CardInfoResponse,
  MakeFavoritePayload,
  MakeFavoriteResponse,
  UpdateCardNamePayload,
  UpdateCardNameResponse,
} from './types';

export async function getCards(): Promise<ListCardsResponse> {
  return apiRequestValidated(ListCardsResponseSchema, '/api/v1/list_cards');
}

export async function getCardInfo(payload: CardInfoPayload, signal?: AbortSignal): Promise<CardInfoResponse> {
  return apiRequestValidated(CardInfoResponseSchema, '/api/v1/card_info', {
    body: payload,
    signal,
  });
}

export async function makeFavorite(payload: MakeFavoritePayload): Promise<MakeFavoriteResponse> {
  return apiRequest<MakeFavoriteResponse>('/api/v1/make_card_favorite', {
    body: payload,
  });
}

export async function updateCardName(payload: UpdateCardNamePayload): Promise<UpdateCardNameResponse> {
  return apiRequest<UpdateCardNameResponse>('/api/v1/update_card_name', {
    body: payload,
  });
}
