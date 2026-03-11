import { useEffect, useMemo, useState } from 'react';
import { GradientHeader } from '../components/ui/GradientHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { CardListItem } from '../components/cards/CardListItem';
import { IssueCardButton } from '../components/ui/IssueCardButton';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useCardsStore, useAuthStore, selectCards, selectCardsLoading, selectCardsError } from '../store';
import { getLastDigits } from '../lib/format';

function CardListSkeleton() {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex p-1.5 w-full items-center gap-3 bg-[#15111F] rounded-2xl border border-[#2A223E]">
          <Skeleton className="h-20 w-36 rounded-xl" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardsPage() {
  const cards = useCardsStore(selectCards);
  const isLoading = useCardsStore(selectCardsLoading);
  const error = useCardsStore(selectCardsError);
  const fetchCards = useCardsStore((s) => s.fetchCards);
  const toggleFavourite = useCardsStore((s) => s.toggleFavourite);
  const userId = useAuthStore((s) => s.userId);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(
      (c) =>
        c.type.toLowerCase().includes(q) ||
        (c.card_name?.toLowerCase().includes(q) ?? false) ||
        getLastDigits(c.number).includes(q),
    );
  }, [cards, search]);

  return (
    <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-18">
      <GradientHeader className="items-end justify-between gap-2.5">
        <span className="text-white font-semibold text-2xl leading-[120%] tracking-[-0.02em] z-10">
          Ваши<br />карты
        </span>
        {userId && (
          <div className="flex py-3 px-4 h-max rounded-lg bg-black/24 backdrop-blur-[7px] items-center z-10">
            <span className="text-white font-medium text-xs leading-[140%] tracking-[-0.02em] whitespace-nowrap">
              ID: {userId}
            </span>
          </div>
        )}
      </GradientHeader>

      <SearchInput value={search} onChange={setSearch} placeholder="Поиск карты" />

      {isLoading && cards.length === 0 && <CardListSkeleton />}

      {error && cards.length === 0 && (
        <div className="py-8">
          <ErrorMessage message={error} onRetry={fetchCards} />
        </div>
      )}

      {cards.length > 0 && (
        <div className="flex flex-col w-full gap-1.5">
          {filteredCards.map((card) => (
            <CardListItem
              key={card.card_id}
              card={card}
              onToggleFavorite={(id) => toggleFavourite(id, !card.is_favorite)}
            />
          ))}
          {filteredCards.length === 0 && (
            <span className="text-white/50 text-sm text-center py-8">
              Карты не найдены
            </span>
          )}
        </div>
      )}

      <IssueCardButton />
    </div>
  );
}
