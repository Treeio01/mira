import { useState, useCallback, useMemo } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { selectCards, useCardsStore } from '../../store';

interface TypeFilterSheetProps {
  open: boolean;
  onClose: () => void;
  currentFilters: string[];
  onApply: (filters: string[]) => void;
}

interface FilterOption {
  key: string;
  label: string;
}

interface FilterSection {
  title?: string;
  options: FilterOption[];
}

export function TypeFilterSheet({ open, onClose, currentFilters, onApply }: TypeFilterSheetProps) {
  const cards = useCardsStore(selectCards);
  const [selected, setSelected] = useState<string[]>(currentFilters);
  const [prevOpen, setPrevOpen] = useState(false);

  // Sync only on open transition (false → true)
  if (open && !prevOpen) {
    setSelected(currentFilters);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const sections: FilterSection[] = useMemo(() => [
    {
      options: [{ key: 'all', label: 'Все операции' }],
    },
    {
      title: 'СЧЕТА',
      options: [
        { key: 'main_balance', label: 'Основной баланс' },
        ...cards.map((card) => ({
          key: `card_${card.card_id}`,
          label: `Карта *${card.number.replace(/\s/g, '').slice(-4)}`,
        })),
      ],
    },
    {
      title: 'ПОПОЛНЕНИЯ',
      options: [
        { key: 'topup_balance', label: 'Пополнение баланса' },
        { key: 'topup_cards', label: 'Пополнение карт' },
      ],
    },
    {
      title: 'ОПЛАТЫ',
      options: [
        { key: 'purchase', label: 'Оплата товара' },
        { key: 'declined', label: 'Отклонённые транзакции' },
        { key: 'commission', label: 'Комиссии' },
        { key: 'other', label: 'Другие расходы' },
      ],
    },
  ], [cards]);

  const handleToggle = useCallback((key: string) => {
    if (key === 'all') {
      setSelected(['all']);
      return;
    }
    setSelected((prev) => {
      const withoutAll = prev.filter((k) => k !== 'all');
      if (withoutAll.includes(key)) {
        const next = withoutAll.filter((k) => k !== key);
        return next.length === 0 ? ['all'] : next;
      }
      return [...withoutAll, key];
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply(selected);
    onClose();
  }, [selected, onApply, onClose]);

  const isSelected = useCallback((key: string) => selected.includes(key), [selected]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Какие операции показать?" footer={
      <div className="px-5 py-4">
        <button
          onClick={handleApply}
          className="w-full p-3 rounded-lg bg-primary text-white font-medium text-sm active:scale-[0.97] transition-transform"
        >
          Применить
        </button>
      </div>
    }>
      <div className="flex flex-col pb-2">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <div className="px-5 pt-4 pb-2">
                <span className="text-[#B6ACD2] text-[14px] font-medium tracking-[0.02em] uppercase">
                  {section.title}
                </span>
              </div>
            )}
            <div className="mx-4 rounded-xl overflow-hidden bg-white/[0.03]">
              {section.options.map((opt) => (
                <div key={opt.key}>
                  <button
                    onClick={() => handleToggle(opt.key)}
                    className="flex items-center justify-between w-full px-4 py-3 active:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-white text-sm font-medium leading-[140%] tracking-[-0.02em]">
                      {opt.label}
                    </span>
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                        isSelected(opt.key)
                          ? 'border-primary bg-primary'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected(opt.key) && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="#221C33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
