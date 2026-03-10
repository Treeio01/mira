import { useParams } from 'react-router-dom';
import { BalanceCard } from '../components/sections/BalanceCard';
import { InfoRow } from '../components/ui/InfoRow';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import { mockCards } from '../lib/mock-data';

export function CardPage() {
  const { id } = useParams();
  const card = mockCards.find((c) => c.id === id) ?? mockCards[0];

  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
        <BalanceCard title="Баланс Карты" />
        <div className="flex flex-col gap-1.5">
          <InfoRow label="Имя карточки" value={card.name} />
          <InfoRow label="Номер" value={card.number} copyValue={card.number} />
          <InfoRow label="Месяц/год" value={card.expiry} copyValue={card.expiry} />
          <InfoRow label="CVC" value={card.cvc} copyValue={card.cvc} />
          <InfoRow label="Имя владельца" value={card.holderName} copyValue={card.holderName} />
          <InfoRow label="Адрес" value={card.address} copyValue={card.address} />
          <InfoRow label="Регион" value={card.region} copyValue={card.region} />
          <InfoRow label="Предупреждений" value={card.warnings} />
        </div>
      </div>
      <BackBottomBar />
    </>
  );
}
