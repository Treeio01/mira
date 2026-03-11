import { useEffect, useMemo, useState } from 'react';
import { GradientHeader } from '../components/ui/GradientHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { CardListItem } from '../components/cards/CardListItem';
import { IssueCardButton } from '../components/ui/IssueCardButton';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useCardsStore, useAuthStore, selectCards, selectCardsLoading, selectCardsError } from '../store';
import { getLastDigits } from '../lib/format';

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

      <div className="flex flex-col w-full gap-1.5">
        {isLoading && cards.length === 0 && (
          <div className="flex justify-center py-8">
            <Spinner size={6} />
          </div>
        )}
        {error && cards.length === 0 && (
          <div className="py-8">
            <ErrorMessage message={error} onRetry={fetchCards} />
          </div>
        )}
        {filteredCards.map((card) => (
          <CardListItem
            key={card.card_id}
            card={card}
            onToggleFavorite={(id) => toggleFavourite(id, !card.is_favorite)}
          />
        ))}
        {!isLoading && !error && filteredCards.length === 0 && (
          <span className="text-white/50 text-sm text-center py-8">
            Карты не найдены
          </span>
        )}
      </div>

      <IssueCardButton />
    </div>
  );
}
