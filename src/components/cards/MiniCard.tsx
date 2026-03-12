import { memo, type CSSProperties } from 'react';
import { MastercardLogo } from '../icons/MastercardLogo';
import { VisaLogo } from '../icons/VisaLogo';
import type { CardVariant } from '../../lib/format';

const variantStyles: Record<CardVariant, CSSProperties> = {
  mastercard: {
    background: 'radial-gradient(189.9% 272.05% at -15.85% 200.6%, rgb(255 255 255 / 39%) 0%, rgba(102, 26, 255, 0) 100%), linear-gradient(rgb(102, 26, 255) 0%, rgb(61, 15, 153) 100%)',
    boxShadow: '#E7AEF6 3px -2px 12px 0px inset',
  },
  visa: {
    background: 'radial-gradient(83.33% 82.32% at 50% -22.02%, #AF93E6 0%, rgba(102, 26, 255, 0) 100%), radial-gradient(79.74% 53.57%, rgb(102, 26, 255) 0%, rgb(61, 15, 153) 100%), rgba(255, 255, 255, 0.06)',
  },
};

const variantLogos: Record<CardVariant, React.FC<{ className?: string }>> = {
  mastercard: MastercardLogo,
  visa: VisaLogo,
};

interface MiniCardProps {
  variant: CardVariant;
  lastDigits: string;
  balance: string;
  balanceCents: string;
  balanceHidden?: boolean;
}

export const MiniCard = memo(function MiniCard({ variant, lastDigits, balance, balanceCents, balanceHidden }: MiniCardProps) {
  const Logo = variantLogos[variant];

  return (
    <div
      className="flex min-w-36 p-3 rounded-xl flex-col justify-between"
      style={variantStyles[variant]}
    >
      <Logo />
      <span className="text-white/50 font-medium text-xs leading-[140%] tracking-[-0.02em]">
        *{lastDigits}
      </span>
      <span className="font-semibold text-sm leading-[140%] tracking-[-0.01em] text-white">
        {balanceHidden ? '***' : <>{balance}<span className="text-white/50">{balanceCents}</span></>}
      </span>
    </div>
  );
});
