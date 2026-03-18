import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { MiniCard } from '../cards/MiniCard';
import { Skeleton } from '../ui/Skeleton';
import { useMenuStore, useUiStore, selectMenuFavorites, selectBalanceVisible } from '../../store';
import { formatBalance, getLastDigits, resolveCardVariant } from '../../lib/format';
import type { FavoriteCardItem } from '../../services/api';
import { ROUTES } from '../../lib/routes';

interface FavoriteCardsProps {
  loading?: boolean;
}

export function FavoriteCards({ loading }: FavoriteCardsProps) {
  const navigate = useNavigate();
  const favorites = useMenuStore(selectMenuFavorites);
  const balanceVisible = useUiStore(selectBalanceVisible);

  const handleNavigate = useCallback(
    (cardId: number) => navigate(ROUTES.CARD(cardId)),
    [navigate],
  );

  if (!loading && favorites.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <span className="text-white text-xl font-medium leading-[160%] tracking-[-0.02em]">
        Избранные карты
      </span>
      <div className="flex gap-1.5 items-stretch">
        <button onClick={() => navigate(ROUTES.CARDS_CREATE)} className="py-8 px-5 border border-[#452686] rounded-xl flex items-center justify-center bg-linear-to-br from-[#1C1132] via-[#2B145D] to-[#1C1132]">
          <PlusCircleIcon />
        </button>
        <div className="flex w-full overflow-x-scroll gap-1.5 items-stretch">
          {loading ? (
            <>
              <Skeleton className="h-22 min-w-36 rounded-xl" />
              <Skeleton className="h-22 min-w-36 rounded-xl" />
            </>
          ) : (
            favorites.map((card) => (
              <FavoriteCardMini
                key={card.card_id}
                card={card}
                balanceVisible={balanceVisible}
                onNavigate={handleNavigate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface FavoriteCardMiniProps {
  card: FavoriteCardItem;
  balanceVisible: boolean;
  onNavigate: (cardId: number) => void;
}

const FavoriteCardMini = memo(function FavoriteCardMini({
  card,
  balanceVisible,
  onNavigate,
}: FavoriteCardMiniProps) {
  const { whole, cents } = formatBalance(card.balance);

  return (
    <div
      onClick={() => onNavigate(card.card_id)}
      className="cursor-pointer active:scale-[0.97] transition-transform duration-150"
    >
      <MiniCard
        variant={resolveCardVariant(card.type)}
        lastDigits={getLastDigits(card.number)}
        balance={whole}
        balanceCents={cents}
        balanceHidden={!balanceVisible}
      />
    </div>
  );
});
