import { z } from 'zod';

export const RegisterResponseSchema = z.object({
  user_id: z.number(),
  is_new_user: z.boolean(),
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export const RefreshTokenResponseSchema = z.object({
  user_id: z.number(),
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export const FavoriteCardItemSchema = z.object({
  card_id: z.number(),
  type: z.string(),
  number: z.string(),
  balance: z.number(),
  is_favorite: z.boolean(),
});

export const MainMenuResponseSchema = z.object({
  main_balance: z.number(),
  cards_balance: z.number(),
  favorite_cards: z.array(FavoriteCardItemSchema),
  support_url: z.string(),
});

export const ListCardItemSchema = z.object({
  card_id: z.number(),
  type: z.string(),
  card_name: z.string().nullable(),
  number: z.string(),
  balance: z.number(),
  is_favorite: z.boolean(),
});

export const ListCardsResponseSchema = z.object({
  list_cards: z.array(ListCardItemSchema),
});

export const CardInfoItemSchema = z.object({
  card_id: z.number(),
  type: z.string(),
  category_name: z.string(),
  card_name: z.string(),
  number: z.string(),
  date: z.string(),
  cvc: z.string(),
  owner_name: z.string(),
  address: z.string(),
  region: z.string(),
  warnings: z.union([z.number(), z.string(), z.null()]),
  status: z.string(),
  balance: z.number(),
  is_favorite: z.boolean(),
});

export const CardInfoResponseSchema = z.object({
  card_info: CardInfoItemSchema,
});

export const TopUpMethodItemSchema = z.object({
  name: z.string(),
  name_text: z.string(),
  commission: z.number(),
  min_amount: z.number(),
  max_amount: z.number(),
  icon: z.string().nullable().optional(),
});

export const GetTopUpsMethodResponseSchema = z.object({
  usd_to_rub: z.number().nullable(),
  methods: z.array(TopUpMethodItemSchema),
});

export const TransactionItemSchema = z.object({
  name: z.string(),
  amount: z.string(),
  color: z.string(),
  merchant: z.string().nullable().optional(),
  transaction_id: z.string().nullable().optional(),
  date: z.string(),
  date_timestamp: z.number(),
  account: z.string(),
});

export const TransactionsResponseSchema = z.object({
  count: z.number(),
  transactions: z.array(TransactionItemSchema),
});

export const GetTopUpsMethodCardResponseSchema = z.object({
  user_balance: z.number(),
  max_amount: z.number(),
  usd_to_rub: z.number().nullable().optional(),
  methods: z.array(TopUpMethodItemSchema),
});
