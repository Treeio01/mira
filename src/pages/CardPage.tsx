import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BalanceCard } from '../components/sections/BalanceCard';
import { InfoRow } from '../components/ui/InfoRow';
import { InfoRowSkeleton } from '../components/ui/InfoRowSkeleton';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useModal } from '../components/ui/ModalProvider';
import { WarningIcon } from '../components/icons/WarningIcon';
import { EditIcon } from '../components/icons/EditIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { CloseIcon } from '../components/icons/CloseIcon';
import { useCardsStore, selectCurrentCard, selectCurrentCardLoading, selectCurrentCardError } from '../store';
import { useCardNameEdit } from '../hooks/useCardNameEdit';

export function CardPage() {
  const { id } = useParams();
  const card = useCardsStore(selectCurrentCard);
  const isLoading = useCardsStore(selectCurrentCardLoading);
  const error = useCardsStore(selectCurrentCardError);
  const fetchCardInfo = useCardsStore((s) => s.fetchCardInfo);
  const clearCurrent = useCardsStore((s) => s.clearCurrent);

  const { showModal } = useModal();
  const { isEditing, editName, setEditName, startEdit, saveName, cancelEdit } = useCardNameEdit(card);

  const parsedId = id ? Number(id) : NaN;
  const cardId = Number.isFinite(parsedId) ? parsedId : null;

  const modalShown = useRef(false);

  useEffect(() => {
    modalShown.current = false;
    if (cardId != null) {
      fetchCardInfo(cardId);
    }
    return () => clearCurrent();
  }, [cardId, fetchCardInfo, clearCurrent]);

  useEffect(() => {
    if (card && !modalShown.current) {
      modalShown.current = true;
      showModal({
        icon: <WarningIcon />,
        title: 'Важно',
        description: 'Отклонённые транзакции запрещены. Ваша карта может быть заблокирована при большом количестве предупреждений.',
        buttonText: 'Продолжить',
      });
    }
  }, [card, showModal]);

  const handleRetry = useCallback(() => {
    if (cardId != null) fetchCardInfo(cardId);
  }, [cardId, fetchCardInfo]);

  if (error) {
    return (
      <>
        <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19 items-center justify-center">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
        <BackBottomBar />
      </>
    );
  }

  const showSkeleton = isLoading || !card;

  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
        <BalanceCard title="Баланс Карты" balance={card?.balance} loading={showSkeleton} status={card?.status} />

        <div className="flex flex-col gap-1.5">
          {showSkeleton ? (
            Array.from({ length: 7 }, (_, i) => (
              <InfoRowSkeleton key={i} />
            ))
          ) : (
            <>
              {isEditing ? (
                <div className="flex w-full bg-[#181424] items-center justify-between rounded-lg gap-2.5 py-2 px-4">
                  <span className="text-[#A095BD] text-sm font-medium leading-[140%] tracking-[-0.02em] whitespace-nowrap">
                    Имя карточки
                  </span>
                  <div className="flex gap-1.5 items-center">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={64}
                      autoFocus
                      className="bg-transparent text-white text-sm font-medium text-right outline-none w-32"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button onClick={saveName} className="active:scale-90 transition-transform">
                      <CheckIcon />
                    </button>
                    <button onClick={cancelEdit} className="active:scale-90 transition-transform">
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <InfoRow
                  label="Имя карточки"
                  value={card.card_name}
                  action={
                    <button onClick={startEdit} className="active:scale-90 transition-transform">
                      <EditIcon />
                    </button>
                  }
                />
              )}
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
      </div>
      <BackBottomBar />
    </>
  );
}
