import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BalanceCard } from '../components/sections/BalanceCard';
import { InfoRow } from '../components/ui/InfoRow';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import { useCardsStore, selectCurrentCard, selectCurrentCardLoading } from '../store';

export function CardPage() {
  const { id } = useParams();
  const card = useCardsStore(selectCurrentCard);
  const isLoading = useCardsStore(selectCurrentCardLoading);
  const fetchCardInfo = useCardsStore((s) => s.fetchCardInfo);
  const clearCurrent = useCardsStore((s) => s.clearCurrent);

  useEffect(() => {
    if (id) {
      fetchCardInfo(Number(id));
    }
    return () => clearCurrent();
  }, [id, fetchCardInfo, clearCurrent]);

  if (isLoading || !card) {
    return (
      <>
        <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
          <span className="text-white/50 text-sm text-center py-8">Загрузка...</span>
        </div>
        <BackBottomBar />
      </>
    );
  }

  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
        <BalanceCard title="Баланс Карты" balance={card.balance} />
        <div className="flex flex-col gap-1.5">
          <InfoRow label="Имя карточки" value={card.card_name} />
          <InfoRow label="Номер" value={card.number} copyValue={card.number} />
          <InfoRow label="Месяц/год" value={card.date} copyValue={card.date} />
          <InfoRow label="CVC" value={card.cvc} copyValue={card.cvc} />
          <InfoRow label="Имя владельца" value={card.owner_name} copyValue={card.owner_name} />
          <InfoRow label="Адрес" value={card.address} copyValue={card.address} />
          <InfoRow label="Регион" value={card.region} copyValue={card.region} />
          {card.warnings && <InfoRow label="Предупреждений" value={card.warnings} />}
        </div>
      </div>
      <BackBottomBar />
    </>
  );
}
