export const ROUTES = {
  HOME: '/',
  CARDS: '/cards',
  CARDS_CREATE: '/cards/create',
  CARD_CONFIRM: (categoryId: number) => `/cards/create/${categoryId}`,
  CARD: (id: number) => `/cards/${id}`,
  CARD_TOP_UP: (id: number) => `/cards/${id}/top-up`,
  ESIM: '/esim',
  ESIM_CONFIRM: (categoryId: number) => `/esim/${categoryId}`,
  REFERRAL: '/reffer',
  TOP_UP: '/top-up',
} as const;
