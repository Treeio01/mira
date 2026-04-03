import { useState, useCallback, useMemo } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { selectCards, useCardsStore } from '../../store';

interface TypeFilterSheetProps {
  open: boolean;
  onClose: () => void;
  currentAccounts: string[];
  currentTypes: string[];
  onApply: (accounts: string[], types: string[]) => void;
}

interface FilterOption {
  key: string;
  label: string;
}

interface FilterSection {
  title?: string;
  group: 'accounts' | 'types';
  options: FilterOption[];
}

export function TypeFilterSheet({ open, onClose, currentAccounts, currentTypes, onApply }: TypeFilterSheetProps) {
  const cards = useCardsStore(selectCards);
  const [accounts, setAccounts] = useState<string[]>(currentAccounts);
  const [types, setTypes] = useState<string[]>(currentTypes);
  const [prevOpen, setPrevOpen] = useState(false);

  // Sync only on open transition (false → true)
  if (open && !prevOpen) {
    setAccounts(currentAccounts);
    setTypes(currentTypes);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const sections: FilterSection[] = useMemo(() => [
    {
      title: 'СЧЕТА',
      group: 'accounts' as const,
      options: [
        { key: 'all', label: 'Все счета' },
        { key: 'main_balance', label: 'Основной баланс' },
        ...cards.map((card) => ({
          key: `card_${card.card_id}`,
          label: card.card_name || `Карта *${card.number.replace(/\s/g, '').slice(-4)}`,
        })),
      ],
    },
    {
      title: 'ТИП ОПЕРАЦИИ',
      group: 'types' as const,
      options: [
        { key: 'all', label: 'Все операции' },
        { key: 'topup_balance', label: 'Пополнение баланса' },
        { key: 'topup_card', label: 'Пополнение карт' },
        { key: 'success_payments', label: 'Успешные платежи' },
        { key: 'failed_payments', label: 'Отклонённые транзакции' },
        { key: 'commissions', label: 'Комиссии' },
        { key: 'others', label: 'Другие' },
      ],
    },
  ], [cards]);

  const handleToggle = useCallback((group: 'accounts' | 'types', key: string) => {
    const setter = group === 'accounts' ? setAccounts : setTypes;
    if (key === 'all') {
      setter(['all']);
      return;
    }
    setter((prev) => {
      const withoutAll = prev.filter((k) => k !== 'all');
      if (withoutAll.includes(key)) {
        const next = withoutAll.filter((k) => k !== key);
        return next.length === 0 ? ['all'] : next;
      }
      return [...withoutAll, key];
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply(accounts, types);
    onClose();
  }, [accounts, types, onApply, onClose]);

  const isSelected = useCallback((group: 'accounts' | 'types', key: string) => {
    return (group === 'accounts' ? accounts : types).includes(key);
  }, [accounts, types]);

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
                    onClick={() => handleToggle(section.group, opt.key)}
                    className="flex items-center justify-between w-full px-4 py-3 active:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-white text-sm font-medium leading-[140%] tracking-[-0.02em]">
                      {opt.label}
                    </span>
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                        isSelected(section.group, opt.key)
                          ? 'border-primary bg-primary'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected(section.group, opt.key) && (
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
