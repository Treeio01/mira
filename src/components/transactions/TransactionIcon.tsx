import { memo } from 'react';

interface TransactionIconProps {
  name: string;
  color: string;
}

function resolveIconType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('отклон')) return 'declined';
  if (lower.includes('комисси')) return 'commission';
  if (lower.includes('пополнение карт')) return 'card_topup';
  if (lower.includes('пополнение') || lower.includes('зачисление')) return 'balance_topup';
  if (lower.includes('покупка') || lower.includes('оплата')) return 'purchase';
  return 'other';
}

export const TransactionIcon = memo(function TransactionIcon({ name, color }: TransactionIconProps) {
  const type = resolveIconType(name);

  // For declined transactions, use the red styling regardless
  const config = color === 'red' ? ICON_CONFIG.declined : (ICON_CONFIG[type] ?? ICON_CONFIG.other);

  return (
    <div className={`flex items-center justify-center w-9 h-9 rounded-[8px] shrink-0 ${config.bg}`}>
      {config.icon}
    </div>
  );
});

const ICON_CONFIG: Record<string, { bg: string; icon: React.ReactNode }> = {
  declined: {
    bg: 'bg-[#261F38]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.1668 5.8335L5.8335 14.1668M5.8335 5.8335L14.1668 14.1668" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
    ),
  },
  purchase: {
    bg: 'bg-[#261F38]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

    ),
  },
  commission: {
    bg: 'bg-[#261F38]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.8332 4.1665L4.1665 15.8332M7.49984 5.83317C7.49984 6.75365 6.75365 7.49984 5.83317 7.49984C4.9127 7.49984 4.1665 6.75365 4.1665 5.83317C4.1665 4.9127 4.9127 4.1665 5.83317 4.1665C6.75365 4.1665 7.49984 4.9127 7.49984 5.83317ZM15.8332 14.1665C15.8332 15.087 15.087 15.8332 14.1665 15.8332C13.246 15.8332 12.4998 15.087 12.4998 14.1665C12.4998 13.246 13.246 12.4998 14.1665 12.4998C15.087 12.4998 15.8332 13.246 15.8332 14.1665Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
    ),
  },
  card_topup: {
    bg: 'bg-[#261F38]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8332 17.4998V12.4998M13.3332 14.9998H18.3332M18.3332 8.33317H1.6665M18.3332 9.99984V6.83317C18.3332 5.89975 18.3332 5.43304 18.1515 5.07652C17.9917 4.76292 17.7368 4.50795 17.4232 4.34816C17.0666 4.1665 16.5999 4.1665 15.6665 4.1665H4.33317C3.39975 4.1665 2.93304 4.1665 2.57652 4.34816C2.26292 4.50795 2.00795 4.76292 1.84816 5.07652C1.6665 5.43304 1.6665 5.89975 1.6665 6.83317V13.1665C1.6665 14.0999 1.6665 14.5666 1.84816 14.9232C2.00795 15.2368 2.26292 15.4917 2.57652 15.6515C2.93304 15.8332 3.39975 15.8332 4.33317 15.8332H9.99984" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    ),
  },
  balance_topup: {
    bg: 'bg-[#261F38]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.99984 14.1667C9.99984 16.4679 11.8653 18.3333 14.1665 18.3333C16.4677 18.3333 18.3332 16.4679 18.3332 14.1667C18.3332 11.8655 16.4677 10 14.1665 10C11.8653 10 9.99984 11.8655 9.99984 14.1667ZM9.99984 14.1667C9.99984 13.2285 10.3099 12.3627 10.8332 11.6663V4.16667M9.99984 14.1667C9.99984 14.8545 10.1665 15.5033 10.4616 16.0751C9.75956 16.6681 8.13804 17.0833 6.24984 17.0833C3.71853 17.0833 1.6665 16.3371 1.6665 15.4167V4.16667M10.8332 4.16667C10.8332 5.08714 8.78114 5.83333 6.24984 5.83333C3.71853 5.83333 1.6665 5.08714 1.6665 4.16667M10.8332 4.16667C10.8332 3.24619 8.78114 2.5 6.24984 2.5C3.71853 2.5 1.6665 3.24619 1.6665 4.16667M1.6665 11.6667C1.6665 12.5871 3.71853 13.3333 6.24984 13.3333C8.07401 13.3333 9.64927 12.9458 10.387 12.3848M10.8332 7.91667C10.8332 8.83714 8.78114 9.58333 6.24984 9.58333C3.71853 9.58333 1.6665 8.83714 1.6665 7.91667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
    ),
  },
  other: {
    bg: 'bg-[#261F38]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_239_2668)">
      <path d="M1.6665 1.6665H2.75497C2.95999 1.6665 3.0625 1.6665 3.14499 1.7042C3.21769 1.73743 3.27929 1.79086 3.32246 1.85813C3.37145 1.93446 3.38595 2.03594 3.41494 2.23889L3.80936 4.99984M3.80936 4.99984L4.68594 11.4427C4.79718 12.2603 4.85279 12.6691 5.04825 12.9768C5.22049 13.2479 5.46741 13.4635 5.7593 13.5976C6.09056 13.7498 6.50312 13.7498 7.32826 13.7498H14.4598C15.2453 13.7498 15.638 13.7498 15.959 13.6085C16.242 13.4839 16.4847 13.283 16.6601 13.0284C16.8589 12.7395 16.9324 12.3537 17.0794 11.5821L18.1824 5.79125C18.2342 5.51968 18.26 5.38389 18.2225 5.27775C18.1897 5.18465 18.1248 5.10624 18.0395 5.05652C17.9422 4.99984 17.804 4.99984 17.5275 4.99984H3.80936ZM8.33317 17.4998C8.33317 17.9601 7.96007 18.3332 7.49984 18.3332C7.0396 18.3332 6.6665 17.9601 6.6665 17.4998C6.6665 17.0396 7.0396 16.6665 7.49984 16.6665C7.96007 16.6665 8.33317 17.0396 8.33317 17.4998ZM14.9998 17.4998C14.9998 17.9601 14.6267 18.3332 14.1665 18.3332C13.7063 18.3332 13.3332 17.9601 13.3332 17.4998C13.3332 17.0396 13.7063 16.6665 14.1665 16.6665C14.6267 16.6665 14.9998 17.0396 14.9998 17.4998Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_239_2668">
      <rect width="20" height="20" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      
    ),
  },
};
