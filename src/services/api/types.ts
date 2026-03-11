// ── Auth ──

export interface RegisterPayload {
  init_data: string;
}

export interface RegisterResponse {
  user_id: number;
  is_new_user: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenResponse {
  user_id: number;
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ── Main Menu ──

export interface FavoriteCardItem {
  card_id: number;
  type: string;
  number: string;
  balance: number;
  is_favorite: boolean;
}

export interface MainMenuResponse {
  main_balance: number;
  cards_balance: number;
  favorite_cards: FavoriteCardItem[];
}

// ── Cards ──

export interface ListCardItem {
  card_id: number;
  type: string;
  card_name: string | null;
  number: string;
  balance: number;
  is_favorite: boolean;
}

export interface ListCardsResponse {
  list_cards: ListCardItem[];
}

export interface CardInfoItem {
  card_id: number;
  type: string;
  category_name: string;
  card_name: string;
  number: string;
  date: string;
  cvc: string;
  owner_name: string;
  address: string;
  region: string;
  warnings: number | string | null;
  status: string;
  balance: number;
  is_favorite: boolean;
}

export interface CardInfoResponse {
  card_info: CardInfoItem;
}

export interface CardInfoPayload {
  card_id: number;
}

export interface MakeFavoritePayload {
  card_id: number;
  is_favorite: boolean;
}

export interface MakeFavoriteResponse {
  card_id: number;
  is_favorite: boolean;
  status: string;
}

export interface UpdateCardNamePayload {
  card_id: number;
  card_name: string;
}

export interface UpdateCardNameResponse {
  card_id: number;
  card_name: string;
  status: string;
}

// ── Errors ──

export interface ApiErrorResponse {
  detail: string;
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}
