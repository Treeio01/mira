import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BalanceCard } from '../components/sections/BalanceCard';
import { CardNameEditor } from '../components/cards/CardNameEditor';
import { InfoRow } from '../components/ui/InfoRow';
import { InfoRowSkeleton } from '../components/ui/InfoRowSkeleton';
import { PageLayout } from '../components/ui/PageLayout';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useModal } from '../components/ui/ModalContext';
import { WarningIcon } from '../components/icons/WarningIcon';
import { useCardsStore, selectCurrentCard, selectCurrentCardLoading, selectCurrentCardError } from '../store';
import { ROUTES } from '../lib/routes';

export default function CardPage() {
  const { id } = useParams();
  const card = useCardsStore(selectCurrentCard);
  const isLoading = useCardsStore(selectCurrentCardLoading);
  const error = useCardsStore(selectCurrentCardError);
  const fetchCardInfo = useCardsStore((s) => s.fetchCardInfo);
  const clearCurrent = useCardsStore((s) => s.clearCurrent);

  const { showModal } = useModal();

  const parsedId = id ? Number(id) : NaN;
  const cardId = Number.isFinite(parsedId) ? parsedId : null;

  const [modalShownForId, setModalShownForId] = useState<number | null>(null);

  useEffect(() => {
    if (cardId != null) {
      fetchCardInfo(cardId);
    }
    return () => clearCurrent();
  }, [cardId, fetchCardInfo, clearCurrent]);

  useEffect(() => {
    if (card && cardId != null && modalShownForId !== cardId) {
      setModalShownForId(cardId);
      showModal({
        icon: <WarningIcon />,
        title: 'Важно',
        description: 'Отклонённые транзакции запрещены. Ваша карта может быть заблокирована при большом количестве предупреждений.',
        buttonText: 'Продолжить',
      });
    }
  }, [card, cardId, modalShownForId, showModal]);

  const handleRetry = useCallback(() => {
    if (cardId != null) fetchCardInfo(cardId);
  }, [cardId, fetchCardInfo]);

  if (error) {
    return (
      <PageLayout centered>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </PageLayout>
    );
  }

  const showSkeleton = isLoading || !card;

  return (
    <PageLayout>
      <BalanceCard
        title="Баланс Карты"
        balance={card?.balance}
        loading={showSkeleton}
        status={card?.status}
        topUpRoute={cardId != null ? ROUTES.CARD_TOP_UP(cardId) : undefined}
        topUpLabel="Пополнить карту"
      />

      <div className="flex flex-col gap-1.5">
        {showSkeleton ? (
          Array.from({ length: 8 }, (_, i) => (
            <InfoRowSkeleton key={i} />
          ))
        ) : (
          <>
            <CardNameEditor card={card} />
            <InfoRow label="Категория" value={card.category_name} />
            <InfoRow label="Номер" value={card.number} copyValue={card.number} />
            <InfoRow label="Месяц/год" value={card.date} copyValue={card.date} />
            <InfoRow label="CVC" value={card.cvc} copyValue={card.cvc} />
            <InfoRow label="Имя владельца" value={card.owner_name} copyValue={card.owner_name} />
            <InfoRow label="Адрес" value={card.address} copyValue={card.address} />
            <InfoRow label="Регион" value={card.region} copyValue={card.region} />
            {card.warnings != null && (
              <InfoRow label="Предупреждений" value={String(card.warnings)} />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
