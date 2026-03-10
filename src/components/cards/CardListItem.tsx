import { useNavigate } from 'react-router-dom';
import { MiniCard } from './MiniCard';
import { StarIcon } from '../icons/StarIcon';
import { formatBalance, type CardData } from '../../lib/mock-data';

interface CardListItemProps {
  card: CardData;
  onToggleFavorite: (id: string) => void;
}

export function CardListItem({ card, onToggleFavorite }: CardListItemProps) {
  const { whole, cents } = formatBalance(card.balance);
  const navigate = useNavigate();

  return (
    <div
      className="flex p-1.5 w-full items-start justify-between bg-[#15111F] rounded-2xl border border-[#2A223E] cursor-pointer active:scale-[0.98] transition-transform duration-150"
      onClick={() => navigate(`/cards/${card.id}`)}
    >
      <div className="flex gap-3 items-center">
        <MiniCard
          variant={card.variant}
          lastDigits={card.lastDigits}
          balance={whole}
          balanceCents={cents}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-white font-medium text-xs tracking-[-0.02em]">
            {card.name}
          </span>
          <span className="text-white flex font-semibold text-sm tracking-[-0.02em]">
            {whole}<span className="text-white/64">{cents}</span>
          </span>
          <span className="text-white/72 font-medium text-xs tracking-[-0.02em]">
            *{card.lastDigits}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(card.id); }}
        className="py-1.5 pr-1.5 transition-transform duration-200 active:scale-90"
      >
        <StarIcon filled={card.isFavorite} />
      </button>
    </div>
  );
}
