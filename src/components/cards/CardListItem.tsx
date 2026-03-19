import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MiniCard } from './MiniCard';
import { StarIcon } from '../icons/StarIcon';
import { formatBalance, getLastDigits, resolveCardVariant } from '../../lib/format';
import { useUiStore, selectBalanceVisible } from '../../store';
import type { ListCardItem } from '../../services/api';
import { ROUTES } from '../../lib/routes';

interface CardListItemProps {
  card: ListCardItem;
  onToggleFavorite: (cardId: number, isFavorite: boolean) => void;
}

export const CardListItem = memo(function CardListItem({ card, onToggleFavorite }: CardListItemProps) {
  const { whole, cents } = formatBalance(card.balance);
  const lastDigits = getLastDigits(card.number);
  const navigate = useNavigate();
  const balanceVisible = useUiStore(selectBalanceVisible);

  const handleClick = useCallback(() => {
    navigate(ROUTES.CARD(card.card_id));
  }, [navigate, card.card_id]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(card.card_id, card.is_favorite);
  }, [onToggleFavorite, card.card_id, card.is_favorite]);

  return (
    <div
      className="flex p-1.5 w-full items-start justify-between bg-surface rounded-2xl border border-[#2A223E] cursor-pointer active:scale-[0.97] transition-transform duration-150"
      onClick={handleClick}
    >
      <div className="flex gap-3 items-center min-w-0 flex-1">
        <MiniCard
          variant={resolveCardVariant(card.type)}
          lastDigits={lastDigits}
          balance={whole}
          balanceCents={cents}
          balanceHidden={!balanceVisible}
        />
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-white font-medium text-xs tracking-[-0.02em] truncate">
            {card.card_name || card.type}
          </span>
          <span className="text-white flex font-semibold text-sm tracking-[-0.02em]">
            {balanceVisible ? <>{whole}<span className="text-white/64">{cents}</span></> : '***'}
          </span>
          <span className="text-white/72 font-medium text-xs tracking-[-0.02em]">
            *{lastDigits}
          </span>
        </div>
      </div>
      <button
        onClick={handleToggle}
        className="py-1.5 pr-1.5 transition-transform duration-200 active:scale-90"
      >
        <StarIcon filled={card.is_favorite} />
      </button>
    </div>
  );
});
