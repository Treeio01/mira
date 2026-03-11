export type CardVariant = 'mastercard' | 'visa';

export function formatBalance(amount: number): { whole: string; cents: string } {
  if (!Number.isFinite(amount)) {
    return { whole: '$0', cents: '.00' };
  }
  const [whole, cents = '00'] = amount.toFixed(2).split('.');
  const formatted = Number(whole).toLocaleString('en-US');
  return { whole: `$${formatted}`, cents: `.${cents}` };
}

export function getLastDigits(number: string): string {
  return number.replace(/\s/g, '').slice(-4);
}

export function resolveCardVariant(type: string): CardVariant {
  if (type === 'Visa') return 'visa';
  return 'mastercard';
}
