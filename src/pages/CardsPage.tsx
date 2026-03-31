import { useEffect, useMemo, useState, useCallback } from 'react';
import { GradientHeader } from '../components/ui/GradientHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { CardListItem } from '../components/cards/CardListItem';
import { CardListItemSkeleton } from '../components/cards/CardListItemSkeleton';
import { IssueCardButton } from '../components/ui/IssueCardButton';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { UserIdBadge } from '../components/ui/UserIdBadge';
import { useCardsStore, selectCards, selectCardsLoading, selectCardsError } from '../store';
import { getLastDigits } from '../lib/format';

export default function CardsPage() {
  const cards = useCardsStore(selectCards);
  const isLoading = useCardsStore(selectCardsLoading);
  const error = useCardsStore(selectCardsError);
  const fetchCards = useCardsStore((s) => s.fetchCards);
  const toggleFavorite = useCardsStore((s) => s.toggleFavorite);
  const [search, setSearch] = useState('');

  const handleToggleFavorite = useCallback(
    (cardId: number, isFavorite: boolean) => toggleFavorite(cardId, !isFavorite),
    [toggleFavorite],
  );

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
    <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-36 overflow-y-auto no-scrollbar">
      <GradientHeader className="items-end justify-between gap-2.5">
        <span className="text-white font-semibold text-2xl leading-[120%] tracking-[-0.02em] z-10">
          Ваши<br />карты
        </span>
        <UserIdBadge />
      </GradientHeader>

      <SearchInput value={search} onChange={setSearch} placeholder="Поиск карты" />

      {isLoading && cards.length === 0 && (
        <div className="flex flex-col w-full gap-1.5">
          {Array.from({ length: 4 }, (_, i) => (
            <CardListItemSkeleton key={i} />
          ))}
        </div>
      )}

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
              onToggleFavorite={handleToggleFavorite}
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
