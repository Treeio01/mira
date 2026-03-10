export interface CardData {
  id: string;
  name: string;
  variant: 'mastercard' | 'visa';
  number: string;
  lastDigits: string;
  expiry: string;
  cvc: string;
  holderName: string;
  address: string;
  region: string;
  warnings: string;
  balance: number;
  isFavorite: boolean;
}

export const mockCards: CardData[] = [
  { id: '1', name: 'Название 1', variant: 'mastercard', number: '4444 4444 4444 3132', lastDigits: '3132', expiry: '11/22', cvc: '111', holderName: 'Anton Nickola', address: '36~38 Westbourne Grove,Newton...', region: 'USA', warnings: '1 / 5', balance: 1245.20, isFavorite: true },
  { id: '2', name: 'Название 2', variant: 'visa', number: '4444 4444 4444 9021', lastDigits: '9021', expiry: '03/25', cvc: '274', holderName: 'John Smith', address: '12 Baker Street, London...', region: 'UK', warnings: '0 / 5', balance: 540.00, isFavorite: false },
  { id: '3', name: 'Название 3', variant: 'visa', number: '4444 4444 4444 7744', lastDigits: '7744', expiry: '08/24', cvc: '552', holderName: 'Maria Garcia', address: '15 Rue de Rivoli, Paris...', region: 'France', warnings: '2 / 5', balance: 1245.20, isFavorite: true },
  { id: '4', name: 'Название 4', variant: 'mastercard', number: '5555 5555 5555 5501', lastDigits: '5501', expiry: '12/26', cvc: '903', holderName: 'Klaus Weber', address: '7 Friedrichstraße, Berlin...', region: 'Germany', warnings: '0 / 5', balance: 320.50, isFavorite: false },
  { id: '5', name: 'Название 5', variant: 'visa', number: '4444 4444 4444 1188', lastDigits: '1188', expiry: '06/27', cvc: '417', holderName: 'Yuki Tanaka', address: '3-1 Shibuya, Tokyo...', region: 'Japan', warnings: '3 / 5', balance: 8900.00, isFavorite: false },
];

export function formatBalance(amount: number): { whole: string; cents: string } {
  const [whole, cents = '00'] = amount.toFixed(2).split('.');
  const formatted = Number(whole).toLocaleString('en-US');
  return { whole: `$${formatted}`, cents: `.${cents}` };
}
