export type CardVariant = 'mastercard' | 'visa';

export function formatBalance(amount: number): { whole: string; cents: string } {
  const [whole, cents = '00'] = amount.toFixed(2).split('.');
  const formatted = Number(whole).toLocaleString('en-US');
  return { whole: `$${formatted}`, cents: `.${cents}` };
}

export function getLastDigits(number: string): string {
  return number.replace(/\s/g, '').slice(-4);
}

/**
 * API type → variant для стилей.
 * type строго "MasterCard" или "Visa".
 */
export function resolveCardVariant(type: string): CardVariant {
  if (type === 'Visa') return 'visa';
  return 'mastercard';
}
