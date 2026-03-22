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
  support_url: string;
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

// ── Ref Info ──

export interface RefInfoData {
  referral_link: string;
  total_referrals: number;
  referral_income: number;
}

export interface RefInfoResponse {
  ref_info: RefInfoData;
}

// ── Issue Cards ──

export interface IssueCardCategory {
  category_name: string;
  category_id: number;
  text_name: string;
  description: string;
  description_full: string;
  restricted_categories: string;
  restricted_geos: string;
  restricted_mcc: string;
  top_up_comission: number;
  price: number;
  min_top_up: number;
}

export interface GetAvailableCardsResponse {
  cards_list: IssueCardCategory[];
}

export interface ConfirmBuyCardPayload {
  category_id: number;
  amount_top_up: number;
}

export interface ConfirmBuyCardResponse {
  result: { status: string };
}

// ── eSIM ──

export interface EsimCategory {
  category_name: string;
  category_id: number;
  text_name: string;
  description: string;
  description_full: string;
  price: number;
}

export interface GetAvailableEsimResponse {
  esim_list: EsimCategory[];
}

export interface ConfirmBuyEsimPayload {
  category_id: number;
}

export interface ConfirmBuyEsimResponse {
  result: { status: string };
}

// ── Top-Up ──

export interface TopUpMethodItem {
  name: string;
  name_text: string;
  commission: number;
  min_amount: number;
  max_amount: number;
  icon?: string | null;
}

export interface GetTopUpsMethodResponse {
  usd_to_rub: number | null;
  methods: TopUpMethodItem[];
}

export interface GetTopUpsFinalAmountPayload {
  method_name: string;
  amount: number;
}

export interface GetTopUpsFinalAmountResponse {
  method_name: string;
  currency: string;
  amount: number;
  commission_percent: number;
  final_amount: number;
  final_amount_text: string;
}

// ── Card Top-Up ──

export interface GetTopUpsMethodCardResponse {
  user_balance: number;
  max_amount: number;
  usd_to_rub?: number | null;
  methods: TopUpMethodItem[];
}

export interface GetTopUpsFinalAmountCardResponse {
  method_name: string;
  amount: number;
  final_amount_usd: number;
  final_amount_rub: number;
  final_amount_text: string;
}

// ── Create Top-Up ──

export interface CreateTopUpBalancePayload {
  method_name: string;
  amount: number;
  final_amount: number;
}

export interface CreateTopUpBalanceResponse {
  result: {
    top_up_id: string;
    method_name: string;
    amount: number;
    commission_percent: number;
    currency: string;
    final_amount_usd: number;
    final_amount_rub: number;
    final_amount_text: string;
    payment_url: string;
    status: string;
  };
}

export interface CreateTopUpCardPayload {
  card_id: number;
  method_name: string;
  amount: number;
}

export interface CreateTopUpCardResponse {
  result: {
    top_up_id: string;
    card_id: number;
    method_name: string;
    amount: number;
    final_amount: number;
    payment_url?: string | null;
    status: string;
  };
}

// ── Transactions ──

export interface TransactionItem {
  name: string;
  amount: string;
  color: string;
  merchant?: string | null;
  transaction_id?: string | null;
  date: string;
  date_timestamp: number;
  account: string;
}

export interface TransactionsPayload {
  filters: string[];
  start_date?: string | null;
  end_date?: string | null;
  page?: number;
}

export interface TransactionsResponse {
  count: number;
  transactions: TransactionItem[];
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
