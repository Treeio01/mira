import { useMemo, useState } from 'react';
import { GradientHeader } from '../components/ui/GradientHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { CardListItem } from '../components/cards/CardListItem';
import { IssueCardButton } from '../components/ui/IssueCardButton';
import { mockCards, type CardData } from '../lib/mock-data';

export function CardsPage() {
  const [cards, setCards] = useState<CardData[]>(mockCards);
  const [search, setSearch] = useState('');

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastDigits.includes(q),
    );
  }, [cards, search]);

  const toggleFavorite = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)),
    );
  };

  return (
    <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-18">
      <GradientHeader className="items-end justify-between gap-2.5">
        <span className="text-white font-semibold text-2xl leading-[120%] tracking-[-0.02em] z-10">
          Ваши<br />карты
        </span>
        <div className="flex py-3 px-4 h-max rounded-lg bg-black/24 backdrop-blur-[7px] items-center z-10">
          <span className="text-white font-medium text-xs leading-[140%] tracking-[-0.02em] whitespace-nowrap">
            ID: 2831234
          </span>
        </div>
      </GradientHeader>

      <SearchInput value={search} onChange={setSearch} placeholder="Поиск карты" />

      <div className="flex flex-col w-full gap-1.5">
        {filteredCards.map((card) => (
          <CardListItem
            key={card.id}
            card={card}
            onToggleFavorite={toggleFavorite}
          />
        ))}
        {filteredCards.length === 0 && (
          <span className="text-white/50 text-sm text-center py-8">
            Карты не найдены
          </span>
        )}
      </div>

      <IssueCardButton />
    </div>
  );
}
