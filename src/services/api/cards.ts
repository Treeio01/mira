import { apiRequest } from './client';
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
  return apiRequest<ListCardsResponse>('/api/v1/list_cards');
}

export async function getCardInfo(payload: CardInfoPayload): Promise<CardInfoResponse> {
  return apiRequest<CardInfoResponse>('/api/v1/card_info', {
    body: payload,
  });
}

export async function makeFavorite(payload: MakeFavoritePayload): Promise<MakeFavoriteResponse> {
  return apiRequest<MakeFavoriteResponse>('/api/v1/make_card_favourite', {
    body: payload,
  });
}

export async function updateCardName(payload: UpdateCardNamePayload): Promise<UpdateCardNameResponse> {
  return apiRequest<UpdateCardNameResponse>('/api/v1/update_card_name', {
    body: payload,
  });
}
