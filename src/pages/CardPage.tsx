import { memo, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BalanceCard } from '../components/sections/BalanceCard';
import { InfoRow } from '../components/ui/InfoRow';
import { InfoRowSkeleton } from '../components/ui/InfoRowSkeleton';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useModal } from '../components/ui/ModalProvider';
import { WarningIcon } from '../components/icons/WarningIcon';
import { useCardsStore, selectCurrentCard, selectCurrentCardLoading, selectCurrentCardError } from '../store';

const EditIcon = memo(function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 1.5L16.5 4.5M1.5 16.5L2.25 13.5L12.75 3L15 5.25L4.5 15.75L1.5 16.5Z" stroke="#A095BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
});

const CheckIcon = memo(function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 9L7.5 12.75L14.25 6" stroke="#661AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
});

const CloseIcon = memo(function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="#A095BD" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
});

export function CardPage() {
  const { id } = useParams();
  const card = useCardsStore(selectCurrentCard);
  const isLoading = useCardsStore(selectCurrentCardLoading);
  const error = useCardsStore(selectCurrentCardError);
  const fetchCardInfo = useCardsStore((s) => s.fetchCardInfo);
  const clearCurrent = useCardsStore((s) => s.clearCurrent);
  const renameCard = useCardsStore((s) => s.renameCard);

  const { showModal } = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const cardId = id ? Number(id) : null;

  useEffect(() => {
    if (cardId != null && !Number.isNaN(cardId)) {
      fetchCardInfo(cardId);
    }
    return () => clearCurrent();
  }, [cardId, fetchCardInfo, clearCurrent]);

  useEffect(() => {
    if (card) {
      showModal({
        icon: <WarningIcon />,
        title: 'Важно',
        description: 'Отклонённые транзакции запрещены. Ваша карта может быть заблокирована при большом количестве предупреждений.',
        buttonText: 'Продолжить',
      });
    }
  }, [card, showModal]);

  const handleStartEdit = useCallback(() => {
    if (card) {
      setEditName(card.card_name);
      setIsEditing(true);
    }
  }, [card]);

  const handleSaveName = useCallback(() => {
    if (card && editName.trim() && editName.trim() !== card.card_name) {
      renameCard(card.card_id, editName.trim());
    }
    setIsEditing(false);
  }, [card, editName, renameCard]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

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
        <BalanceCard title="Баланс Карты" balance={card?.balance} loading={showSkeleton} />

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
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button onClick={handleSaveName} className="active:scale-90 transition-transform">
                      <CheckIcon />
                    </button>
                    <button onClick={handleCancelEdit} className="active:scale-90 transition-transform">
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <InfoRow
                  label="Имя карточки"
                  value={card.card_name}
                  action={
                    <button onClick={handleStartEdit} className="active:scale-90 transition-transform">
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
