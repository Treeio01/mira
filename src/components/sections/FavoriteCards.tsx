import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { MiniCard } from '../cards/MiniCard';
import { useMenuStore, selectMenuFavourites } from '../../store';
import { formatBalance, getLastDigits, resolveCardVariant } from '../../lib/format';

export function FavoriteCards() {
  const navigate = useNavigate();
  const favourites = useMenuStore(selectMenuFavourites);

  if (favourites.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <span className="text-white text-xl font-medium leading-[160%] tracking-[-0.02em]">
        Избранные карты
      </span>
      <div className="flex gap-1.5 items-stretch">
        <button className="py-8 px-5 border border-[#452686] rounded-xl flex items-center justify-center bg-linear-to-br from-[#1C1132] via-[#2B145D] to-[#1C1132]">
          <PlusCircleIcon />
        </button>
        <div className="flex w-full overflow-x-scroll gap-1.5">
          {favourites.map((card) => {
            const { whole, cents } = formatBalance(card.balance);
            return (
              <div
                key={card.card_id}
                onClick={() => navigate(`/cards/${card.card_id}`)}
                className="cursor-pointer active:scale-[0.97] transition-transform duration-150"
              >
                <MiniCard
                  variant={resolveCardVariant(card.type)}
                  lastDigits={getLastDigits(card.number)}
                  balance={whole}
                  balanceCents={cents}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
